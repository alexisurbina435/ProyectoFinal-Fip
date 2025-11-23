import { Module } from '@nestjs/common';
import { VentaService } from './venta.service';
import { VentaController } from './venta.controller';
import { Venta } from './entities/venta.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Venta, Usuario])],
  controllers: [VentaController],
  providers: [VentaService],
})
export class VentaModule {}
