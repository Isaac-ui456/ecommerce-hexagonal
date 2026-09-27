/**
 * Adaptador de red aislado: única puerta de entrada HTTP hacia el backend.
 * Los servicios de cada módulo (auth, catalog, orders) usan este cliente
 * en lugar de llamar a fetch/axios directamente, para desacoplar la UI
 * de los detalles de transporte (headers, baseURL, manejo de token).
 */
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
