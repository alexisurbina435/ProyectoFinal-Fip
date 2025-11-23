import apiClient from './api.client.js';

class BlogService {

  // Devuelve un {Promise<Array>}
  async getAllBlogs() {
    return apiClient.get('/blog');
  }

  // Devuelve un {Promise<Object>}
  async getBlogById(id) {
    return apiClient.get(`/blog/${id}`);
  }

  // Devuelve un {Promise<Object>}
  async createBlog(blogData) {
    return apiClient.post('/blog', blogData);
  }

  // Devuelve un {Promise<Object>}
  async updateBlog(id, blogData) {
    return apiClient.patch(`/blog/${id}`, blogData);
  }

  // Devuelve {Promise<null>} (204 No Content)
  async deleteBlog(id) {
    return apiClient.delete(`/blog/${id}`);
  }
}

export default new BlogService();

