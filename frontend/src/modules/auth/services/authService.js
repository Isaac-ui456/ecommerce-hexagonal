import apiClient from '../../../shared/services/apiClient';

/** Módulo de autenticación: encapsula las llamadas a /api/users/*. */
export const authService = {
  async register({ username, email, password }) {
    const { data } = await apiClient.post('/users/register', { username, email, password });
    return data;
  },

  async login({ email, password }) {
    const { data } = await apiClient.post('/users/login', { email, password });
    return data; // { token, user }
  },
};
