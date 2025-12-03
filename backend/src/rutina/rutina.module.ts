import { Module } from '@nestjs/common';
import { RutinaController } from './rutina.controller';
import { RutinaService } from './rutina.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rutina } from './entities/rutina.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Plan } from '../plan/entities/plan.entity';
import { FichaSalud } from '../ficha-salud/entities/ficha-salud.entity';
import { Semana } from '../semana/entities/semana.entity';
import { Dia } from '../dia/entities/dia.entity';
import { Dificultad } from '../dificultad/entities/dificultad.entity';
import { Ejercicio } from '../ejercicio/entities/ejercicio.entity';
import { SemanaModule } from '../semana/semana.module';
import { DiaModule } from '../dia/dia.module';
import { DificultadModule } from '../dificultad/dificultad.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rutina, Usuario, Plan, FichaSalud, Semana, Dia, Dificultad, Ejercicio]),
    SemanaModule,
    DiaModule,
    DificultadModule,
  ],
  controllers: [RutinaController],
  providers: [RutinaService],
  exports: [RutinaService],
})
export class RutinaModule {}
