import api from '../utils/api';
import { User, RoleType } from '../types/User';

export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    const { token, userId, role } = response.data;
    
    const userData: User = {
      username,
      email: '',
      role: role || RoleType.USER,
      id: userId
    };
    
    return { token, username, role: userData.role, id: userId };
  },
  logout: async () => {
    await api.post('/auth/logout');
  },
  register: async (data: any) => {
    const response = await api.post('/users/register', data);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};