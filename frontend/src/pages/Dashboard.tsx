import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resourceService } from '../services/resourceService';
import { bookingService } from '../services/bookingService';
import { ticketService } from '../services/ticketService';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ resources: 0, bookings: 0, tickets: 0 });

  useEffect(() => {
    if (isAuthenticated()) {
      Promise.all([
        resourceService.getAll(),
        bookingService.getAll(),
        ticketService.getAll(),
      ]).then(([resources, bookings, tickets]) => {
        setStats({
          resources: resources.length,
          bookings: bookings.length,
          tickets: tickets.length,
        });
      });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated()) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Smart Campus</h1>
        <p className="mb-4">Manage campus resources, bookings, and incident tickets in one place.</p>
        <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded">
          Get Started
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Resources</h3>
          <p className="text-3xl font-bold">{stats.resources}</p>
          <Link to="/resources" className="text-blue-600 text-sm hover:underline">View all</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Bookings</h3>
          <p className="text-3xl font-bold">{stats.bookings}</p>
          <Link to="/bookings" className="text-blue-600 text-sm hover:underline">View all</Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Tickets</h3>
          <p className="text-3xl font-bold">{stats.tickets}</p>
          <Link to="/tickets" className="text-blue-600 text-sm hover:underline">View all</Link>
        </div>
      </div>
    </div>
  );
}