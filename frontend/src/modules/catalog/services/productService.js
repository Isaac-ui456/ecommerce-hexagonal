import apiClient from '../../../shared/services/apiClient';

/** Módulo de catálogo: llamadas a /api/products/* (CRUD de productos). */
export const productService = {
  async list() {
    const { data } = await apiClient.get('/products');
    return data;
  },
  async getById(id) {
    const { data } = await apiClient.get(`/products/${id}`);
    return data;
  },
  async create(product) {
    const { data } = await apiClient.post('/products', product);
    return data;
  },
  async update(id, product) {
    const { data } = await apiClient.put(`/products/${id}`, product);
    return data;
  },
  async remove(id) {
    const { data } = await apiClient.delete(`/products/${id}`);
    return data;
  },
};
