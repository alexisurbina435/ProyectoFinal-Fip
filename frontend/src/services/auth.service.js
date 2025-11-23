import apiClient from './api.client.js';

class AuthService {

    async login(usuarioData) {
        return apiClient.post('/auth/login', usuarioData);
    }

    async logout() {
        return apiClient.post('/auth/logout');
    }
}

export default new AuthService();