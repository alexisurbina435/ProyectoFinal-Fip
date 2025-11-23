import apiClient from './api.client.js';

class EjercicioService {

  // Devuelve un {Promise<Array>}
  async getAllEjercicios() {
    return apiClient.get('/ejercicio');
  }

  // Devuelve un {Promise<Object>}
  async getEjercicioById(id) {
    return apiClient.get(`/ejercicio/${id}`);
  }

  // Devuelve un {Promise<Object>}
  async createEjercicio(ejercicioData) {
    return apiClient.post('/ejercicio', ejercicioData);
  }

  // Devuelve un {Promise<Object>}
  async updateEjercicio(id, ejercicioData) {
    return apiClient.patch(`/ejercicio/${id}`, ejercicioData);
  }

  // Devuelve {Promise<null>} (204 No Content)
  async deleteEjercicio(id) {
    return apiClient.delete(`/ejercicio/${id}`);
  }
}

export default new EjercicioService();

