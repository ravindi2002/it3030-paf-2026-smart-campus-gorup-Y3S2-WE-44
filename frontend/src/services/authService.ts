import api from '../utils/api';
import { User } from '../types/User';

export const authService = {
  login: async (username: string, password: string): Promise<{ token: string; username: string }> => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  getCurrentUser: async (): Promise<{ username: string; authorities: any[] }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  register: async (data: User): Promise<User> => {
    const response = await api.post('/users/register', data);
    return response.data;
  },

  getAll: async (role?: string): Promise<User[]> => {
    const params = role ? { role } : {};
    const response = await api.get('/users', { params });
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  update: async (id: number, data: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  updateRole: async (id: number, role: string): Promise<User> => {
    const response = await api.put(`/users/${id}/role`, null, { params: { role } });
    return response.data;
  },

  updatePassword: async (id: number, newPassword: string): Promise<User> => {
    const response = await api.patch(`/users/${id}/password`, null, { params: { newPassword } });
    return response.data;
  },
};