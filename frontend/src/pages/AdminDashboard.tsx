import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { Booking, BookingStatus } from '../types/Booking';
import api from '../utils/api';
import BookingCalendar from '../components/BookingCalendar';

interface Notification {
  id: number;
  title: string;
  message: string;
  notificationType: string;
  referenceId: number;
  read: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    rejectedBookings: 0,
    cancelledBookings: 0,
    totalUsers: 0,
    totalResources: 0
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hidePendingAlert, setHidePendingAlert] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const bookings = await bookingService.getBookings();
      
      // Fetch notifications for admin
      try {
        const notifRes = await api.get('/notifications/user');
        setNotifications(notifRes.data.slice(0, 5));
      } catch (notifErr) {
        console.log('No notifications available');
      }
      
      // Calculate statistics
      const bookingStats = {
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === BookingStatus.PENDING).length,
        approvedBookings: bookings.filter(b => b.status === BookingStatus.APPROVED).length,
        rejectedBookings: bookings.filter(b => b.status === BookingStatus.REJECTED).length,
        cancelledBookings: bookings.filter(b => b.status === BookingStatus.CANCELLED).length,
        totalUsers: new Set(bookings.map(b => b.userId)).size,
        totalResources: new Set(bookings.map(b => b.resourceId)).size
      };
      
      // Get recent bookings (last 5)
      const sortedBookings = bookings
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      
      setStats(bookingStats);
      setRecentBookings(sortedBookings);
      setAllBookings(bookings);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.APPROVED:
        return 'text-green-600 bg-green-100';
      case BookingStatus.PENDING:
        return 'text-yellow-600 bg-yellow-100';
      case BookingStatus.REJECTED:
        return 'text-red-600 bg-red-100';
      case BookingStatus.CANCELLED:
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.APPROVED:
        return '✅';
      case BookingStatus.PENDING:
        return '⏳';
      case BookingStatus.REJECTED:
        return '❌';
      case BookingStatus.CANCELLED:
        return '🚫';
      default:
        return '📅';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <button
          onClick={fetchDashboardData}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
        ← Back to Home
      </Link>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Manage your campus booking system</p>
        </div>
      </div>

      {/* Notifications Alert */}
      {notifications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="text-blue-600 text-xl mr-3">🔔</div>
              <div>
                <h3 className="font-medium text-blue-900">Recent Notifications</h3>
                <p className="text-sm text-blue-700">
                  You have {notifications.length} recent notification{notifications.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <Link to="/notifications" className="text-blue-600 text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-2">
            {notifications.map((notif) => (
              <Link
                key={notif.id}
                to={`/bookings/${notif.referenceId}`}
                className={`flex items-center p-2 rounded-lg ${notif.read ? 'bg-white' : 'bg-blue-100'} hover:bg-blue-200 transition-colors`}
              >
                <span className="text-lg mr-2">
                  {notif.notificationType.includes('BOOKING') ? '📅' : '🔧'}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-sm text-gray-900">{notif.title}</p>
                  <p className="text-xs text-gray-600">{notif.message}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(notif.createdAt)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Pending Approvals Alert */}
      {stats.pendingBookings > 0 && !hidePendingAlert && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-yellow-600 text-xl mr-3">⚠️</div>
              <div>
                <h3 className="font-medium text-yellow-900">Pending Approvals</h3>
                <p className="text-sm text-yellow-700">
                  You have {stats.pendingBookings} booking{stats.pendingBookings !== 1 ? 's' : ''} awaiting approval.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/bookings?status=PENDING"
                onClick={() => setHidePendingAlert(true)}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors text-sm"
              >
                Review Now
              </Link>
              <button 
                onClick={() => setHidePendingAlert(true)}
                className="text-yellow-600 hover:text-yellow-800"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Booking Calendar */}
      <div className="mb-8">
        <BookingCalendar bookings={allBookings} />
      </div>

      {/* Recent Bookings */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">Recent Bookings</h2>
            <Link to="/bookings" className="text-blue-600 text-sm hover:underline">View All</Link>
          </div>
          <div className="p-4">
            {recentBookings.length === 0 ? (
              <p className="text-gray-500 text-sm">No bookings yet</p>
            ) : (
              <div className="space-y-3">
                {recentBookings.map((booking) => (
                  <Link
                    key={booking.id}
                    to={`/bookings/${booking.id}`}
                    className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">{booking.resourceName}</p>
                      <p className="text-xs text-gray-500">
                        {booking.userName} • {formatDate(booking.startTime)}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      <span className="mr-1">{getStatusIcon(booking.status)}</span>
                      {booking.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}