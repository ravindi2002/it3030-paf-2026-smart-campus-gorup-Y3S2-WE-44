import { useState, useEffect } from 'react';
import { Booking, BookingStatus } from '../types/Booking';

interface Notification {
  id: string;
  type: 'booking_approved' | 'booking_rejected' | 'booking_cancelled' | 'booking_reminder';
  title: string;
  message: string;
  booking?: Booking;
  createdAt: string;
  read: boolean;
}

interface BookingNotificationsProps {
  bookings: Booking[];
  currentUserId?: number;
  onNotificationClick?: (notification: Notification) => void;
}

export default function BookingNotifications({ 
  bookings, 
  currentUserId = 1,
  onNotificationClick 
}: BookingNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Generate mock notifications based on booking changes
  useEffect(() => {
    const mockNotifications: Notification[] = bookings
      .filter(booking => booking.userId === currentUserId)
      .map(booking => {
        const notifications: Notification[] = [];
        
        // Approval notification
        if (booking.status === BookingStatus.APPROVED) {
          notifications.push({
            id: `approved-${booking.id}`,
            type: 'booking_approved',
            title: 'Booking Approved! 🎉',
            message: `Your booking for ${booking.resourceName} has been approved.`,
            booking,
            createdAt: booking.updatedAt,
            read: false,
          });
        }
        
        // Rejection notification
        if (booking.status === BookingStatus.REJECTED) {
          notifications.push({
            id: `rejected-${booking.id}`,
            type: 'booking_rejected',
            title: 'Booking Rejected ❌',
            message: `Your booking for ${booking.resourceName} was rejected.${booking.rejectionReason ? ` Reason: ${booking.rejectionReason}` : ''}`,
            booking,
            createdAt: booking.updatedAt,
            read: false,
          });
        }
        
        // Cancellation notification
        if (booking.status === BookingStatus.CANCELLED) {
          notifications.push({
            id: `cancelled-${booking.id}`,
            type: 'booking_cancelled',
            title: 'Booking Cancelled 🚫',
            message: `Your booking for ${booking.resourceName} has been cancelled.`,
            booking,
            createdAt: booking.updatedAt,
            read: false,
          });
        }
        
        return notifications;
      })
      .flat()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, [bookings, currentUserId]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
    setUnreadCount(0);
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    onNotificationClick?.(notification);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'booking_approved':
        return '✅';
      case 'booking_rejected':
        return '❌';
      case 'booking_cancelled':
        return '🚫';
      case 'booking_reminder':
        return '⏰';
      default:
        return '📢';
    }
  };

  
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <div className="text-2xl mb-2">📭</div>
                <div>No notifications</div>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`
                    p-4 border-b border-gray-100 cursor-pointer transition-colors
                    ${notification.read ? 'bg-white' : 'bg-blue-50'}
                    hover:bg-gray-50
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 text-lg">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${notification.read ? 'text-gray-900' : 'text-gray-900'}`}>
                          {notification.title}
                        </p>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      {notification.booking && (
                        <div className="mt-2 text-xs text-gray-500">
                          {notification.booking.resourceName} • {new Date(notification.booking.startTime).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {!notification.read && (
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  // Navigate to full notifications page
                  console.log('Navigate to full notifications');
                }}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
