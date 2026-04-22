import api from '../utils/api';
import { Resource } from '../types/Resource';

export const resourceService = {
  getAll: async (status?: string): Promise<Resource[]> => {
    const params = status ? { status } : {};
    const response = await api.get('/resources', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Resource> => {
    const response = await api.get(`/resources/${id}`);
    return response.data;
  },

  search: async (params: { type?: string; location?: string }): Promise<Resource[]> => {
    const response = await api.get('/resources/search', { params });
    return response.data;
  },

  create: async (data: Resource, userId: number): Promise<Resource> => {
    const response = await api.post('/resources', data, { params: { userId } });
    return response.data;
  },

  update: async (id: number, data: Resource): Promise<Resource> => {
    const response = await api.put(`/resources/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: number, status: string): Promise<Resource> => {
    const response = await api.patch(`/resources/${id}/status`, null, { params: { status } });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/resources/${id}`);
  },
};