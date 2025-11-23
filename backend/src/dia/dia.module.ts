import { Module } from '@nestjs/common';
import { DiaService } from './dia.service';
import { DiaController } from './dia.controller';
import { Dia } from './entities/dia.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Semana } from 'src/semana/entities/semana.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dia, Semana])],
  controllers: [DiaController],
  providers: [DiaService],
})
export class DiaModule {}
