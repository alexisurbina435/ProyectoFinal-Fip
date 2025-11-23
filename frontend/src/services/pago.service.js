import apiClient from './api.client.js';

class PagoService {

  // Devuelve un {Promise<Array>}
  async getAllPagos() {
    return apiClient.get('/pagos');
  }

  // Devuelve un {Promise<Object>}
  async getPagoById(id) {
    return apiClient.get(`/pagos/${id}`);
  }

  // Devuelve un {Promise<Object>}
  async createPago(pagoData) {
    return apiClient.post('/pagos', pagoData);
  }

  // Devuelve un {Promise<Object>}
  async updatePago(id, pagoData) {
    return apiClient.patch(`/pagos/${id}`, pagoData);
  }

  // Devuelve {Promise<null>} (204 No Content)
  async deletePago(id) {
    return apiClient.delete(`/pagos/${id}`);
  }
}

export default new PagoService();

