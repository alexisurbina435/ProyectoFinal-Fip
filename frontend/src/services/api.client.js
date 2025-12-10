//Cliente HTTP base para realizar peticiones a la API

class ApiClient {
  constructor() {
    this.baseURL = 'https://proyectofinal-backend-7797.onrender.com';
    // this.baseURL = 'http://localhost:3000';
  }

  // Maneja la respuesta de la API
  async handleResponse(response) {
    // Si no es OK, manejar error
    if (!response.ok) {
      let error = null;

      try {
        error = await response.json();
      } catch {
        error = { message: `Error ${response.status}: ${response.statusText}` };
      }

      throw new Error(error.message || `Error ${response.status}`);
    }

    // Si la respuesta no tiene contenido (204 o body vacío)
    if (response.status === 204) {
      return null;
    }

    // Intentar parsear JSON
    try {
      return await response.json();
    } catch {
      // Si no se puede parsear, devolver null sin romper
      return null;
    }
  }

  // Realiza una petición GET
  async get(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      credentials: 'include',//para manejar el token de la cookie
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse(response);
  }

  // Realiza una petición POST
  async post(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // Realiza una petición PUT
  async put(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // Realiza una petición PATCH
  async patch(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  // Realiza una petición DELETE
  async delete(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return this.handleResponse(response);
  }
}

export default new ApiClient();

