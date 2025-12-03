import { Module } from '@nestjs/common';
import { SemanaController } from './semana.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Semana } from './entities/semana.entity';
import { Rutina } from '../rutina/entities/rutina.entity';
import { SemanaService } from './semana.service';

@Module({
  imports: [TypeOrmModule.forFeature([Semana, Rutina])],
  providers: [SemanaService],
  controllers: [SemanaController],
  exports: [SemanaService], // Exportar para usar en RutinaService
})
export class SemanaModule {}
