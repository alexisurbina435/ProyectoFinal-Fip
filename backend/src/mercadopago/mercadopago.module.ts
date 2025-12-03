import { forwardRef, Module } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';
import { MercadoPagoController } from './mercadopago.controller';
import { SuscripcionModule } from '../suscripcion/suscripcion.module';

@Module({
  imports: [forwardRef(() => SuscripcionModule),],
  controllers: [MercadoPagoController],
  providers: [MercadoPagoService],
  exports: [MercadoPagoService]
})
export class MercadoPagoModule {}