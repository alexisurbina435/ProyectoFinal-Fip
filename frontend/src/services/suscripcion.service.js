import apiClient from './api.client.js';

class SuscripcionService {

    async create(usuarioData) {
        return apiClient.post('/suscripciones', usuarioData);
    }

}

export default new SuscripcionService();