import apiClient from './api.client.js';

class VentaService {

  // Devuelve un {Promise<Array>}
  async getAllVentas() {
    return apiClient.get('/venta');
  }

  // Devuelve un {Promise<Object>}
  async getVentaById(id) {
    return apiClient.get(`/venta/${id}`);
  }

  // Devuelve un {Promise<Object>}
  async createVenta(ventaData) {
    return apiClient.post('/venta', ventaData);
  }

  // Devuelve {Promise<Object>} con la venta eliminada
  async deleteVenta(id) {
    return apiClient.delete(`/venta/${id}`);
  }
}

export default new VentaService();

