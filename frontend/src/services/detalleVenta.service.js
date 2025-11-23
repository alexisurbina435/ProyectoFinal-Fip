import apiClient from './api.client.js';

class DetalleVentaService {

  // Devuelve un {Promise<Array>}
  async getAllDetalleVentas() {
    return apiClient.get('/detalle-venta');
  }

  // Devuelve un {Promise<Object>}
  async getDetalleVentaById(id) {
    return apiClient.get(`/detalle-venta/${id}`);
  }

  // Devuelve un {Promise<Object>}
  async createDetalleVenta(detalleVentaData) {
    return apiClient.post('/detalle-venta', detalleVentaData);
  }

  // Devuelve {Promise<Object>} con el detalle de venta eliminado
  async deleteDetalleVenta(id) {
    return apiClient.delete(`/detalle-venta/${id}`);
  }
}

export default new DetalleVentaService();

