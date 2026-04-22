import { useState, useEffect, useCallback } from 'react';
import { bookingService } from '../services/bookingService';
import { Booking } from '../types/Booking';

export const useBookings = (userId?: number) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async (params?: { resourceId?: number; status?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingService.getAll({ userId, ...params });
      setBookings(data);
    } catch (err) {
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const createBooking = useCallback(async (data: Partial<Booking>) => {
    if (!userId) return null;
    try {
      const created = await bookingService.create(data as Booking, userId);
      setBookings(prev => [created, ...prev]);
      return created;
    } catch (err) {
      setError('Failed to create booking');
      return null;
    }
  }, [userId]);

  const cancelBooking = useCallback(async (id: number) => {
    try {
      await bookingService.updateStatus(id, 'CANCELLED');
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' as any } : b));
    } catch (err) {
      setError('Failed to cancel booking');
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, fetchBookings, createBooking, cancelBooking };
};