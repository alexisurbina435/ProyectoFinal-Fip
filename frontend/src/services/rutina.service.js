import apiClient from './api.client.js';

class RutinaService {

  // Devuelve un {Promise<Array>}
  async getAllRutinas() {
    return apiClient.get('/rutina');
  }

  // Devuelve un {Promise<Object>}
  async getRutinaById(id) {
    return apiClient.get(`/rutina/${id}`);
  }

  // Devuelve un {Promise<Object>}
  async createRutina(rutinaData) {
    return apiClient.post('/rutina', rutinaData);
  }

  // Devuelve un {Promise<Object>}
  async updateRutina(id, rutinaData) {
    return apiClient.put(`/rutina/${id}`, rutinaData);
  }

  // Devuelve {Promise<null>} (204 No Content)
  async deleteRutina(id) {
    return apiClient.delete(`/rutina/${id}`);
  }

  // Devuelve un {Promise<Object>} - Crea rutina completa con semanas, días y ejercicios en una transacción
  async createRutinaCompleta(rutinaCompletaData) {
    return apiClient.post('/rutina/completa', rutinaCompletaData);
  }
}

export default new RutinaService();

