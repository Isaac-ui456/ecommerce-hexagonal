import apiClient from '../../../shared/services/apiClient';

export const analyticsService = {
  getDashboardMetrics: async (params = {}) => {
    const response = await apiClient.get('/analytics', { params });
    return response.data;
  }
};