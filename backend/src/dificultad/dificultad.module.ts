import { Module } from '@nestjs/common';
import { DificultadService } from './dificultad.service';
import { DificultadController } from './dificultad.controller';
import { Dificultad } from './entities/dificultad.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dia } from '../dia/entities/dia.entity';
import { Ejercicio } from '../ejercicio/entities/ejercicio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dificultad, Dia, Ejercicio])],
  controllers: [DificultadController],
  providers: [DificultadService],
})
export class DificultadModule {}
