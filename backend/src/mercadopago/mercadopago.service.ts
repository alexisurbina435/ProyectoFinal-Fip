import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MercadoPagoConfig, PreApproval, Preference } from 'mercadopago';
@Injectable()
export class MercadoPagoService {
  private readonly preference;
  private readonly preapproval;
  constructor(private readonly configService: ConfigService) {
    const accessToken = this.configService.get<string>('MP_ACCESS_TOKEN');
    const token = accessToken;
    if (!token) {
      throw new Error(
        'Environment variable MP_ACCESS_TOKEN is required for Mercado Pago configuration',
      );
    }

    const client = new MercadoPagoConfig({
      accessToken: token,
    });

    this.preference = new Preference(client);
    this.preapproval = new PreApproval(client);
  }

  // Crear una preferencia de pago normal para productos
  async crearPreferencia(items: any[]) {
    try {
      const result = await this.preference.create({
        body: {
          items: items, // acá usamos los productos reales enviados desde el front
          back_urls: {
            success: 'https://gymsuperarse.web.app/productos',
            failure: 'https://gymsuperarse.web.app/productos',
            pending: 'https://gymsuperarse.web.app/productos',
          },
          auto_return: 'approved',
          currency_id: 'ARS',
        },
      });

      return { id: result.id };
    } catch (error) {
      console.error('MP ERROR:', error);
      throw error;
    }
  }

  async obtenerPreapproval(id: string) {
    try {
      const result = await this.preapproval.get({ id });
      return result;
    } catch (error) {
      console.error('Error obteniendo preapproval:', error);
      throw error;
    }
  }

  // Crear suscripción (sandbox)
  async crearSuscripcion(email: string, monto: number, descripcion: string) {
    try {
      const startDate = new Date(Date.now() + 2 * 60 * 1000).toISOString();

      const payload = {
        reason: descripcion,
        auto_recurring: {
          frequency: 1,
          frequency_type: 'months',
          transaction_amount: Number(monto),
          currency_id: 'ARS',
          start_date: startDate,
          end_date: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1),
          ).toISOString(),
        },

        notification_url:
          'https://proyectofinal-backend-7797.onrender.com/mercadopago/webhook',

        back_url: 'https://gymsuperarse.web.app/planillaSalud',
        payer_email: email,
      };

      const result = await this.preapproval.create({ body: payload });

      return {
        id: result.id,
        init_point: result.init_point,
      };
    } catch (err) {
      console.error('== MERCADOPAGO ERROR ==', err);
      throw err;
    }
  }

  async cancelarSuscripcion(preapprovalId: string) {
    return await this.preapproval.update({
      id: preapprovalId,
      body: { status: 'cancelled' },
    });
  }
}
