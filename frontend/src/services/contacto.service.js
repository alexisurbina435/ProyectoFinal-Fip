import apiClient from './api.client.js';

class ContactoService {

  // Devuelve un {Promise<Array>}
  async getAllContactos() {
    return apiClient.get('/contacto');
  }

  // Devuelve un {Promise<Object>}
  async getContactoById(id) {
    return apiClient.get(`/contacto/${id}`);
  }

  // Devuelve un {Promise<Object>}
  async createContacto(contactoData) {
    return apiClient.post('/contacto', contactoData);
  }

  // Devuelve un {Promise<Object>}
  async updateContacto(id, contactoData) {
    return apiClient.patch(`/contacto/${id}`, contactoData);
  }

  // Devuelve {Promise<Object>} con el contacto eliminado
  async deleteContacto(id) {
    return apiClient.delete(`/contacto/${id}`);
  }
}

export default new ContactoService();

