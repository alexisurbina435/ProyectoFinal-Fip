import { Module } from '@nestjs/common';
import { SuscripcionService } from './suscripcion.service';
import { SuscripcionController } from './suscripcion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { Suscripcion } from './entities/suscripcion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario,Plan, Suscripcion])],
  controllers: [SuscripcionController],
  providers: [SuscripcionService],
  exports: [SuscripcionService],
})
export class SuscripcionModule {}
