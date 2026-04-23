import { useState, useEffect } from 'react';

interface DashboardStats {
  totalBookings: number;
  activeUsers: number;
  totalResources: number;
  pendingTickets: number;
  todayBookings: number;
  weeklyTrend: number;
  systemHealth: number;
  averageResponseTime: number;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  path: string;
}

interface RecentActivity {
  id: string;
  type: 'booking' | 'ticket' | 'user' | 'resource';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
  status: 'success' | 'warning' | 'error' | 'info';
}

export default function MainDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    activeUsers: 0,
    totalResources: 0,
    pendingTickets: 0,
    todayBookings: 0,
    weeklyTrend: 0,
    systemHealth: 0,
    averageResponseTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [quickActions] = useState<QuickAction[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock dashboard data
      const mockStats: DashboardStats = {
        totalBookings: 1247,
        activeUsers: 456,
        totalResources: 28,
        pendingTickets: 12,
        todayBookings: 23,
        weeklyTrend: 15.3,
        systemHealth: 98.7,
        averageResponseTime: 2.4
      };

      const mockActivities: RecentActivity[] = [
        {
          id: '1',
          type: 'booking',
          title: 'New booking created',
          description: 'John Doe booked Lecture Hall A for tomorrow',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
          user: 'John Doe',
          status: 'success'
        },
        {
          id: '2',
          type: 'ticket',
          title: 'Critical ticket resolved',
          description: 'Projector issue in Lecture Hall A has been resolved',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          user: 'IT Support',
          status: 'success'
        },
        {
          id: '3',
          type: 'user',
          title: 'New user registered',
          description: 'Sarah Wilson joined the platform',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          user: 'System',
          status: 'info'
        },
        {
          id: '4',
          type: 'resource',
          title: 'Resource maintenance scheduled',
          description: 'Computer Lab 101 scheduled for maintenance this weekend',
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          user: 'Facility Admin',
          status: 'warning'
        },
        {
          id: '5',
          type: 'booking',
          title: 'Booking conflict detected',
          description: 'Double booking attempt for Meeting Room B',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          user: 'Mike Johnson',
          status: 'error'
        }
      ];

      const mockQuickActions: QuickAction[] = [
        {
          id: '1',
          title: 'Create Booking',
          description: 'Book a resource for your event',
          icon: '📅',
          color: 'bg-blue-600',
          path: '/bookings/create'
        },
        {
          id: '2',
          title: 'View Calendar',
          description: 'See all bookings in calendar view',
          icon: '📆',
          color: 'bg-green-600',
          path: '/calendar'
        },
        {
          id: '3',
          title: 'Manage Resources',
          description: 'Add or update campus resources',
          icon: '🏢',
          color: 'bg-purple-600',
          path: '/resources'
        },
        {
          id: '4',
          title: 'Support Tickets',
          description: 'Create or manage support tickets',
          icon: '🎫',
          color: 'bg-orange-600',
          path: '/tickets'
        },
        {
          id: '5',
          title: 'User Analytics',
          description: 'View detailed analytics and reports',
          icon: '📊',
          color: 'bg-teal-600',
          path: '/analytics'
        },
        {
          id: '6',
          title: 'System Settings',
          description: 'Configure system preferences',
          icon: '⚙️',
          color: 'bg-gray-600',
          path: '/settings'
        }
      ];

      setStats(mockStats);
      setRecentActivities(mockActivities);
      setQuickActions(mockQuickActions);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: RecentActivity['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'info':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'booking':
        return '📅';
      case 'ticket':
        return '🎫';
      case 'user':
        return '👤';
      case 'resource':
        return '🏢';
      default:
        return '📋';
    }
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return '📈';
    if (trend < 0) return '📉';
    return '➡️';
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Smart Campus Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-3xl">📅</div>
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
          <div className="text-sm text-gray-600">Total Bookings</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-3xl">👥</div>
            <span className="text-sm text-gray-500">Active</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.activeUsers}</div>
          <div className="text-sm text-gray-600">Active Users</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-3xl">🏢</div>
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalResources}</div>
          <div className="text-sm text-gray-600">Resources</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-3xl">🎫</div>
            <span className="text-sm text-gray-500">Pending</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.pendingTickets}</div>
          <div className="text-sm text-gray-600">Pending Tickets</div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-gray-900">Today's Bookings</div>
              <div className="text-3xl font-bold text-blue-600">{stats.todayBookings}</div>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-gray-900">Weekly Trend</div>
              <div className="flex items-center">
                <span className="text-3xl font-bold">{getTrendIcon(stats.weeklyTrend)}</span>
                <span className={`text-2xl font-bold ml-2 ${getTrendColor(stats.weeklyTrend)}`}>
                  {Math.abs(stats.weeklyTrend)}%
                </span>
              </div>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold text-gray-900">System Health</div>
              <div className="text-3xl font-bold text-green-600">{stats.systemHealth}%</div>
            </div>
            <div className="text-4xl">💚</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => alert(`Navigating to ${action.path}`)}
              className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity text-center`}
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <div className="text-sm font-medium">{action.title}</div>
              <div className="text-xs opacity-80 mt-1">{action.description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="text-2xl mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{activity.title}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                    <span>🕐 {new Date(activity.timestamp).toLocaleTimeString()}</span>
                    {activity.user && <span>👤 {activity.user}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
            View All Activity →
          </button>
        </div>

        {/* System Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Performance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">⚡</div>
                <div>
                  <div className="font-medium text-gray-900">Response Time</div>
                  <div className="text-sm text-gray-600">Average API response</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.averageResponseTime}s</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">💾</div>
                <div>
                  <div className="font-medium text-gray-900">Database Status</div>
                  <div className="text-sm text-gray-600">Connection health</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">Healthy</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">🔒</div>
                <div>
                  <div className="font-medium text-gray-900">Security</div>
                  <div className="text-sm text-gray-600">System security status</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">Secure</div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">📡</div>
                <div>
                  <div className="font-medium text-gray-900">Backup Status</div>
                  <div className="text-sm text-gray-600">Last backup</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">2 hours ago</div>
            </div>
          </div>

          <button className="w-full mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
            View Detailed Metrics →
          </button>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { time: '10:00 AM', event: 'Computer Science Lecture', location: 'Lecture Hall A', attendees: 45 },
            { time: '2:00 PM', event: 'Team Meeting', location: 'Meeting Room B', attendees: 8 },
            { time: '4:00 PM', event: 'Study Session', location: 'Study Room 201', attendees: 6 },
            { time: '6:00 PM', event: 'Guest Lecture', location: 'Conference Room D', attendees: 120 },
            { time: '8:00 PM', event: 'Club Meeting', location: 'Meeting Room C', attendees: 15 },
            { time: '10:00 PM', event: 'Maintenance Window', location: 'Computer Lab 101', attendees: 0 }
          ].map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900">{item.time}</span>
                <span className="text-xs text-gray-500">{item.attendees} attendees</span>
              </div>
              <div className="font-medium text-gray-900">{item.event}</div>
              <div className="text-sm text-gray-600 mt-1">📍 {item.location}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
