import api from '../utils/api';
import { Booking, BookingRequest, BookingFilters, BookingStatus } from '../types/Booking';

export const bookingService = {
  // Get all bookings with optional filters
  async getBookings(filters?: BookingFilters): Promise<Booking[]> {
    const params = new URLSearchParams();
    
    if (filters?.userId) params.append('userId', filters.userId.toString());
    if (filters?.resourceId) params.append('resourceId', filters.resourceId.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    const response = await api.get(`/bookings?${params.toString()}`);
    return response.data;
  },

  // Get booking by ID
  async getBookingById(id: number): Promise<Booking> {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  // Create new booking
  async createBooking(booking: BookingRequest, userId: number): Promise<Booking> {
    const response = await api.post(`/bookings?userId=${userId}`, booking);
    return response.data;
  },

  // Update booking
  async updateBooking(id: number, booking: Partial<BookingRequest>): Promise<Booking> {
    const response = await api.put(`/bookings/${id}`, booking);
    return response.data;
  },

  // Approve booking (Admin only)
  async approveBooking(id: number, approvedById?: number): Promise<Booking> {
    const params = approvedById ? `?approvedById=${approvedById}` : '';
    const response = await api.put(`/bookings/${id}/approve${params}`);
    return response.data;
  },

  // Reject booking (Admin only)
  async rejectBooking(id: number, approvedById?: number, rejectionReason?: string): Promise<Booking> {
    const params = new URLSearchParams();
    if (approvedById) params.append('approvedById', approvedById.toString());
    if (rejectionReason) params.append('rejectionReason', rejectionReason);
    
    const response = await api.put(`/bookings/${id}/reject?${params.toString()}`);
    return response.data;
  },

  // Cancel booking
  async cancelBooking(id: number, userId: number): Promise<Booking> {
    const response = await api.put(`/bookings/${id}/cancel?userId=${userId}`);
    return response.data;
  },

  // Delete booking
  async deleteBooking(id: number): Promise<void> {
    await api.delete(`/bookings/${id}`);
  },

  // Get bookings by user ID
  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    const response = await api.get(`/bookings?userId=${userId}`);
    return response.data;
  },

  // Get bookings by resource ID
  async getBookingsByResourceId(resourceId: number): Promise<Booking[]> {
    const response = await api.get(`/bookings?resourceId=${resourceId}`);
    return response.data;
  },

  // Get bookings by status
  async getBookingsByStatus(status: BookingStatus): Promise<Booking[]> {
    const response = await api.get(`/bookings?status=${status}`);
    return response.data;
  },

  // Get bookings by date range
  async getBookingsByDateRange(startDate: string, endDate: string): Promise<Booking[]> {
    const response = await api.get(`/bookings?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  // Get bookings by resource and date range
  async getBookingsByResourceAndDateRange(
    resourceId: number, 
    startDate: string, 
    endDate: string
  ): Promise<Booking[]> {
    const response = await api.get(
      `/bookings?resourceId=${resourceId}&startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  }
};
