import api from '../utils/api';
import { Notification } from '../types/Notification';

export const notificationService = {
  getAll: async (userId: number): Promise<Notification[]> => {
    const response = await api.get('/notifications', { params: { userId } });
    return response.data;
  },

  getByUserId: async (userId: number): Promise<Notification[]> => {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data;
  },

  getUnread: async (userId: number): Promise<Notification[]> => {
    const response = await api.get(`/notifications/user/${userId}/unread`);
    return response.data;
  },

  getUnreadCount: async (userId: number): Promise<number> => {
    const response = await api.get(`/notifications/user/${userId}/count`);
    return response.data;
  },

  markAsRead: async (id: number): Promise<Notification> => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  create: async (data: Notification): Promise<Notification> => {
    const response = await api.post('/notifications', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/notifications/${id}`);
  },
};