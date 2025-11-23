import apiClient from './api.client.js';

class SemanaService {

  // Devuelve un {Promise<Array>}
  async getAllSemanas() {
    return apiClient.get('/semana');
  }

  // Devuelve un {Promise<Object>}
  async getSemanaById(id) {
    return apiClient.get(`/semana/${id}`);
  }

  // Devuelve un {Promise<Object>}
  async createSemana(semanaData) {
    return apiClient.post('/semana', semanaData);
  }

  // Devuelve un {Promise<Object>}
  async updateSemana(id, semanaData) {
    return apiClient.patch(`/semana/${id}`, semanaData);
  }

  // Devuelve {Promise<Object>} con la semana eliminada
  async deleteSemana(id) {
    return apiClient.delete(`/semana/${id}`);
  }
}

export default new SemanaService();

