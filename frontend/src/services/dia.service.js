import apiClient from './api.client.js';

class DiaService {

  // Devuelve un {Promise<Array>}
  async getAllDias() {
    return apiClient.get('/dia');
  }

  // Devuelve un {Promise<Object>}
  async getDiaById(id) {
    return apiClient.get(`/dia/${id}`);
  }

  // Devuelve un {Promise<Object>}
  async createDia(diaData) {
    return apiClient.post('/dia', diaData);
  }

  // Devuelve un {Promise<Object>}
  async updateDia(id, diaData) {
    return apiClient.patch(`/dia/${id}`, diaData);
  }

  // Devuelve {Promise<null>} (204 No Content)
  async deleteDia(id) {
    return apiClient.delete(`/dia/${id}`);
  }
}

export default new DiaService();

