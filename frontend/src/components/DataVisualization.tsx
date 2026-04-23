import { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { Booking, BookingStatus } from '../types/Booking';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
  }[];
}

interface DataVisualizationProps {
  timeRange?: 'week' | 'month' | 'quarter' | 'year';
  refreshInterval?: number;
}

export default function DataVisualization({ 
  timeRange = 'month', 
  refreshInterval = 30000 
}: DataVisualizationProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChart, setSelectedChart] = useState<'overview' | 'utilization' | 'trends' | 'comparison'>('overview');
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    fetchData();
    
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(fetchData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [timeRange, autoRefresh, refreshInterval]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const allBookings = await bookingService.getBookings();
      setBookings(allBookings);
    } catch (err) {
      setError('Failed to fetch data for visualization');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    const now = new Date();
    let startDate: Date;

    switch (timeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return bookings.filter(booking => 
      new Date(booking.createdAt) >= startDate
    );
  };

  const getOverviewData = (): ChartData => {
    const filteredBookings = getFilteredBookings();
    const statusCounts = {
      approved: filteredBookings.filter(b => b.status === BookingStatus.APPROVED).length,
      pending: filteredBookings.filter(b => b.status === BookingStatus.PENDING).length,
      rejected: filteredBookings.filter(b => b.status === BookingStatus.REJECTED).length,
      cancelled: filteredBookings.filter(b => b.status === BookingStatus.CANCELLED).length
    };

    return {
      labels: ['Approved', 'Pending', 'Rejected', 'Cancelled'],
      datasets: [{
        label: 'Booking Status Distribution',
        data: [statusCounts.approved, statusCounts.pending, statusCounts.rejected, statusCounts.cancelled],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#6B7280'],
        borderColor: ['#059669', '#D97706', '#DC2626', '#4B5563']
      }]
    };
  };

  const getUtilizationData = (): ChartData => {
    const filteredBookings = getFilteredBookings();
    const resourceUtilization = new Map<string, number>();
    
    filteredBookings.forEach(booking => {
      const current = resourceUtilization.get(booking.resourceName) || 0;
      resourceUtilization.set(booking.resourceName, current + 1);
    });

    const sortedResources = Array.from(resourceUtilization.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      labels: sortedResources.map(([name]) => name),
      datasets: [{
        label: 'Resource Utilization',
        data: sortedResources.map(([, count]) => count),
        backgroundColor: [
          '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
          '#EC4899', '#14B8A6', '#F97316', '#06B6D4', '#6366F1'
        ],
        borderColor: [
          '#1D4ED8', '#059669', '#D97706', '#DC2626', '#7C3AED',
          '#DB2777', '#0D9488', '#EA580C', '#047857', '#4F46E5'
        ]
      }]
    };
  };

  const getTrendsData = (): ChartData => {
    const filteredBookings = getFilteredBookings();
    const dailyData = new Map<string, number>();

    // Group by day
    filteredBookings.forEach(booking => {
      const day = new Date(booking.createdAt).toLocaleDateString();
      const current = dailyData.get(day) || 0;
      dailyData.set(day, current + 1);
    });

    // Get last 7 days
    const last7Days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStr = date.toLocaleDateString();
      last7Days.push(dayStr);
    }

    return {
      labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'Daily Booking Trends',
        data: last7Days.map(day => dailyData.get(day) || 0),
        backgroundColor: '#3B82F6',
        borderColor: '#1D4ED8'
      }]
    };
  };

  const getComparisonData = (): ChartData => {
    const filteredBookings = getFilteredBookings();
    const monthlyData = new Map<string, { approved: number; rejected: number; total: number }>();

    filteredBookings.forEach(booking => {
      const month = new Date(booking.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
      const current = monthlyData.get(month) || { approved: 0, rejected: 0, total: 0 };
      
      if (booking.status === BookingStatus.APPROVED) {
        current.approved++;
      } else if (booking.status === BookingStatus.REJECTED) {
        current.rejected++;
      }
      current.total++;
      
      monthlyData.set(month, current);
    });

    const last6Months = Array.from(monthlyData.keys()).slice(-6);
    const labels = last6Months.map(month => {
      const date = new Date(month + ' 1, 2024');
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });

    return {
      labels,
      datasets: [
        {
          label: 'Approved',
          data: last6Months.map(month => monthlyData.get(month)?.approved || 0),
          backgroundColor: '#10B981',
          borderColor: '#059669'
        },
        {
          label: 'Rejected',
          data: last6Months.map(month => monthlyData.get(month)?.rejected || 0),
          backgroundColor: '#EF4444',
          borderColor: '#DC2626'
        },
        {
          label: 'Total',
          data: last6Months.map(month => monthlyData.get(month)?.total || 0),
          backgroundColor: '#3B82F6',
          borderColor: '#1D4ED8'
        }
      ]
    };
  };

  const getChartData = () => {
    switch (selectedChart) {
      case 'overview':
        return getOverviewData();
      case 'utilization':
        return getUtilizationData();
      case 'trends':
        return getTrendsData();
      case 'comparison':
        return getComparisonData();
      default:
        return getOverviewData();
    }
  };

  const exportChart = (format: 'png' | 'svg' | 'pdf') => {
    // Mock export functionality
    alert(`Exporting ${selectedChart} chart as ${format.toUpperCase()}`);
  };

  const refreshData = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading visualization data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <button
          onClick={refreshData}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  const chartData = getChartData();
  const filteredBookings = getFilteredBookings();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Visualization</h1>
          <p className="text-gray-500">Interactive charts and analytics for booking insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Auto Refresh</span>
          </label>
          <button
            onClick={refreshData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Chart Type Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
            <select
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="overview">Status Overview</option>
              <option value="utilization">Resource Utilization</option>
              <option value="trends">Booking Trends</option>
              <option value="comparison">Monthly Comparison</option>
            </select>
          </div>

          {/* Time Range Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => {/* In real app, this would update parent */}}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          {/* Export Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Export Chart</label>
            <div className="flex space-x-2">
              <button
                onClick={() => exportChart('png')}
                className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors"
              >
                🖼️ PNG
              </button>
              <button
                onClick={() => exportChart('svg')}
                className="bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 transition-colors"
              >
                📄 SVG
              </button>
              <button
                onClick={() => exportChart('pdf')}
                className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors"
              >
                📑 PDF
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statistics</label>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Bookings:</span>
                <span className="font-medium">{filteredBookings.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Approval Rate:</span>
                <span className="font-medium">
                  {filteredBookings.length > 0 
                    ? Math.round((filteredBookings.filter(b => b.status === BookingStatus.APPROVED).length / filteredBookings.length) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Display */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedChart === 'overview' && 'Booking Status Overview'}
            {selectedChart === 'utilization' && 'Resource Utilization'}
            {selectedChart === 'trends' && 'Booking Trends'}
            {selectedChart === 'comparison' && 'Monthly Comparison'}
          </h2>
          <div className="text-sm text-gray-500">
            {filteredBookings.length} bookings in selected period
          </div>
        </div>

        {/* Mock Chart Visualization */}
        <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <div className="text-gray-600 font-medium mb-2">Interactive Chart</div>
            <div className="text-sm text-gray-500 mb-4">
              Chart Type: <span className="font-medium">{selectedChart}</span>
            </div>
            
            {/* Chart Data Preview */}
            <div className="bg-white p-4 rounded-lg shadow-sm text-left max-w-md">
              <div className="text-sm font-medium text-gray-900 mb-2">Chart Data Preview:</div>
              <div className="space-y-1 text-xs">
                <div className="font-medium">Labels:</div>
                <div className="text-gray-600">{chartData.labels.join(', ')}</div>
                
                <div className="font-medium mt-2">Datasets:</div>
                {chartData.datasets.map((dataset, index) => (
                  <div key={index} className="mb-2">
                    <div className="font-medium">{dataset.label}:</div>
                    <div className="text-gray-600">[{dataset.data.join(', ')}]</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-gray-400 mt-4">
              In production, this would render as an actual chart using Chart.js or similar library
            </div>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Peak Hours */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🕐 Peak Hours</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Most Active:</span>
              <span className="font-medium">10:00 - 14:00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Least Active:</span>
              <span className="font-medium">22:00 - 06:00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Average/Day:</span>
              <span className="font-medium">8.5 bookings</span>
            </div>
          </div>
        </div>

        {/* Top Resources */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🏢 Top Resources</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Most Booked:</span>
              <span className="font-medium">Lecture Hall A</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Utilization:</span>
              <span className="font-medium">78%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Resources:</span>
              <span className="font-medium">12</span>
            </div>
          </div>
        </div>

        {/* User Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 User Activity</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Active Users:</span>
              <span className="font-medium">45</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg Bookings/User:</span>
              <span className="font-medium">3.2</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Top User:</span>
              <span className="font-medium">John Doe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
