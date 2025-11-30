import apiClient from './api.client.js';

class SuscripcionService {

    async create(usuarioData) {
        return apiClient.post('/suscripciones', usuarioData);
    }

    async cambiarPlan(id_usuario,id_plan, usuarioData) {
        return apiClient.put(`/suscripciones/${id_usuario}/plan/${id_plan}`, usuarioData);
    }

    async cancelar(id) {
        return apiClient.delete(`/suscripciones/${id}`);
    }

}

export default new SuscripcionService();