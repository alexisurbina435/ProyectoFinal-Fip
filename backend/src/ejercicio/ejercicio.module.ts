import { Module } from '@nestjs/common';
import { EjercicioService } from './ejercicio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ejercicio } from './entities/ejercicio.entity';
import { EjercicioController } from './ejercicio.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ejercicio])],
  controllers: [EjercicioController],
  providers: [EjercicioService]
})
export class EjercicioModule {}
