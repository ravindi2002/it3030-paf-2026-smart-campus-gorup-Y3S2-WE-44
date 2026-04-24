import { useMemo } from 'react';
import { Booking, BookingStatus } from '../types/Booking';

interface BookingAnalyticsProps {
  bookings: Booking[];
}

export default function BookingAnalytics({ bookings }: BookingAnalyticsProps) {
  const analytics = useMemo(() => {
    // Time-based analytics
    const bookingsByMonth = bookings.reduce((acc, booking) => {
      const date = new Date(booking.startTime);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, total: 0, approved: 0, rejected: 0, pending: 0, cancelled: 0 };
      }
      acc[monthKey].total++;
      acc[monthKey][booking.status.toLowerCase() as keyof typeof acc[typeof monthKey]]++;
      return acc;
    }, {} as Record<string, any>);

    // Resource utilization
    const resourceUtilization = bookings.reduce((acc, booking) => {
      if (!acc[booking.resourceName]) {
        acc[booking.resourceName] = { name: booking.resourceName, total: 0, approved: 0, hours: 0 };
      }
      acc[booking.resourceName].total++;
      if (booking.status === BookingStatus.APPROVED) {
        acc[booking.resourceName].approved++;
        const duration = (new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / (1000 * 60 * 60);
        acc[booking.resourceName].hours += duration;
      }
      return acc;
    }, {} as Record<string, any>);

    // Peak hours analysis
    const hourlyBookings = bookings.reduce((acc, booking) => {
      const hour = new Date(booking.startTime).getHours();
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Day of week analysis
    const dayOfWeekBookings = bookings.reduce((acc, booking) => {
      const day = new Date(booking.startTime).getDay();
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = dayNames[day];
      if (!acc[dayName]) {
        acc[dayName] = { day: dayName, total: 0, approved: 0 };
      }
      acc[dayName].total++;
      if (booking.status === BookingStatus.APPROVED) {
        acc[dayName].approved++;
      }
      return acc;
    }, {} as Record<string, any>);

    // Duration analysis
    const durations = bookings
      .filter(b => b.status === BookingStatus.APPROVED)
      .map(booking => {
        const duration = (new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / (1000 * 60 * 60);
        return duration;
      });

    const avgDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;

    return {
      bookingsByMonth: Object.values(bookingsByMonth).sort((a, b) => a.month.localeCompare(b.month)),
      resourceUtilization: Object.values(resourceUtilization).sort((a, b) => b.total - a.total),
      hourlyBookings: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        bookings: hourlyBookings[i] || 0
      })),
      dayOfWeekBookings: Object.values(dayOfWeekBookings),
      avgDuration: avgDuration.toFixed(1),
      totalBookings: bookings.length,
      approvedBookings: bookings.filter(b => b.status === BookingStatus.APPROVED).length,
      rejectionRate: bookings.filter(b => b.status === BookingStatus.APPROVED || b.status === BookingStatus.REJECTED).length > 0 
        ? (bookings.filter(b => b.status === BookingStatus.REJECTED).length / 
           bookings.filter(b => b.status === BookingStatus.APPROVED || b.status === BookingStatus.REJECTED).length * 100).toFixed(1)
        : 0,
    };
  }, [bookings]);

  const renderBarChart = (data: any[], title: string, dataKey: string, labelKey: string, color: string = 'blue') => {
    const maxValue = Math.max(...data.map(d => d[dataKey]));
    
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-20 text-sm text-gray-600 truncate">
                {item[labelKey]}
              </div>
              <div className="flex-1 mx-2">
                <div className="bg-gray-200 rounded-full h-6 relative">
                  <div
                    className={`bg-${color}-500 h-6 rounded-full flex items-center justify-end pr-2`}
                    style={{ width: `${(item[dataKey] / maxValue) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">
                      {item[dataKey]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLineChart = (data: any[], title: string, dataKey: string, labelKey: string) => {
    const maxValue = Math.max(...data.map(d => d[dataKey]));
    
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="h-48 flex items-end space-x-1">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full">
                <div
                  className="bg-blue-500 rounded-t"
                  style={{ height: `${(item[dataKey] / maxValue) * 100}%`, minHeight: '2px' }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 mt-1 rotate-45 origin-left">
                {item[labelKey]}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPieChart = (data: { label: string; value: number; color: string }[], title: string) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded bg-${item.color}-500`}></div>
                <span className="text-sm text-gray-700">{item.label}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">{item.value}</span>
                <span className="text-xs text-gray-500">
                  ({total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Bookings</div>
          <div className="text-2xl font-bold text-gray-900">{analytics.totalBookings}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Approved</div>
          <div className="text-2xl font-bold text-green-600">{analytics.approvedBookings}</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Rejection Rate</div>
          <div className="text-2xl font-bold text-red-600">{analytics.rejectionRate}%</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Avg Duration</div>
          <div className="text-2xl font-bold text-blue-600">{analytics.avgDuration}h</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        {renderLineChart(
          analytics.bookingsByMonth.slice(-6), // Last 6 months
          'Monthly Booking Trend',
          'total',
          'month'
        )}

        {/* Peak Hours */}
        {renderBarChart(
          analytics.hourlyBookings.filter(h => h.bookings > 0),
          'Peak Booking Hours',
          'bookings',
          'hour',
          'green'
        )}

        {/* Resource Utilization */}
        {renderBarChart(
          analytics.resourceUtilization.slice(0, 8), // Top 8 resources
          'Resource Utilization',
          'total',
          'name',
          'purple'
        )}

        {/* Day of Week Analysis */}
        {renderBarChart(
          analytics.dayOfWeekBookings,
          'Bookings by Day of Week',
          'total',
          'day',
          'orange'
        )}
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Distribution */}
        {renderPieChart([
          { label: 'Approved', value: analytics.approvedBookings, color: 'green' },
          { label: 'Pending', value: bookings.filter(b => b.status === BookingStatus.PENDING).length, color: 'yellow' },
          { label: 'Rejected', value: bookings.filter(b => b.status === BookingStatus.REJECTED).length, color: 'red' },
          { label: 'Cancelled', value: bookings.filter(b => b.status === BookingStatus.CANCELLED).length, color: 'gray' },
        ], 'Status Distribution')}

        {/* Top Resources by Hours */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Resources by Usage Hours</h3>
          <div className="space-y-2">
            {analytics.resourceUtilization
              .sort((a, b) => b.hours - a.hours)
              .slice(0, 5)
              .map((resource, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{resource.name}</span>
                  <span className="text-sm font-medium">{resource.hours.toFixed(1)}h</span>
                </div>
              ))}
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Busiest Hour:</span>
              <span className="font-medium">
                {analytics.hourlyBookings.reduce((max, curr) => 
                  curr.bookings > max.bookings ? curr : max
                ).hour}:00
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Busiest Day:</span>
              <span className="font-medium">
                {analytics.dayOfWeekBookings.reduce((max, curr) => 
                  curr.total > max.total ? curr : max
                ).day}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Approval Rate:</span>
              <span className="font-medium text-green-600">
                {analytics.totalBookings > 0 
                  ? ((analytics.approvedBookings / analytics.totalBookings) * 100).toFixed(1)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
