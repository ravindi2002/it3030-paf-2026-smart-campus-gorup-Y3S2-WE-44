import api from '../utils/api';

export const notificationService = {
  getAll: async (userId: number) => {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data;
  },
  getByUserId: async (userId: number) => {
    const response = await api.get(`/notifications/user/${userId}`);
    return response.data;
  },
  getUnread: async (userId: number) => {
    const response = await api.get(`/notifications/user/${userId}/unread`);
    return response.data;
  },
  markAsRead: async (id: number) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/notifications', data);
    return response.data;
  },
};