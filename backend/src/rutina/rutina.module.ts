import { Module } from '@nestjs/common';
import { RutinaController } from './rutina.controller';
import { RutinaService } from './rutina.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rutina } from './entities/rutina.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { FichaSalud } from 'src/ficha-salud/entities/ficha-salud.entity';
import { Semana } from 'src/semana/entities/semana.entity';
import { Dia } from 'src/dia/entities/dia.entity';
import { Dificultad } from 'src/dificultad/entities/dificultad.entity';
import { Ejercicio } from 'src/ejercicio/entities/ejercicio.entity';
import { SemanaModule } from 'src/semana/semana.module';
import { DiaModule } from 'src/dia/dia.module';
import { DificultadModule } from 'src/dificultad/dificultad.module';

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
