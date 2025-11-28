import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, PreApproval, Preference } from 'mercadopago';

@Injectable()
export class MercadoPagoService {
    private readonly preference;
    private readonly preapproval;

    constructor() {
        const token = process.env.MP_ACCESS_TOKEN;
        if (!token) {
            throw new Error(
                'Environment variable MP_ACCESS_TOKEN is required for Mercado Pago configuration'
            );
        }

        // Configuramos el cliente con el token del vendedor (collector)
        const client = new MercadoPagoConfig({
            accessToken: token,
        });

        this.preference = new Preference(client);
        this.preapproval = new PreApproval(client);
    }

    // Crear una preferencia de pago normal (opcional, para productos)
    async crearPreferencia() {
        try {
            const result = await this.preference.create({
                body: {
                    items: [
                        {
                            id: 'producto1',
                            title: 'Producto de ejemplo',
                            quantity: 1,
                            unit_price: 100,
                            currency_id: 'ARS',
                        },
                    ],
                    back_urls: {
                        success: "https://google.com",
                        failure: "https://google.com",
                        pending: "https://google.com"
                    },
                    auto_return: "approved",
                },
            });

            return { id: result.id }; // preferenceId generado
        } catch (error) {
            console.error("MP ERROR:", error);
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
                    end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()

                },
                back_url: 'https://google.com',
                payer_email: email,
            };

            const result = await this.preapproval.create({ body: payload });

            return {
                id: result.id,        
                init_point: result.init_point, 
            };
        } catch (err) {
            console.error("== MERCADOPAGO ERROR ==", err);
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