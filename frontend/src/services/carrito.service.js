import apiClient from "./api.client";

class CarritoService {

    async getCarritoById(carritoId) {
        const response = await apiClient.get(`/carrito/${carritoId}`);
        return response;
    }

    async getCarritoByUsuario(id_usuario) {
        const response = await apiClient.get(`/carrito/usuario/${id_usuario}`);
        return response;
    }

    async addItem(carritoId, productoId, cantidad = 1) {
        console.log(carritoId, productoId, cantidad);
        return apiClient.post(`/carrito/${carritoId}/item`, {
            productoId,
            cantidad
        });
    }

    async createCarrito(id_usuario) {
        const response = await apiClient.post('/carrito', { id_usuario });
        return response;
    }

    async updateCantidad(carritoId,itemId, cantidad) {
        const response = await apiClient.patch(`/carrito/${carritoId}/item/${itemId}`, { cantidad });
        return response;
    }
    
    async deleteItem(carritoId,itemId) {
        const response = await apiClient.delete(`/carrito/${carritoId}/item/${itemId}`);
        return response;
    }

    async deleteCarrito(carritoId) {
        const response = await apiClient.delete(`/carrito/${carritoId}`);
        return response;
    }

    async sincronizarCarrito(usuarioId, productos) {
        const response = await apiClient.post(`/carrito/usuario/${usuarioId}/sincronizar`, { productos });
        return response;
    }

}

export default new CarritoService();