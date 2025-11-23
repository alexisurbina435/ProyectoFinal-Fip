import apiClient from './api.client.js';

class FichaSaludService {

  // Devuelve un {Promise<Array>}
  async getAllFichasSalud() {
    return apiClient.get('/ficha-salud');
  }

  // Devuelve un {Promise<Object>}
  async getFichaSaludById(id) {
    return apiClient.get(`/ficha-salud/${id}`);
  }

  // Devuelve un {Promise<Object>}
  async createFichaSalud(fichaSaludData) {
    return apiClient.post('/ficha-salud', fichaSaludData);
  }

  // Devuelve un {Promise<Object>}
  async updateFichaSalud(id, fichaSaludData) {
    return apiClient.patch(`/ficha-salud/${id}`, fichaSaludData);
  }

  // Devuelve {Promise<Object>} con la ficha de salud eliminada
  async deleteFichaSalud(id) {
    return apiClient.delete(`/ficha-salud/${id}`);
  }
}

export default new FichaSaludService();

