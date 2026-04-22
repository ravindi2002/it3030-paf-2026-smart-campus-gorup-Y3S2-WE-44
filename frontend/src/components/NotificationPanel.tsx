import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { Notification } from '../types/Notification';
import { formatDate } from '../utils/formatDate';

interface NotificationPanelProps {
  userId: number;
}

export default function NotificationPanel({ userId }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getUnread(userId);
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    await notificationService.markAsRead(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    fetchNotifications();
  }, [userId]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="font-semibold mb-4">Notifications</h3>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No new notifications</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map(notification => (
            <li key={notification.id} className="flex justify-between items-start p-2 bg-yellow-50 rounded">
              <div>
                <p className="font-medium text-sm">{notification.title}</p>
                <p className="text-xs text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(notification.createdAt)}</p>
              </div>
              <button onClick={() => markAsRead(notification.id!)} className="text-blue-600 text-sm hover:underline">
                Mark read
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}