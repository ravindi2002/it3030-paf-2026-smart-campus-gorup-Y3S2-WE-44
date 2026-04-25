import api from '../utils/api';
import { Booking, BookingRequest, BookingFilters, BookingStatus } from '../types/Booking';

// In-memory storage for mock bookings when backend is not available
let mockBookings: Booking[] = [];

export const bookingService = {
  // Get all bookings with optional filters
  async getBookings(filters?: BookingFilters): Promise<Booking[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.userId) params.append('userId', filters.userId.toString());
      if (filters?.resourceId) params.append('resourceId', filters.resourceId.toString());
      if (filters?.status) params.append('status', filters.status);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      
      const response = await api.get(`/admin/admin/bookings?${params.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      
      // If backend is not available, return mock data
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        console.log('Backend not available, returning mock bookings');
        let filteredBookings = [...mockBookings];
        
        // Apply filters to mock bookings
        if (filters?.userId) {
          filteredBookings = filteredBookings.filter(b => b.userId === filters.userId);
        }
        if (filters?.resourceId) {
          filteredBookings = filteredBookings.filter(b => b.resourceId === filters.resourceId);
        }
        if (filters?.status) {
          filteredBookings = filteredBookings.filter(b => b.status === filters.status);
        }
        
        return filteredBookings;
      }
      
      throw error;
    }
  },

  // Get booking by ID
  async getBookingById(id: number): Promise<Booking> {
    try {
      const response = await api.get(`/admin/bookings/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching booking:', error);
      
      // If backend is not available, return mock booking
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        const mockBooking = mockBookings.find(b => b.id === id);
        if (mockBooking) {
          return mockBooking;
        }
        throw new Error('Booking not found');
      }
      
      throw error;
    }
  },

  // Create new booking
  async createBooking(booking: BookingRequest, userId: number): Promise<Booking> {
    try {
      console.log('Creating booking with:', { booking, userId });
      const response = await api.post(`/admin/admin/bookings?userId=${userId}`, booking);
      console.log('Booking created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Booking creation error:', error);
      
      // If backend is not available, return a mock successful response
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        console.log('Backend not available, returning mock response');
        const mockBooking: Booking = {
          id: Math.floor(Math.random() * 1000) + 1,
          userId: userId,
          userName: 'Mock User',
          resourceId: booking.resourceId,
          resourceName: 'Mock Resource',
          startTime: booking.startTime,
          endTime: booking.endTime,
          purpose: booking.purpose,
          expectedAttendees: booking.expectedAttendees,
          status: BookingStatus.PENDING,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Store the mock booking so it appears in the bookings list
        mockBookings.push(mockBooking);
        console.log('Mock booking stored:', mockBooking);
        
        return mockBooking;
      }
      
      throw error;
    }
  },

  // Update booking
  async updateBooking(id: number, booking: Partial<BookingRequest>): Promise<Booking> {
    const response = await api.put(`/admin/bookings/${id}`, booking);
    return response.data;
  },

  // Approve booking (Admin only)
  async approveBooking(id: number, approvedById?: number): Promise<Booking> {
    const params = approvedById ? `?approvedById=${approvedById}` : '';
    const response = await api.put(`/admin/bookings/${id}/approve${params}`);
    return response.data;
  },

  // Reject booking (Admin only)
  async rejectBooking(id: number, approvedById?: number, rejectionReason?: string): Promise<Booking> {
    const params = new URLSearchParams();
    if (approvedById) params.append('approvedById', approvedById.toString());
    if (rejectionReason) params.append('rejectionReason', rejectionReason);
    
    const response = await api.put(`/admin/bookings/${id}/reject?${params.toString()}`);
    return response.data;
  },

  // Cancel booking
  async cancelBooking(id: number, userId: number): Promise<Booking> {
    const response = await api.put(`/admin/bookings/${id}/cancel?userId=${userId}`);
    return response.data;
  },

  // Delete booking
  async deleteBooking(id: number): Promise<void> {
    await api.delete(`/admin/bookings/${id}`);
  },

  // Get bookings by user ID
  async getBookingsByUserId(userId: number): Promise<Booking[]> {
    try {
      const response = await api.get(`/admin/bookings?userId=${userId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching bookings by user ID:', error);
      
      // If backend is not available, return mock bookings
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        return mockBookings.filter(b => b.userId === userId);
      }
      
      throw error;
    }
  },

  // Get bookings by resource ID
  async getBookingsByResourceId(resourceId: number): Promise<Booking[]> {
    try {
      const response = await api.get(`/admin/bookings?resourceId=${resourceId}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching bookings by resource ID:', error);
      
      // If backend is not available, return mock bookings
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        return mockBookings.filter(b => b.resourceId === resourceId);
      }
      
      throw error;
    }
  },

  // Get bookings by status
  async getBookingsByStatus(status: BookingStatus): Promise<Booking[]> {
    try {
      const response = await api.get(`/admin/bookings?status=${status}`);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching bookings by status:', error);
      
      // If backend is not available, return mock bookings
      if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
        return mockBookings.filter(b => b.status === status);
      }
      
      throw error;
    }
  },

  // Get bookings by date range
  async getBookingsByDateRange(startDate: string, endDate: string): Promise<Booking[]> {
    const response = await api.get(`/admin/bookings?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  // Get bookings by resource and date range
  async getBookingsByResourceAndDateRange(
    resourceId: number, 
    startDate: string, 
    endDate: string
  ): Promise<Booking[]> {
    const response = await api.get(
      `/admin/bookings?resourceId=${resourceId}&startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  }
};
