import { Booking, BookingStatus } from '../types/Booking';

interface BookingStatisticsProps {
  bookings: Booking[];
}

export default function BookingStatistics({ bookings }: BookingStatisticsProps) {
  const calculateStats = () => {
    const total = bookings.length;
    const byStatus = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {} as Record<BookingStatus, number>);

    const approved = byStatus[BookingStatus.APPROVED] || 0;
    const pending = byStatus[BookingStatus.PENDING] || 0;
    const rejected = byStatus[BookingStatus.REJECTED] || 0;
    const cancelled = byStatus[BookingStatus.CANCELLED] || 0;

    const approvalRate = total > 0 ? (approved / (approved + rejected)) * 100 : 0;
    const cancellationRate = total > 0 ? (cancelled / total) * 100 : 0;

    // Most booked resources
    const resourceCounts = bookings.reduce((acc, booking) => {
      acc[booking.resourceName] = (acc[booking.resourceName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topResources = Object.entries(resourceCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    // Recent bookings (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentBookings = bookings.filter(booking => 
      new Date(booking.createdAt) >= sevenDaysAgo
    );

    // Upcoming bookings
    const now = new Date();
    const upcomingBookings = bookings.filter(booking => 
      booking.status === BookingStatus.APPROVED && 
      new Date(booking.startTime) > now
    );

    return {
      total,
      byStatus,
      approved,
      pending,
      rejected,
      cancelled,
      approvalRate,
      cancellationRate,
      topResources,
      recentBookings: recentBookings.length,
      upcomingBookings: upcomingBookings.length,
    };
  };

  const stats = calculateStats();

  const statusColors = {
    [BookingStatus.PENDING]: 'bg-yellow-500',
    [BookingStatus.APPROVED]: 'bg-green-500',
    [BookingStatus.REJECTED]: 'bg-red-500',
    [BookingStatus.CANCELLED]: 'bg-gray-500',
  };

  
  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 p-3 rounded-full">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Total Bookings</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Approved</div>
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-full">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 p-3 rounded-full">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-500">Approval Rate</div>
              <div className="text-2xl font-bold text-purple-600">{stats.approvalRate.toFixed(1)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Breakdown</h3>
        <div className="space-y-3">
          {Object.entries(stats.byStatus).map(([status, count]) => {
            const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded ${statusColors[status as BookingStatus]}`}></div>
                  <span className="text-sm font-medium text-gray-700">{status}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 max-w-xs">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${statusColors[status as BookingStatus]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-16 text-right">{count} ({percentage.toFixed(1)}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Resources */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Booked Resources</h3>
        {stats.topResources.length > 0 ? (
          <div className="space-y-3">
            {stats.topResources.map(([resourceName, count], index) => (
              <div key={resourceName} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{resourceName}</span>
                </div>
                <span className="text-sm text-gray-600">{count} bookings</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">No booking data available</div>
        )}
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Last 7 days</span>
              <span className="text-sm font-bold text-blue-600">{stats.recentBookings} bookings</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Upcoming</span>
              <span className="text-sm font-bold text-green-600">{stats.upcomingBookings} bookings</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Approval Rate</span>
              <span className="text-sm font-bold text-green-600">{stats.approvalRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Cancellation Rate</span>
              <span className="text-sm font-bold text-red-600">{stats.cancellationRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
