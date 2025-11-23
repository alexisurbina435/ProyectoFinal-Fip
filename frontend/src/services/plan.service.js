import apiClient from './api.client.js';

class PlanService {

  // Devuelve un {Promise<Array>}
  async getAllPlans() {
    return apiClient.get('/plan');
  }

  // Devuelve un {Promise<Object>}
  async getPlanById(id) {
    return apiClient.get(`/plan/${id}`);
  }

  // Devuelve un {Promise<Object>}
  async createPlan(planData) {
    return apiClient.post('/plan', planData);
  }

  // Devuelve un {Promise<Object>}
  async updatePlan(id, planData) {
    return apiClient.patch(`/plan/${id}`, planData);
  }

  // Devuelve {Promise<null>} (204 No Content)
  async deletePlan(id) {
    return apiClient.delete(`/plan/${id}`);
  }
}

export default new PlanService();

