import api from '../utils/api';
import { Ticket } from '../types/Ticket';

interface TicketRequest {
  title: string;
  description: string;
  priority: string;
  category?: string;
  location?: string;
  imageUrl?: string;
}

export const ticketService = {
  getAll: async (params?: { userId?: number; status?: string }): Promise<Ticket[]> => {
    const response = await api.get('/tickets', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Ticket> => {
    const response = await api.get(`/tickets/${id}`);
    return response.data;
  },

  create: async (data: TicketRequest, userId: number): Promise<Ticket> => {
    const response = await api.post('/tickets', data, { params: { userId } });
    return response.data;
  },

  update: async (id: number, data: TicketRequest): Promise<Ticket> => {
    const response = await api.put(`/tickets/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: number, status: string): Promise<Ticket> => {
    const response = await api.put(`/tickets/${id}/status`, null, { params: { status } });
    return response.data;
  },

  assignTicket: async (id: number, assignedToId: number): Promise<Ticket> => {
    const response = await api.put(`/tickets/${id}/assign`, null, { params: { assignedToId } });
    return response.data;
  },

  resolve: async (id: number, resolution: string, userId: number): Promise<Ticket> => {
    const response = await api.put(`/tickets/${id}/resolve`, null, { params: { resolution, userId } });
    return response.data;
  },

  addComment: async (ticketId: number, data: { content: string }, userId: number): Promise<any> => {
    const response = await api.post(`/tickets/${ticketId}/comments`, data, { params: { userId } });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tickets/${id}`);
  },
};