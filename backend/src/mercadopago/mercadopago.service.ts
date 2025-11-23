import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Preference } from 'mercadopago';

@Injectable()
export class MercadoPagoService {
    private readonly preference;

    constructor() {
        const token = process.env.MP_ACCESS_TOKEN;
        if (!token) {
            throw new Error('Environment variable MP_ACCESS_TOKEN is required for Mercado Pago configuration');
        }

        //  Cliente configurado correctamente
        const client = new MercadoPagoConfig({
            accessToken: token,
        });

        //  Crear instancia de Preference correctamente
        this.preference = new Preference(client);
    }

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

            return { id: result.id }; // Esto usa correctamente el preferenceId
        } catch (error) {
            console.error("MP ERROR:", error);
            throw error;
        }
    }
}