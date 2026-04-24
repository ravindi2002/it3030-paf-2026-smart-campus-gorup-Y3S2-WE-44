import { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { Booking, BookingStatus } from '../types/Booking';

interface Reminder {
  id: string;
  bookingId: number;
  type: 'before_start' | 'before_end' | 'status_change' | 'custom';
  title: string;
  message: string;
  scheduledTime: string;
  isRead: boolean;
  createdAt: string;
}

interface BookingRemindersProps {
  userId?: number;
  maxReminders?: number;
}

export default function BookingReminders({ userId = 1, maxReminders = 10 }: BookingRemindersProps) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    fetchReminders();
    // Check for upcoming bookings and generate reminders
    generateUpcomingBookingReminders();
  }, [userId]);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock reminders - in real app, this would come from reminder service
      const mockReminders: Reminder[] = [
        {
          id: '1',
          bookingId: 1,
          type: 'before_start',
          title: 'Booking Starting Soon',
          message: 'Your booking for Lecture Hall A starts in 30 minutes',
          scheduledTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          isRead: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          bookingId: 2,
          type: 'status_change',
          title: 'Booking Approved',
          message: 'Your booking for Computer Lab 101 has been approved',
          scheduledTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          bookingId: 3,
          type: 'before_end',
          title: 'Booking Ending Soon',
          message: 'Your booking for Meeting Room B ends in 15 minutes',
          scheduledTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          isRead: true,
          createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
        }
      ];
      
      setReminders(mockReminders);
    } catch (err) {
      setError('Failed to fetch reminders');
      console.error('Error fetching reminders:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateUpcomingBookingReminders = async () => {
    try {
      const bookings = await bookingService.getBookings();
      const now = new Date();
      
      // Find upcoming bookings within next 24 hours
      const upcomingBookings = bookings.filter(booking => {
        const startTime = new Date(booking.startTime);
        const endTime = new Date(booking.endTime);
        const timeDiff = startTime.getTime() - now.getTime();
        
        // Check if booking starts in next 24 hours
        return timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000;
      });

      // Generate reminders for upcoming bookings
      upcomingBookings.forEach(booking => {
        const startTime = new Date(booking.startTime);
        const timeDiff = startTime.getTime() - now.getTime();
        const hoursUntil = Math.floor(timeDiff / (60 * 60 * 1000));
        
        if (hoursUntil <= 24) {
          const reminder: Reminder = {
            id: `booking-${booking.id}-${hoursUntil}`,
            bookingId: booking.id,
            type: 'before_start',
            title: `Booking Reminder: ${booking.resourceName}`,
            message: `Your booking for ${booking.resourceName} starts in ${hoursUntil} hour${hoursUntil !== 1 ? 's' : ''}`,
            scheduledTime: startTime.toISOString(),
            isRead: false,
            createdAt: new Date().toISOString()
          };
          
          // Add reminder to list (in real app, this would save to backend)
          setReminders(prev => [reminder, ...prev].slice(0, maxReminders));
        }
      });
    } catch (err) {
      console.error('Error generating reminders:', err);
    }
  };

  const markAsRead = (reminderId: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === reminderId 
          ? { ...reminder, isRead: true }
          : reminder
      )
    );
  };

  const markAllAsRead = () => {
    setReminders(prev => 
      prev.map(reminder => ({ ...reminder, isRead: true }))
    );
  };

  const deleteReminder = (reminderId: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
  };

  const getReminderIcon = (type: Reminder['type']) => {
    switch (type) {
      case 'before_start':
        return '⏰';
      case 'before_end':
        return '⏱️';
      case 'status_change':
        return '🔄';
      case 'custom':
        return '📝';
      default:
        return '📢';
    }
  };

  const getReminderColor = (type: Reminder['type']) => {
    switch (type) {
      case 'before_start':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'before_end':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'status_change':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'custom':
        return 'text-purple-600 bg-purple-100 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeUntil = (scheduledTime: string) => {
    const now = new Date();
    const scheduled = new Date(scheduledTime);
    const diff = scheduled.getTime() - now.getTime();
    
    if (diff < 0) return 'Past';
    
    const minutes = Math.floor(diff / (60 * 1000));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days !== 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''}`;
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  };

  const filteredReminders = reminders.filter(reminder => {
    if (filter === 'unread') return !reminder.isRead;
    if (filter === 'read') return reminder.isRead;
    return true;
  });

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading reminders...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Reminders</h1>
          <p className="text-gray-500">Stay updated with your booking notifications</p>
        </div>
        <button
          onClick={generateUpcomingBookingReminders}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          🔄 Refresh Reminders
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 font-medium text-sm ${
              filter === 'all' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            All ({reminders.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 font-medium text-sm ${
              filter === 'unread' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Unread ({reminders.filter(r => !r.isRead).length})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 font-medium text-sm ${
              filter === 'read' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Read ({reminders.filter(r => r.isRead).length})
          </button>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-2 flex justify-end space-x-2">
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Mark All as Read
          </button>
          <button
            onClick={() => setReminders([])}
            className="text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Reminders List */}
      {filteredReminders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-500 text-lg mb-4">🔔</div>
          <div className="text-gray-700 font-medium">No reminders found</div>
          <p className="text-gray-500 text-sm">
            {filter === 'unread' && 'No unread reminders' || 
             filter === 'read' && 'No read reminders' || 
             'No reminders available'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`bg-white rounded-lg shadow p-4 border-l-4 transition-all hover:shadow-lg ${
                !reminder.isRead ? 'border-gray-200' : getReminderColor(reminder.type)
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`text-2xl ${getReminderColor(reminder.type)}`}>
                    {getReminderIcon(reminder.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{reminder.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{reminder.message}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>📅 {formatDate(reminder.scheduledTime)} at {formatTime(reminder.scheduledTime)}</span>
                      <span>• {getTimeUntil(reminder.scheduledTime)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!reminder.isRead && (
                    <button
                      onClick={() => markAsRead(reminder.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteReminder(reminder.id)}
                    className="text-red-600 hover:text-red-800 transition-colors text-xs"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {reminder.isRead && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Read on {formatDate(reminder.createdAt)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Settings */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reminder Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Auto-generate reminders</span>
            <button
              onClick={generateUpcomingBookingReminders}
              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
            >
              Generate Now
            </button>
          </div>
          <div className="text-xs text-gray-500">
            Automatically creates reminders for bookings starting within 24 hours
          </div>
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-gray-700">Maximum reminders</span>
            <select
              value={maxReminders}
              onChange={(e) => {
                const newMax = parseInt(e.target.value);
                setReminders(prev => prev.slice(0, newMax));
              }}
              className="px-3 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <div className="text-xs text-gray-500">
            Limits the number of reminders stored
          </div>
        </div>
      </div>
    </div>
  );
}
