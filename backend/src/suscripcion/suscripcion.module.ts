import { forwardRef, Module } from '@nestjs/common';
import { SuscripcionService } from './suscripcion.service';
import { SuscripcionController } from './suscripcion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Plan } from '../plan/entities/plan.entity';
import { Suscripcion } from './entities/suscripcion.entity';
import { MercadoPagoService } from '../mercadopago/mercadopago.service';
import { MercadoPagoModule } from '../mercadopago/mercadopago.module';

@Module({
  imports: [TypeOrmModule.forFeature([Suscripcion, Usuario, Plan, ]),
  forwardRef(() => MercadoPagoModule)],
  
  controllers: [SuscripcionController],
  providers: [SuscripcionService,MercadoPagoService],
  exports: [SuscripcionService],
})
export class SuscripcionModule {}
