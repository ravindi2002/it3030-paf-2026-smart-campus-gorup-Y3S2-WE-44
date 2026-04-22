import api from '../utils/api';
import { Comment } from '../types/Ticket';

export const commentService = {
  getByTicketId: async (ticketId: number): Promise<Comment[]> => {
    const response = await api.get(`/comments/ticket/${ticketId}`);
    return response.data;
  },

  create: async (data: Comment, userId: number): Promise<Comment> => {
    const response = await api.post('/comments', data, { params: { userId } });
    return response.data;
  },

  update: async (id: number, data: Comment): Promise<Comment> => {
    const response = await api.put(`/comments/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/comments/${id}`);
  },
};