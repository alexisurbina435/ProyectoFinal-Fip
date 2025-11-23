import { Module } from '@nestjs/common';
import { PagosController } from './pagos.controller';
import { PagosService } from './pagos.service';
import { Pago } from './entities/pago.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from 'src/venta/entities/venta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pago, Venta])],
  controllers: [PagosController],
  providers: [PagosService],
})
export class PagosModule {}
