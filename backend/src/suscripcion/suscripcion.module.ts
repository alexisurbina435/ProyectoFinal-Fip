import { forwardRef, Module } from '@nestjs/common';
import { SuscripcionService } from './suscripcion.service';
import { SuscripcionController } from './suscripcion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { Plan } from 'src/plan/entities/plan.entity';
import { Suscripcion } from './entities/suscripcion.entity';
import { MercadoPagoService } from 'src/mercadopago/mercadopago.service';
import { MercadoPagoModule } from 'src/mercadopago/mercadopago.module';

@Module({
  imports: [TypeOrmModule.forFeature([Suscripcion, Usuario, Plan, ]),
  forwardRef(() => MercadoPagoModule)],
  
  controllers: [SuscripcionController],
  providers: [SuscripcionService,MercadoPagoService],
  exports: [SuscripcionService],
})
export class SuscripcionModule {}
