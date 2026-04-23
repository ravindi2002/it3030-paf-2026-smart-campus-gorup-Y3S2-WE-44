import { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { Booking, BookingStatus } from '../types/Booking';

interface Report {
  id: string;
  name: string;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  generatedAt: string;
  data: any;
  format: 'pdf' | 'excel' | 'csv';
}

export default function ReportingModule() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

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
          generatedAt: new Date().toISOString(),
          data: { totalBookings: 25, approved: 20, pending: 5 },
          format: 'pdf'
        }
      ];
      setReports(mockReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async (type: string) => {
    setGenerating(true);
    try {
      // Mock report generation
      const newReport: Report = {
        id: Date.now().toString(),
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
        type: type as any,
        generatedAt: new Date().toISOString(),
        data: { summary: 'Generated report data' },
        format: 'pdf'
      };
      setReports(prev => [newReport, ...prev]);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading reports...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Reporting Module</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Generate New Report</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => generateReport('daily')}
            disabled={generating}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Daily Report
          </button>
          <button
            onClick={() => generateReport('weekly')}
            disabled={generating}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            Weekly Report
          </button>
          <button
            onClick={() => generateReport('monthly')}
            disabled={generating}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            Monthly Report
          </button>
          <button
            onClick={() => generateReport('custom')}
            disabled={generating}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 disabled:opacity-50"
          >
            Custom Report
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Reports</h2>
        {reports.length === 0 ? (
          <p className="text-gray-500">No reports generated yet</p>
        ) : (
          <div className="space-y-4">
            {reports.map(report => (
              <div key={report.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{report.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(report.generatedAt).toLocaleString()} • {report.format.toUpperCase()}
                    </p>
                  </div>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
