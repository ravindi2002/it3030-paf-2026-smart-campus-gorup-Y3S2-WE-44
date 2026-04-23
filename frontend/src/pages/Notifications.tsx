import { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { formatDate } from '../utils/formatDate';
import { useAuth } from '../hooks/useAuth';

export default function Notifications() {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      const userId = (user as any)?.id || 1;
      notificationService.getByUserId(userId).then(setNotifications).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      {loading ? (
        <p>Loading...</p>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500">No notifications</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((notification) => (
            <li key={notification.id} className={`p-4 rounded-lg shadow ${notification.isRead ? 'bg-gray-50' : 'bg-yellow-50'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{notification.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{formatDate(notification.createdAt)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}