import { useState } from 'react';
import { Booking, BookingStatus } from '../types/Booking';

interface BookingExportProps {
  bookings: Booking[];
  onExport?: (format: string, data: any) => void;
}

export default function BookingExport({ bookings, onExport }: BookingExportProps) {
  const [exportFormat, setExportFormat] = useState('csv');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  const filterBookings = () => {
    return bookings.filter(booking => {
      // Status filter
      if (statusFilter !== 'all' && booking.status !== statusFilter) {
        return false;
      }

      // Date range filter
      if (dateRange.start && new Date(booking.startTime) < new Date(dateRange.start)) {
        return false;
      }
      if (dateRange.end && new Date(booking.startTime) > new Date(dateRange.end)) {
        return false;
      }

      return true;
    });
  };

  const exportToCSV = (data: Booking[]) => {
    const headers = [
      'ID', 'User Name', 'Resource Name', 'Start Time', 'End Time', 
      'Purpose', 'Expected Attendees', 'Status', 'Created At', 'Updated At'
    ];

    const csvData = data.map(booking => [
      booking.id,
      booking.userName,
      booking.resourceName,
      new Date(booking.startTime).toLocaleString(),
      new Date(booking.endTime).toLocaleString(),
      booking.purpose || '',
      booking.expectedAttendees || '',
      booking.status,
      new Date(booking.createdAt).toLocaleString(),
      new Date(booking.updatedAt).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    downloadFile(csvContent, 'bookings.csv', 'text/csv');
  };

  const exportToJSON = (data: Booking[]) => {
    const jsonData = {
      exportDate: new Date().toISOString(),
      totalBookings: data.length,
      bookings: data.map(booking => ({
        ...booking,
        startTime: new Date(booking.startTime).toISOString(),
        endTime: new Date(booking.endTime).toISOString(),
        createdAt: new Date(booking.createdAt).toISOString(),
        updatedAt: new Date(booking.updatedAt).toISOString()
      }))
    };

    const jsonContent = JSON.stringify(jsonData, null, 2);
    downloadFile(jsonContent, 'bookings.json', 'application/json');
  };

  const exportToPDF = async (data: Booking[]) => {
    // Simple text-based PDF export (would need a PDF library for real PDF generation)
    let textContent = 'BOOKING REPORT\n';
    textContent += `Generated: ${new Date().toLocaleString()}\n`;
    textContent += `Total Bookings: ${data.length}\n\n`;
    textContent += '='.repeat(80) + '\n\n';

    data.forEach((booking, index) => {
      textContent += `Booking #${index + 1}\n`;
      textContent += `ID: ${booking.id}\n`;
      textContent += `User: ${booking.userName}\n`;
      textContent += `Resource: ${booking.resourceName}\n`;
      textContent += `Start: ${new Date(booking.startTime).toLocaleString()}\n`;
      textContent += `End: ${new Date(booking.endTime).toLocaleString()}\n`;
      textContent += `Purpose: ${booking.purpose || 'N/A'}\n`;
      textContent += `Expected Attendees: ${booking.expectedAttendees || 'N/A'}\n`;
      textContent += `Status: ${booking.status}\n`;
      textContent += `Created: ${new Date(booking.createdAt).toLocaleString()}\n`;
      if (booking.rejectionReason) {
        textContent += `Rejection Reason: ${booking.rejectionReason}\n`;
      }
      textContent += '\n' + '-'.repeat(40) + '\n\n';
    });

    downloadFile(textContent, 'bookings-report.txt', 'text/plain');
  };

  const exportToExcel = (data: Booking[]) => {
    // Simple Excel-compatible CSV export
    const headers = [
      'Booking ID', 'User Name', 'User ID', 'Resource Name', 'Resource ID',
      'Start Date', 'Start Time', 'End Date', 'End Time', 'Duration (Hours)',
      'Purpose', 'Expected Attendees', 'Status', 'Rejection Reason',
      'Created Date', 'Created Time', 'Updated Date', 'Updated Time', 'Approved By'
    ];

    const excelData = data.map(booking => {
      const startDate = new Date(booking.startTime);
      const endDate = new Date(booking.endTime);
      const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60); // hours

      return [
        booking.id,
        booking.userName,
        booking.userId,
        booking.resourceName,
        booking.resourceId,
        startDate.toLocaleDateString(),
        startDate.toLocaleTimeString(),
        endDate.toLocaleDateString(),
        endDate.toLocaleTimeString(),
        duration.toFixed(2),
        booking.purpose || '',
        booking.expectedAttendees || '',
        booking.status,
        booking.rejectionReason || '',
        new Date(booking.createdAt).toLocaleDateString(),
        new Date(booking.createdAt).toLocaleTimeString(),
        new Date(booking.updatedAt).toLocaleDateString(),
        new Date(booking.updatedAt).toLocaleTimeString(),
        booking.approvedBy || ''
      ];
    });

    const csvContent = [
      headers.join(','),
      ...excelData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    downloadFile(csvContent, 'bookings-export.csv', 'text/csv');
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      const filteredBookings = filterBookings();
      
      if (filteredBookings.length === 0) {
        alert('No bookings match the selected criteria');
        return;
      }

      switch (exportFormat) {
        case 'csv':
          exportToCSV(filteredBookings);
          break;
        case 'json':
          exportToJSON(filteredBookings);
          break;
        case 'pdf':
          await exportToPDF(filteredBookings);
          break;
        case 'excel':
          exportToExcel(filteredBookings);
          break;
        default:
          exportToCSV(filteredBookings);
      }

      onExport?.(exportFormat, filteredBookings);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getExportStats = () => {
    const filtered = filterBookings();
    const stats = {
      total: filtered.length,
      approved: filtered.filter(b => b.status === BookingStatus.APPROVED).length,
      pending: filtered.filter(b => b.status === BookingStatus.PENDING).length,
      rejected: filtered.filter(b => b.status === BookingStatus.REJECTED).length,
      cancelled: filtered.filter(b => b.status === BookingStatus.CANCELLED).length,
    };
    return stats;
  };

  const stats = getExportStats();

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Export Bookings</h3>
      
      {/* Export Stats */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <div className="text-xs text-gray-600">Approved</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-xs text-gray-600">Pending</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <div className="text-xs text-gray-600">Rejected</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-600">{stats.cancelled}</div>
            <div className="text-xs text-gray-600">Cancelled</div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="space-y-4">
        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Export Format
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: 'csv', label: 'CSV', icon: '📊', desc: 'Spreadsheet compatible' },
              { value: 'json', label: 'JSON', icon: '🔧', desc: 'Data format' },
              { value: 'pdf', label: 'PDF Report', icon: '📄', desc: 'Text report' },
              { value: 'excel', label: 'Excel', icon: '📈', desc: 'Enhanced spreadsheet' }
            ].map(format => (
              <button
                key={format.value}
                onClick={() => setExportFormat(format.value)}
                className={`
                  p-3 rounded-lg border-2 transition-all
                  ${exportFormat === format.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="text-2xl mb-1">{format.icon}</div>
                <div className="text-sm font-medium">{format.label}</div>
                <div className="text-xs text-gray-500">{format.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range (Optional)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">From</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">To</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status Filter
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value={BookingStatus.APPROVED}>Approved Only</option>
            <option value={BookingStatus.PENDING}>Pending Only</option>
            <option value={BookingStatus.REJECTED}>Rejected Only</option>
            <option value={BookingStatus.CANCELLED}>Cancelled Only</option>
          </select>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={loading || stats.total === 0}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Exporting...' : `Export ${stats.total} Bookings as ${exportFormat.toUpperCase()}`}
        </button>

        {/* Help Text */}
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
          <div className="font-medium mb-1">Export Information:</div>
          <ul className="space-y-1">
            <li>• CSV format is compatible with Excel, Google Sheets, and other spreadsheet applications</li>
            <li>• JSON format includes all booking data in structured format</li>
            <li>• PDF Report generates a formatted text report</li>
            <li>• Excel format includes additional calculated fields like duration</li>
            <li>• Apply filters to export specific subsets of bookings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
