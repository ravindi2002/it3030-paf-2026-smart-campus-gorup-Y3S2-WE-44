import api from '../utils/api';
import { Booking } from '../types/Booking';

export const bookingService = {
  getAll: async (params?: { userId?: number; resourceId?: number; status?: string }): Promise<Booking[]> => {
    const response = await api.get('/bookings', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Booking> => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  create: async (data: Booking, userId: number): Promise<Booking> => {
    const response = await api.post('/bookings', data, { params: { userId } });
    return response.data;
  },

  update: async (id: number, data: Booking): Promise<Booking> => {
    const response = await api.put(`/bookings/${id}`, data);
    return response.data;
  },

  approve: async (id: number, approvedById?: number): Promise<Booking> => {
    const response = await api.put(`/bookings/${id}/approve`, null, { params: { approvedById } });
    return response.data;
  },

  reject: async (id: number, approvedById?: number): Promise<Booking> => {
    const response = await api.put(`/bookings/${id}/reject`, null, { params: { approvedById } });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/bookings/${id}`);
  },
};