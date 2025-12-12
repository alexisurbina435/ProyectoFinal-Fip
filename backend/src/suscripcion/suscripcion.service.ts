import { Injectable, NotFoundException } from '@nestjs/common';
import { MercadoPagoService } from '../mercadopago/mercadopago.service';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';
import { OtorgarPlanManualDto } from './dto/otorgar-plan-manual.dto';
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

    const mp = await this.mpService.crearSuscripcion(usuario.email, plan.precio, plan.nombre);

    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + dto.mesesContratados);

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

    return mp;
  }

  async cancelar(preapprovalId: string) {
    await this.mpService.cancelarSuscripcion(preapprovalId);
    await this.suscripcionRepository.update({ preapprovalId }, { estado: 'CANCELADA' });
  }


  async actualizarEstado(preapprovalId: string, estado: string) {
    const suscripcion = await this.suscripcionRepository.findOne({
      where: { preapprovalId },
      relations: ['usuario', 'plan'],
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
      suscripcion.estado = 'ACTIVA';

      await this.usuarioRepo.save(suscripcion.usuario);
      await this.suscripcionRepository.save(suscripcion);
    }

    if (estado === 'cancelled') {
      suscripcion.usuario.estado_pago = false;
      suscripcion.estado = 'CANCELADA';
      await this.usuarioRepo.save(suscripcion.usuario);
      await this.suscripcionRepository.save(suscripcion);
    }

    console.log('Suscripción actualizada:', suscripcion);
    console.log('Usuario actualizado:', suscripcion.usuario);
    console.log('Plan activo:', suscripcion.plan);
  }





  async cambiarPlan(id_usuario: number, id_plan_nuevo: number, mesesContratados: number) {

    const usuario = await this.usuarioRepo.findOne({ where: { id_usuario } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');


    const suscripcionActual = await this.suscripcionRepository.findOne({
      where: { usuario: { id_usuario }, estado: 'ACTIVA' },
      relations: ['plan', 'usuario'],
    });
    if (!suscripcionActual) throw new NotFoundException('No se encontró suscripción activa');

    await this.mpService.cancelarSuscripcion(suscripcionActual.preapprovalId);
    suscripcionActual.estado = 'CANCELADA';
    await this.suscripcionRepository.save(suscripcionActual);

    const planNuevo = await this.planRepo.findOne({ where: { id_plan: id_plan_nuevo } });
    if (!planNuevo) throw new NotFoundException('Plan nuevo no encontrado');

    const mp = await this.mpService.crearSuscripcion(usuario.email, planNuevo.precio, planNuevo.nombre);

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

  /**
   * Otorga un plan manualmente a un usuario (para pagos en efectivo o administración)
   * Este método NO requiere Mercado Pago y activa inmediatamente el plan
   */
  async otorgarPlanManual(dto: OtorgarPlanManualDto) {
    const usuario = await this.usuarioRepo.findOne({ 
      where: { id_usuario: dto.id_usuario }
    });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    const plan = await this.planRepo.findOne({ where: { id_plan: dto.id_plan } });
    if (!plan) throw new NotFoundException('Plan no encontrado');

    // Cancelar/desactivar todas las suscripciones activas del usuario usando QueryBuilder
    await this.suscripcionRepository
      .createQueryBuilder()
      .update(Suscripcion)
      .set({ estado: 'CANCELADA' })
      .where('id_usuario = :id_usuario', { id_usuario: dto.id_usuario })
      .andWhere('estado = :estado', { estado: 'ACTIVA' })
      .execute();

    // Obtener las suscripciones canceladas para intentar cancelarlas en MP
    const suscripcionesCanceladas = await this.suscripcionRepository.find({
      where: { 
        usuario: { id_usuario: dto.id_usuario },
        estado: 'CANCELADA'
      }
    });

    // Intentar cancelar en MP las que no sean manuales (en segundo plano, no bloquea)
    for (const suscripcion of suscripcionesCanceladas) {
      if (suscripcion.preapprovalId && !suscripcion.preapprovalId.startsWith('MANUAL_ADMIN_')) {
        try {
          await this.mpService.cancelarSuscripcion(suscripcion.preapprovalId);
        } catch (error: any) {
          // Ignorar errores 404 (suscripciones de prueba que no existen en MP)
          const status = error?.status || error?.response?.status;
          if (status === 404) {
            console.log(`Suscripción ${suscripcion.preapprovalId} no existe en MP (probablemente de prueba)`);
          } else {
            const errorMessage = error?.message || String(error);
            console.log('Error al cancelar suscripción en MP:', errorMessage);
          }
        }
      }
    }

    // Calcular meses contratados (por defecto 1 mes)
    const mesesContratados = dto.mesesContratados || 1;

    // Crear nueva suscripción con estado ACTIVA
    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + mesesContratados);

    // Generar un preapprovalId único para identificar suscripciones manuales
    const preapprovalId = `MANUAL_ADMIN_${Date.now()}_${dto.id_usuario}`;

    // Crear la suscripción usando el método create y save (igual que en el método crear)
    const nuevaSuscripcion = this.suscripcionRepository.create({
      usuario: usuario, // Asignar el objeto usuario completo
      plan: plan, // Asignar el objeto plan completo
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      mesesContratados: mesesContratados,
      montoPagado: plan.precio * mesesContratados,
      estado: 'ACTIVA',
      preapprovalId: preapprovalId,
    });

    // Guardar la suscripción (TypeORM establecerá automáticamente las FKs)
    const suscripcionGuardada = await this.suscripcionRepository.save(nuevaSuscripcion);
    
    // Recargar la suscripción con las relaciones para asegurar que todo esté correcto
    const nuevaSuscripcionCompleta = await this.suscripcionRepository.findOne({
      where: { id: suscripcionGuardada.id },
      relations: ['usuario', 'plan']
    });

    // Activar el estado de pago del usuario
    usuario.estado_pago = true;
    await this.usuarioRepo.save(usuario);

    return {
      message: 'Plan otorgado manualmente y activado correctamente',
      suscripcion: nuevaSuscripcionCompleta,
      usuario: {
        id_usuario: usuario.id_usuario,
        estado_pago: usuario.estado_pago
      }
    };
  }


}