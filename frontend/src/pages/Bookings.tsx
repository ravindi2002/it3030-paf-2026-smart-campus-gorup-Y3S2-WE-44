import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookingCard from '../components/BookingCard';
import { bookingService } from '../services/bookingService';
import { Booking, BookingStatus, BookingFilters } from '../types/Booking';
import { useAuth } from '../hooks/useAuth';

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookingFilters>({});
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await bookingService.getBookings(filters);
      setBookings(data);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const handleCancel = async (id: number) => {
    if (!user?.id) {
      setError('Please log in to cancel a booking');
      return;
    }
    try {
      await bookingService.cancelBooking(id, user.id);
      await fetchBookings();
    } catch (err) {
      setError('Failed to cancel booking');
      console.error('Error cancelling booking:', err);
    }
  };

  const handleApprove = async (id: number) => {
    const adminId = user?.id || 1;
    try {
      await bookingService.approveBooking(id, adminId);
      await fetchBookings();
    } catch (err) {
      setError('Failed to approve booking');
      console.error('Error approving booking:', err);
    }
  };

  const handleReject = async (id: number, reason?: string) => {
    const adminId = user?.id || 1;
    try {
      await bookingService.rejectBooking(id, adminId, reason);
      await fetchBookings();
    } catch (err) {
      setError('Failed to reject booking');
      console.error('Error rejecting booking:', err);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/bookings/${id}?edit=true`);
  };

  const handleUpdate = async (id: number, data: any) => {
    try {
      await bookingService.updateBooking(id, data);
      await fetchBookings();
    } catch (err) {
      setError('Failed to update booking');
      console.error('Error updating booking:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await bookingService.deleteBooking(id);
      await fetchBookings();
    } catch (err) {
      setError('Failed to delete booking');
      console.error('Error deleting booking:', err);
    }
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="p-6">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
        ← Back to Home
      </Link>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <button
          onClick={() => navigate('/bookings/create')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          New Booking
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                status: e.target.value as BookingStatus || undefined
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value={BookingStatus.PENDING}>Pending</option>
              <option value={BookingStatus.APPROVED}>Approved</option>
              <option value={BookingStatus.REJECTED}>Rejected</option>
              <option value={BookingStatus.CANCELLED}>Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
            <input
              type="number"
              min="1"
              value={filters.userId || ''}
              onChange={(e) => {
                const value = e.target.value;
                const numValue = value ? parseInt(value) : undefined;
                // Only allow positive numbers
                if (numValue === undefined || numValue > 0) {
                  setFilters(prev => ({
                    ...prev,
                    userId: numValue
                  }));
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter user ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Resource ID</label>
            <input
              type="number"
              min="1"
              value={filters.resourceId || ''}
              onChange={(e) => {
                const value = e.target.value;
                const numValue = value ? parseInt(value) : undefined;
                // Only allow positive numbers
                if (numValue === undefined || numValue > 0) {
                  setFilters(prev => ({
                    ...prev,
                    resourceId: numValue
                  }));
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter resource ID"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="text-gray-500">Loading bookings...</div>
        </div>
      )}

      {/* Bookings List */}
      {!loading && (
        <>
          {bookings.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <div className="text-gray-500">
                {Object.keys(filters).length > 0 
                  ? 'No bookings found matching your filters' 
                  : 'No bookings found'}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {bookings.map(booking => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={handleCancel}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  isAdmin={isAdmin()}
                  currentUserId={user?.id || 0}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}