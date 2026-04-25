import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import BookingCard from '../components/BookingCard';
import BookingStatusManager from '../components/BookingStatusManager';
import { bookingService } from '../services/bookingService';
import { Booking, BookingStatus } from '../types/Booking';

export default function BookingDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchBooking(parseInt(id));
    }
  }, [id]);

  const fetchBooking = async (bookingId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getBookingById(bookingId);
      setBooking(data);
    } catch (err) {
      setError('Failed to fetch booking details');
      console.error('Error fetching booking:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: number, status: BookingStatus, reason?: string) => {
    try {
      setError(null);
      
      if (status === BookingStatus.APPROVED) {
        await bookingService.approveBooking(bookingId, 1); // Mock admin ID
      } else if (status === BookingStatus.REJECTED) {
        await bookingService.rejectBooking(bookingId, 1, reason); // Mock admin ID
      } else if (status === BookingStatus.CANCELLED) {
        await bookingService.cancelBooking(bookingId, 1); // Mock user ID
      }
      
      // Refresh booking details
      await fetchBooking(bookingId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update booking status');
      console.error('Error updating booking status:', err);
    }
  };

  const handleDelete = async () => {
    if (!booking || !confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    try {
      setError(null);
      await bookingService.deleteBooking(booking.id);
      navigate('/bookings');
    } catch (err) {
      setError('Failed to delete booking');
      console.error('Error deleting booking:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading booking details...</div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error || 'Booking not found'}
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

  return (
    <div className="p-6">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
        ← Back to Home
      </Link>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/bookings')}
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Bookings
          </button>
          <h1 className="text-2xl font-bold">Booking Details</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/bookings/${booking.id}/edit`)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Edit Booking
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Delete Booking
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Booking Card */}
        <div className="lg:col-span-2">
          <BookingCard
            booking={booking}
            onCancel={(id) => handleStatusChange(id, BookingStatus.CANCELLED)}
            onApprove={(id) => handleStatusChange(id, BookingStatus.APPROVED)}
            onReject={(id, reason) => handleStatusChange(id, BookingStatus.REJECTED, reason)}
            isAdmin={true} // Mock admin status
            currentUserId={1} // Mock current user ID
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <BookingStatusManager
            booking={booking}
            onStatusChange={handleStatusChange}
          />

          {/* Quick Actions */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => window.print()}
                className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors text-sm"
              >
                🖨️ Print Booking Details
              </button>
              <button
                onClick={() => {
                  const bookingData = JSON.stringify(booking, null, 2);
                  const blob = new Blob([bookingData], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `booking-${booking.id}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors text-sm"
              >
                📥 Export Booking Data
              </button>
              <button
                onClick={() => {
                  const subject = `Booking #${booking.id} - ${booking.resourceName}`;
                  const body = `Booking Details:\n\nResource: ${booking.resourceName}\nUser: ${booking.userName}\nStart: ${new Date(booking.startTime).toLocaleString()}\nEnd: ${new Date(booking.endTime).toLocaleString()}\nPurpose: ${booking.purpose}\nStatus: ${booking.status}`;
                  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                }}
                className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors text-sm"
              >
                📧 Email Booking Details
              </button>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-semibold text-gray-900 mb-3">Additional Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-medium">#{booking.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <span className="font-medium">{booking.userId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Resource ID:</span>
                <span className="font-medium">{booking.resourceId}</span>
              </div>
              {booking.expectedAttendees && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Expected Attendees:</span>
                  <span className="font-medium">{booking.expectedAttendees}</span>
                </div>
              )}
              {booking.approvedBy && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Approved By:</span>
                  <span className="font-medium">User {booking.approvedBy}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
