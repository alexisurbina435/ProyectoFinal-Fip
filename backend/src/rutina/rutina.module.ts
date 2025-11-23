import { Module } from '@nestjs/common';
import { RutinaController } from './rutina.controller';
import { RutinaService } from './rutina.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rutina } from './entities/rutina.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { FichaSalud } from 'src/ficha-salud/entities/ficha-salud.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Rutina,Usuario,Plan,FichaSalud])],
  controllers: [RutinaController],
  providers: [RutinaService],
  
})
export class RutinaModule {}
