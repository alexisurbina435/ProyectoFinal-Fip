import { Injectable } from '@nestjs/common';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';
import { UpdateSuscripcionDto } from './dto/update-suscripcion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { Repository } from 'typeorm';
import { Suscripcion } from './entities/suscripcion.entity';

@Injectable()
export class SuscripcionService {

   constructor(
      @InjectRepository(Usuario)
      private usuarioRepository: Repository<Usuario>,

      @InjectRepository(Suscripcion)
      private suscripcionRepo: Repository<Suscripcion>,
      
      @InjectRepository(Plan)
      private readonly planRepo: Repository<Plan>,
  
    ) { }
  async create(dto: CreateSuscripcionDto): Promise<Suscripcion> {
    const usuario = await this.usuarioRepository.findOneBy({ id_usuario: dto.id_usuario });
    const plan = await this.planRepo.findOneBy({ id_plan: dto.id_plan });

    if (!usuario || !plan) throw new Error('Usuario o Plan no encontrado');

    const fechaInicio = new Date();
    const fechaFin = new Date(fechaInicio);
    fechaFin.setMonth(fechaFin.getMonth() + dto.mesesContratados);

    const suscripcion = this.suscripcionRepo.create({
      usuario,
      plan,
      fechaInicio,
      fechaFin,
      mesesContratados: dto.mesesContratados,
      montoPagado: plan.precio * dto.mesesContratados,  
      estado: 'ACTIVA',
    });

    return this.suscripcionRepo.save(suscripcion);
  }

  delete(id: number) {
    return this.suscripcionRepo.delete(id);
  }
}
