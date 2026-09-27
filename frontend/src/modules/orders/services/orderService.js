import apiClient from '../../../shared/services/apiClient';

/** Módulo de pedidos: llamadas a /api/orders/*. */
export const orderService = {
  async create({ lines }) {
    const { data } = await apiClient.post('/orders', { lines });
    return data;
  },
  async myOrders(userId) {
    const { data } = await apiClient.get('/orders', { params: { userId } });
    return data;
  },
  async getById(id) {
    const { data } = await apiClient.get(`/orders/${id}`);
    return data;
  },
  async updateStatus(id, status) {
    const { data } = await apiClient.patch(`/orders/${id}/status`, { status });
    return data;
  },
};
