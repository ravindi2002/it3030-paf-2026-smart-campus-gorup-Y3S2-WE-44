import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { bookingService } from '../services/bookingService';
import { Booking, BookingRequest, Resource } from '../types/Booking';
import api from '../utils/api';

export default function EditBooking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBookingData();
    }
  }, [id]);

  const fetchBookingData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const bookingData = await bookingService.getBookingById(parseInt(id!));
      const res = await api.get('/admin/resources');
      const activeResources = res.data.filter((r: any) => r.status === 'ACTIVE');
      
      setBooking(bookingData);
      setResources(activeResources);
    } catch (err) {
      setError('Failed to fetch booking data');
      console.error('Error fetching booking:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (bookingData: BookingRequest) => {
    if (!booking) return;

    try {
      setSubmitting(true);
      setError(null);
      
      await bookingService.updateBooking(booking.id, bookingData);
      
      // Navigate to booking details after successful update
      navigate(`/bookings/${booking.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update booking');
      console.error('Error updating booking:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/bookings/${booking?.id}`);
  };

  const handleConflictCheck = async (resourceId: number, startTime: string, endTime: string): Promise<boolean> => {
    try {
      // Check for conflicts excluding current booking
      const allBookings = await bookingService.getBookings();
      const conflictingBookings = allBookings.filter((b: Booking) => 
        b.id !== booking?.id &&
        b.resourceId === resourceId &&
        b.status === 'APPROVED' &&
        (
          (new Date(startTime) < new Date(b.endTime) && new Date(endTime) > new Date(b.startTime))
        )
      );
      
      return conflictingBookings.length > 0;
    } catch (err) {
      console.error('Error checking conflicts:', err);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading booking data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <button
          onClick={() => navigate('/bookings')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-6">
          Booking not found
        </div>
        <button
          onClick={() => navigate('/bookings')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  // Prepare initial data for the form
  const initialData: Partial<BookingRequest> = {
    resourceId: booking.resourceId,
    startTime: booking.startTime,
    endTime: booking.endTime,
    purpose: booking.purpose,
    expectedAttendees: booking.expectedAttendees,
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/bookings')}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Bookings
          </button>
          <h1 className="text-2xl font-bold">Edit Booking</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/bookings/${booking.id}`)}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>

      {/* Booking Info */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-900">Booking ID:</span>
            <span className="text-blue-700 ml-2">#{booking.id}</span>
          </div>
          <div>
            <span className="font-medium text-blue-900">Current Status:</span>
            <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
              booking.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
              booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              booking.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {booking.status}
            </span>
          </div>
          <div>
            <span className="font-medium text-blue-900">Created:</span>
            <span className="text-blue-700 ml-2">
              {new Date(booking.createdAt).toLocaleString()}
            </span>
          </div>
          <div>
            <span className="font-medium text-blue-900">Last Updated:</span>
            <span className="text-blue-700 ml-2">
              {new Date(booking.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Booking Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Edit Booking Details</h2>
          <p className="text-sm text-gray-600">
            Modify the booking information below. Changes will be saved immediately.
          </p>
        </div>

        <BookingForm
          resources={resources}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={submitting}
          initialData={initialData}
          onConflictCheck={handleConflictCheck}
        />
      </div>

      {/* Help Information */}
      <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
        <h3 className="font-medium text-yellow-900 mb-2">Edit Guidelines</h3>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>• You can modify resource, time, purpose, and expected attendees</li>
          <li>• Status changes require admin approval</li>
          <li>• Conflict detection will prevent overlapping bookings</li>
          <li>• Start time must be in the future</li>
          <li>• End time must be after start time</li>
          {booking.status === 'APPROVED' && (
            <li>• Approved bookings may have cancellation restrictions</li>
          )}
        </ul>
      </div>
    </div>
  );
}
