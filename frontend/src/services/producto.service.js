import apiClient from './api.client.js';

class ProductoService {

  // Devuelve un {Promise<Array>}
  async getAllProductos() {
    return apiClient.get('/productos');
  }

  // Devuelve un {Promise<Object>}
  async getProductoById(id) {
    return apiClient.get(`/productos/${id}`);
  }

  // Devuelve un {Promise<Object>}
  async createProducto(productoData) {
    return apiClient.post('/productos', productoData);
  }

  // Devuelve un {Promise<Object>}
  async updateProducto(id, productoData) {
    return apiClient.patch(`/productos/${id}`, productoData);
  }

  // Devuelve {Promise<Object>} con el producto eliminado
  async deleteProducto(id) {
    return apiClient.delete(`/productos/${id}`);
  }
}

export default new ProductoService();

