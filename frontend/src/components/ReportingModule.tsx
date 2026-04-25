import { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { Booking, BookingStatus } from '../types/Booking';

interface Report {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom' | 'utilization' | 'user_activity' | 'resource_performance';
  generatedAt: string;
  data: any;
  format: 'pdf' | 'excel' | 'csv';
  filters: ReportFilters;
  size: number;
  status: 'generating' | 'completed' | 'failed';
}

interface ReportFilters {
  startDate?: string;
  endDate?: string;
  userId?: number;
  resourceId?: number;
  status?: string;
  department?: string;
}

export default function ReportingModule() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filters, setFilters] = useState<ReportFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // Mock reports
      const mockReports: Report[] = [
        {
          id: '1',
          name: 'Daily Booking Report',
          type: 'daily',
          generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          data: { totalBookings: 25, approved: 20, pending: 5, rejected: 2, cancelled: 3 },
          format: 'pdf',
          filters: { startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
          size: 1024,
          status: 'completed'
        },
        {
          id: '2',
          name: 'Weekly Utilization Report',
          type: 'utilization',
          generatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          data: { utilization: '78%', peakHours: '10:00-14:00', mostUsedResource: 'Lecture Hall A' },
          format: 'excel',
          filters: { startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
          size: 2048,
          status: 'completed'
        },
        {
          id: '3',
          name: 'User Activity Report',
          type: 'user_activity',
          generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          data: { activeUsers: 45, averageBookings: 3.2, topUser: 'John Doe' },
          format: 'csv',
          filters: { department: 'Computer Science' },
          size: 512,
          status: 'completed'
        }
      ];
      setReports(mockReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type: Report['type']) => {
    setGenerating(true);
    try {
      // Mock report generation with real-time status updates
      const newReport: Report = {
        id: Date.now().toString(),
        name: getReportName(type),
        type,
        generatedAt: new Date().toISOString(),
        data: { summary: 'Generating report...', filters },
        format: 'pdf',
        filters,
        size: 0,
        status: 'generating'
      };

      setReports(prev => [newReport, ...prev]);

      // Simulate report generation
      setTimeout(() => {
        setReports(prev => 
          prev.map(report => 
            report.id === newReport.id 
              ? { 
                  ...report, 
                  status: 'completed' as const,
                  data: getReportData(type),
                  size: Math.floor(Math.random() * 5000) + 500
                }
              : report
          )
        );
        setGenerating(false);
      }, 2000);

    } catch (error) {
      console.error('Error generating report:', error);
      setGenerating(false);
    }
  };

  const getReportName = (type: Report['type']) => {
    const names = {
      daily: 'Daily Booking Report',
      weekly: 'Weekly Summary Report',
      monthly: 'Monthly Analytics Report',
      custom: 'Custom Analysis Report',
      utilization: 'Resource Utilization Report',
      user_activity: 'User Activity Report',
      resource_performance: 'Resource Performance Report'
    };
    return names[type];
  };

  const getReportData = (type: Report['type']) => {
    const data = {
      daily: { totalBookings: 25, approved: 20, pending: 5, revenue: 1250 },
      weekly: { totalBookings: 175, utilization: '78%', peakHours: '10:00-14:00' },
      monthly: { totalBookings: 750, growth: '12%', topResource: 'Lecture Hall A' },
      custom: { customMetrics: 'User-defined analysis results' },
      utilization: { utilization: '78%', peakHours: '10:00-14:00', mostUsedResource: 'Lecture Hall A' },
      user_activity: { activeUsers: 45, averageBookings: 3.2, topUser: 'John Doe' },
      resource_performance: { efficiency: '92%', downtime: '2.3%', maintenance: 'Scheduled' }
    };
    return data[type];
  };

  const downloadReport = (report: Report) => {
    // Mock download
    alert(`Downloading ${report.name} in ${report.format.toUpperCase()} format (${report.size} bytes)`);
  };

  const deleteReport = (reportId: string) => {
    setReports(prev => prev.filter(report => report.id !== reportId));
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'generating':
        return 'text-yellow-600 bg-yellow-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'generating':
        return '⏳';
      case 'completed':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '📄';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="text-center py-8">
        <div className="text-gray-500">Loading reports...</div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reporting Module</h1>
          <p className="text-gray-500">Generate comprehensive booking and system reports</p>
        </div>
        <button
          onClick={fetchReports}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Report Generation */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Generate New Report</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-blue-600 text-sm hover:text-blue-800 transition-colors"
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Report Type Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => generateReport('daily')}
              disabled={generating}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all hover:scale-105"
            >
              <div className="text-2xl mb-1">📊</div>
              <div className="text-sm font-medium">Daily Report</div>
            </button>
            <button
              onClick={() => generateReport('weekly')}
              disabled={generating}
              className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-all hover:scale-105"
            >
              <div className="text-2xl mb-1">📈</div>
              <div className="text-sm font-medium">Weekly Report</div>
            </button>
            <button
              onClick={() => generateReport('monthly')}
              disabled={generating}
              className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-all hover:scale-105"
            >
              <div className="text-2xl mb-1">📅</div>
              <div className="text-sm font-medium">Monthly Report</div>
            </button>
            <button
              onClick={() => generateReport('utilization')}
              disabled={generating}
              className="bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-all hover:scale-105"
            >
              <div className="text-2xl mb-1">⚡</div>
              <div className="text-sm font-medium">Utilization</div>
            </button>
            <button
              onClick={() => generateReport('user_activity')}
              disabled={generating}
              className="bg-teal-600 text-white px-4 py-3 rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-all hover:scale-105"
            >
              <div className="text-2xl mb-1">👥</div>
              <div className="text-sm font-medium">User Activity</div>
            </button>
            <button
              onClick={() => generateReport('resource_performance')}
              disabled={generating}
              className="bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all hover:scale-105"
            >
              <div className="text-2xl mb-1">🏢</div>
              <div className="text-sm font-medium">Resource Performance</div>
            </button>
            <button
              onClick={() => generateReport('custom')}
              disabled={generating}
              className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-all hover:scale-105"
            >
              <div className="text-2xl mb-1">🔧</div>
              <div className="text-sm font-medium">Custom Report</div>
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t pt-4">
              <h3 className="text-md font-medium text-gray-900 mb-3">Report Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="datetime-local"
                    value={filters.startDate || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="datetime-local"
                    value={filters.endDate || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={filters.department || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Departments</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                    <option value="Medicine">Medicine</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
            <div className="text-sm text-gray-500">
              {reports.length} report{reports.length !== 1 ? 's' : ''}
            </div>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 text-lg mb-4">📄</div>
              <div className="text-gray-700 font-medium">No reports generated yet</div>
              <p className="text-gray-500 text-sm mt-2">Generate your first report using the options above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`text-2xl ${getStatusColor(report.status)} rounded-full p-2`}>
                        {getStatusIcon(report.status)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{report.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>📅 {formatDate(report.generatedAt)}</span>
                          <span>📁 {report.format.toUpperCase()}</span>
                          <span>💾 {formatFileSize(report.size)}</span>
                        </div>
                        {report.status === 'generating' && (
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                            <span className="text-sm text-blue-600">Generating report...</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => downloadReport(report)}
                        disabled={report.status !== 'completed'}
                        className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        📥 Download
                      </button>
                      <button
                        onClick={() => deleteReport(report.id)}
                        className="text-red-600 hover:text-red-800 transition-colors text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Report Status Badge */}
                  <div className="mt-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      <span className="mr-1">{getStatusIcon(report.status)}</span>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
