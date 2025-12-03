import { Injectable, NotFoundException } from '@nestjs/common';
import { MercadoPagoService } from '../mercadopago/mercadopago.service';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';
import { Suscripcion } from './entities/suscripcion.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Plan } from '../plan/entities/plan.entity';

@Injectable()
export class SuscripcionService {
  constructor(
    private readonly mpService: MercadoPagoService,
    @InjectRepository(Suscripcion)
    private readonly suscripcionRepository: Repository<Suscripcion>,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Plan)
    private readonly planRepo: Repository<Plan>,
  ) { }

  async crear(dto: CreateSuscripcionDto) {
    const usuario = await this.usuarioRepo.findOne({ where: { id_usuario: dto.id_usuario } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const plan = await this.planRepo.findOne({ where: { id_plan: dto.id_plan } });
    if (!plan) throw new NotFoundException('Plan no encontrado');

    // Crear suscripción en MercadoPago
    const mp = await this.mpService.crearSuscripcion(usuario.email, plan.precio, plan.nombre);

    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + dto.mesesContratados);

    // Guardamos la suscripción en estado "Pendiente"
    const suscripcion = this.suscripcionRepository.create({
      usuario,
      plan,
      fechaInicio,
      fechaFin,
      mesesContratados: dto.mesesContratados,
      montoPagado: plan.precio * dto.mesesContratados,
      estado: 'PENDIENTE',
      preapprovalId: mp.id,
    });

    await this.suscripcionRepository.save(suscripcion);

    return mp; // Devuelve init_point y id para pagar
  }


  async cancelar(preapprovalId: string) {
    await this.mpService.cancelarSuscripcion(preapprovalId);
    await this.suscripcionRepository.update({ preapprovalId }, { estado: 'CANCELADA' });
  }

   async actualizarEstado(preapprovalId: string, estado: string) {

    const suscripcion = await this.suscripcionRepository.findOne({
      where: { preapprovalId },
      relations: ['usuario'],
    });


    if (!suscripcion) {
      console.log('No se encontró la suscripción con preapprovalId:', preapprovalId);
      return;
    }

    suscripcion.estado = estado.toUpperCase();
    await this.suscripcionRepository.save(suscripcion);


    const estadoActivo = ['authorized', 'approved', 'active'];
    if (estadoActivo.includes(estado)) {
      suscripcion.usuario.estado_pago = true;
      await this.usuarioRepo.save(suscripcion.usuario);
    }

    console.log('Suscripcion encontrada:', suscripcion);
    console.log('Usuario relacionado:', suscripcion?.usuario);
    console.log('Estado recibido:', estado);
    if (estado === 'cancelled') {
      suscripcion.usuario.estado_pago = false;
      await this.usuarioRepo.save(suscripcion.usuario);
    }
  }



  async cambiarPlan(id_usuario: number, id_plan_nuevo: number, mesesContratados: number) {

    const usuario = await this.usuarioRepo.findOne({ where: { id_usuario } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');


    const suscripcionActual = await this.suscripcionRepository.findOne({
      where: { usuario: { id_usuario }, estado: 'ACTIVA' },
      relations: ['plan', 'usuario'],
    });
    if (!suscripcionActual) throw new NotFoundException('No se encontró suscripción activa');

    //Cancela suscripcion en mercado pago
    await this.mpService.cancelarSuscripcion(suscripcionActual.preapprovalId);
    suscripcionActual.estado = 'CANCELADA';
    await this.suscripcionRepository.save(suscripcionActual);

    //Buscar nuevo plan
    const planNuevo = await this.planRepo.findOne({ where: { id_plan: id_plan_nuevo } });
    if (!planNuevo) throw new NotFoundException('Plan nuevo no encontrado');

    //Crear nueva suscripción en MP
    const mp = await this.mpService.crearSuscripcion(usuario.email, planNuevo.precio, planNuevo.nombre);

    //Crear registro en DB
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + mesesContratados);

    const nuevaSuscripcion = this.suscripcionRepository.create({
      usuario,
      plan: planNuevo,
      fechaInicio,
      fechaFin,
      mesesContratados,
      montoPagado: planNuevo.precio * mesesContratados,
      estado: 'PENDIENTE',
      preapprovalId: mp.id,
    });

    await this.suscripcionRepository.save(nuevaSuscripcion);

    usuario.estado_pago = true;
    await this.usuarioRepo.save(usuario);

    return {
      message: 'Plan cambiado correctamente',
      init_point: mp.init_point,
      preapprovalId: mp.id,
    };
  }


}