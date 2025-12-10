import { Body, Controller, HttpCode, Post, Headers } from '@nestjs/common';
import { MercadoPagoService } from './mercadopago.service';
import { SuscripcionService } from '../suscripcion/suscripcion.service';

@Controller('mercadopago')
export class MercadoPagoController {
  constructor(private readonly mpService: MercadoPagoService,
    private readonly suscripcionService: SuscripcionService,
  ) { }

  @Post('crear-preferencia')
  async crearPreferencia(@Body() body: any) {
    return this.mpService.crearPreferencia(body.items);
  }

  // esto lo usa mercadopago cuando tengamos el dominio de la pag 
  @Post('webhook')
  @HttpCode(200)
  async webhook(@Body() body: any, @Headers() headers: any) {
    console.log('Webhook recibido:', JSON.stringify(body, null, 2));
    console.log('Headers:', JSON.stringify(headers, null, 2));

    const type = body.type || body.topic;
    const preapprovalId = body.data?.id || body.id;

    if (!preapprovalId) {
      console.log('No se pudo obtener preapprovalId del webhook');
      return { ok: false, message: 'preapprovalId no encontrado' };
    }

    if (type === 'preapproval' || type === 'subscription_preapproval') {
      try {
        const detalle = await this.mpService.obtenerPreapproval(preapprovalId);
        const status = detalle.status;
        console.log("Estado real:", status);

        await this.suscripcionService.actualizarEstado(preapprovalId, status);
      } catch (err) {
        console.error('Error procesando preapproval:', err);
      }
    }

    return { ok: true };
  }

}

