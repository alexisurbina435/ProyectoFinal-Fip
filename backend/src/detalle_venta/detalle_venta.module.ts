import { Module } from '@nestjs/common';
import { DetalleVentaService } from './detalle-venta.service';
import { DetalleVentaController } from './detalle-venta.controller';
import { DetalleVenta } from './entities/detalleVenta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from 'src/productos/entities/producto.entity';
import { Venta } from 'src/venta/entities/venta.entity';
@Module({
  imports: [TypeOrmModule.forFeature([DetalleVenta, Producto, Venta])],
  providers: [DetalleVentaService],
  controllers: [DetalleVentaController],
})
export class DetalleVentaModule {}
