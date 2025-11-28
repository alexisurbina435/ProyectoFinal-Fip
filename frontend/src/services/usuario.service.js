import apiClient from './api.client.js';

class UsuarioService {

  // Devuelve un {Promise<Array>}
  async getAllUsuarios() {
    return apiClient.get('/usuario');
  }

  // Devuelve un {Promise<Object>}
  async getUsuarioById(id) {
    return apiClient.get(`/usuario/${id}`);
  }

  async getUserByEmail(email){
    return apiClient.get(`/usuario/email/${email}`);
  }

  // Devuelve un {Promise<Object>}
  async register(usuarioData) {
    return apiClient.post('/usuario/registro', usuarioData);
  }

  // async login(usuarioData) {
  //   return apiClient.post('/usuario/login', usuarioData);
  // }

  // Devuelve un {Promise<Object>}
  async updateUsuario(id, usuarioData) {
    return apiClient.put(`/usuario/${id}`, usuarioData);
  }

  async editarUsuario(id, usuarioData) {
    return apiClient.patch(`/usuario/${id}`, usuarioData);
  }

  // Devuelve {Promise<null>} (204 No Content)
  async deleteUsuario(id) {
    return apiClient.delete(`/usuario/${id}`);
  }
}

export default new UsuarioService();

