import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import StatusBadge from '../components/StatusBadge';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalTickets: 0, openTickets: 0, resolvedTickets: 0, totalResources: 0, availableResources: 0 });
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, ticketsRes, resourcesRes] = await Promise.all([api.get('/admin/users'), api.get('/admin/tickets'), api.get('/admin/resources')]);
      const tickets = ticketsRes.data;
      const resources = resourcesRes.data;
      setStats({ totalUsers: usersRes.data.length, totalTickets: tickets.length, openTickets: tickets.filter((t: any) => t.status === 'OPEN').length, resolvedTickets: tickets.filter((t: any) => t.status === 'RESOLVED').length, totalResources: resources.length, availableResources: resources.filter((r: any) => r.status === 'AVAILABLE').length });
      setRecentTickets(tickets.slice(0, 5));
      setRecentUsers(usersRes.data.slice(0, 5));
    } catch (error) { console.error('Failed to fetch data:', error); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div><h1 className="text-2xl font-bold">Admin Dashboard</h1><p className="text-gray-500">Manage your campus system</p></div>
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm font-medium">Welcome, {user?.fullName || user?.username}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link to="/admin/users" className="bg-white p-6 rounded-lg shadow hover:shadow-lg hover:scale-105 cursor-pointer"><p className="text-gray-500 text-sm">Total Users</p><p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p></Link>
        <Link to="/admin/tickets" className="bg-white p-6 rounded-lg shadow hover:shadow-lg hover:scale-105 cursor-pointer"><p className="text-gray-500 text-sm">Total Tickets</p><p className="text-3xl font-bold text-purple-600">{stats.totalTickets}</p></Link>
        <div className="bg-white p-6 rounded-lg shadow"><p className="text-gray-500 text-sm">Open Tickets</p><p className="text-3xl font-bold text-orange-600">{stats.openTickets}</p></div>
        <div className="bg-white p-6 rounded-lg shadow"><p className="text-gray-500 text-sm">Resolved</p><p className="text-3xl font-bold text-green-600">{stats.resolvedTickets}</p></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link to="/resources" className="bg-white p-6 rounded-lg shadow hover:shadow-lg hover:scale-105 cursor-pointer"><p className="text-gray-500 text-sm">Total Resources</p><p className="text-3xl font-bold text-teal-600">{stats.totalResources}</p></Link>
        <div className="bg-white p-6 rounded-lg shadow"><p className="text-gray-500 text-sm">Available</p><p className="text-3xl font-bold text-green-600">{stats.availableResources}</p></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center"><h2 className="font-semibold">Recent Tickets</h2><Link to="/admin/tickets" className="text-blue-600 text-sm hover:underline">View All</Link></div>
          <div className="p-4">{recentTickets.length === 0 ? <p className="text-gray-500 text-sm">No tickets yet</p> : recentTickets.map(ticket => <Link key={ticket.id} to={`/tickets/${ticket.id}`} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"><div><p className="font-medium text-sm">{ticket.title}</p><p className="text-xs text-gray-500">{ticket.userName} • {ticket.category}</p></div><StatusBadge status={ticket.status} /></Link>)}</div>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center"><h2 className="font-semibold">Recent Users</h2><Link to="/admin/users" className="text-blue-600 text-sm hover:underline">View All</Link></div>
          <div className="p-4">{recentUsers.length === 0 ? <p className="text-gray-500 text-sm">No users yet</p> : recentUsers.map(u => <div key={u.id} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"><div><p className="font-medium text-sm">{u.username}</p><p className="text-xs text-gray-500">{u.email}</p></div><span className={`text-xs px-2 py-1 rounded ${u.role === 'ADMIN' ? 'bg-red-100 text-red-800' : u.role === 'TECHNICIAN' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{u.role}</span></div>)}</div>
        </div>
      </div>
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <h2 className="font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/tickets/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Create Ticket</Link>
          <Link to="/admin/tickets" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition">Manage Tickets</Link>
          <Link to="/admin/users" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">Manage Users</Link>
          <Link to="/resources" className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition">Manage Resources</Link>
        </div>
      </div>
    </div>
  );
}