import apiClient from './api.client.js';

class DificultadService {

  // Devuelve un {Promise<Array>}
  async getAllDificultades() {
    return apiClient.get('/dificultad');
  }

  // Devuelve un {Promise<Object>}
  async getDificultadById(id) {
    return apiClient.get(`/dificultad/${id}`);
  }

  // Devuelve un {Promise<Object>}
  async createDificultad(dificultadData) {
    return apiClient.post('/dificultad', dificultadData);
  }

  // Devuelve un {Promise<Object>}
  async updateDificultad(id, dificultadData) {
    return apiClient.patch(`/dificultad/${id}`, dificultadData);
  }

  // Devuelve {Promise<null>} (204 No Content)
  async deleteDificultad(id) {
    return apiClient.delete(`/dificultad/${id}`);
  }
}

export default new DificultadService();

