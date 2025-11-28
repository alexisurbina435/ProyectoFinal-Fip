import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';
import { SuscripcionService } from 'src/suscripcion/suscripcion.service';

@Controller('mercadopago')
export class MercadoPagoController {
  constructor(private readonly mpService: MercadoPagoService,
    private readonly suscripcionService: SuscripcionService,
  ) { }

  @Post('crear-preferencia')
  async crearPreferencia() {
    return this.mpService.crearPreferencia();
  }
 
  // esto lo usa mercadopago cuando tengamos el dominio de la pag 
  @Post('webhook')
  @HttpCode(200)
  async webhook(@Body() body: any) {
    console.log('Webhook recibido:', body);

    if (body.type === 'preapproval') {
      const preapprovalId = body.data.id;
      const status = body.data.status; //authorized, cancelled, etc.

      // Actualizamos la suscripción y el estado_pago del usuario
      await this.suscripcionService.actualizarEstado(preapprovalId, status);
    }

    return { received: true };
  }
}
