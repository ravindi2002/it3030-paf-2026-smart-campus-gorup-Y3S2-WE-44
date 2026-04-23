import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ resources: 0, bookings: 0, tickets: 0 });

  useEffect(() => {
    if (isAuthenticated()) {
      Promise.all([
        api.get('/resources'),
        api.get('/bookings'),
        api.get('/tickets'),
      ]).then(([resources, bookings, tickets]) => {
        setStats({
          resources: resources.data.length || 0,
          bookings: bookings.data.length || 0,
          tickets: tickets.data.length || 0,
        });
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome to Smart Campus</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <h3 className="text-gray-500 text-sm uppercase">Resources</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">{stats.resources}</p>
          <Link to="/resources" className="text-blue-500 text-sm mt-2 inline-block hover:underline">
            View all →
          </Link>
        </div>

        <div className="card text-center">
          <h3 className="text-gray-500 text-sm uppercase">Bookings</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">{stats.bookings}</p>
          <Link to="/bookings" className="text-blue-500 text-sm mt-2 inline-block hover:underline">
            View all →
          </Link>
        </div>

        <div className="card text-center">
          <h3 className="text-gray-500 text-sm uppercase">Tickets</h3>
          <p className="text-4xl font-bold text-orange-600 mt-2">{stats.tickets}</p>
          <Link to="/tickets" className="text-blue-500 text-sm mt-2 inline-block hover:underline">
            View all →
          </Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/tickets/create"
              className="flex items-center gap-3 p-3 bg-red-50 rounded-lg hover:bg-red-100 transition"
            >
              <span className="text-2xl">🚨</span>
              <span>Report an Issue</span>
            </Link>
            <Link
              to="/bookings/create"
              className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition"
            >
              <span className="text-2xl">📅</span>
              <span>Book a Resource</span>
            </Link>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <p className="text-gray-500 text-sm">No recent activity</p>
        </div>
      </div>
    </div>
  );
}