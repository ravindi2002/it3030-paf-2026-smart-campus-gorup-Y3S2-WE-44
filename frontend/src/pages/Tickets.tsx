import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';

export default function Tickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchTickets();
  }, [filter, user]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params: any = {};
      
      if (filter !== 'all') {
        params.status = filter;
      }
      
      // Filter by current user if logged in
      if (user?.id) {
        params.userId = user.id;
      }
      
      const response = await api.get('/tickets', { params });
      setTickets(response.data || []);
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'OPEN': return { emoji: '🔴', color: 'bg-red-100 text-red-800', label: 'OPEN' };
      case 'IN_PROGRESS': return { emoji: '🟡', color: 'bg-yellow-100 text-yellow-800', label: 'IN PROGRESS' };
      case 'RESOLVED': return { emoji: '🟢', color: 'bg-green-100 text-green-800', label: 'RESOLVED' };
      case 'CLOSED': return { emoji: '⚫', color: 'bg-gray-100 text-gray-800', label: 'CLOSED' };
      case 'REJECTED': return { emoji: '❌', color: 'bg-red-100 text-red-800', label: 'REJECTED' };
      default: return { emoji: '⚪', color: 'bg-gray-100 text-gray-800', label: status };
    }
  };

  const getPriorityDisplay = (priority: string) => {
    switch (priority) {
      case 'HIGH': return '🔴';
      case 'MEDIUM': return '🟡';
      case 'LOW': return '🟢';
      default: return '⚪';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <div className="text-gray-500">Loading tickets...</div>
      </div>
    );
  }

  return (
    <Layout>
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🎫 Tickets</h1>
          <p className="text-gray-500">View and manage incident tickets</p>
        </div>
        <Link
          to="/tickets/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          + Report Issue
        </Link>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              filter === status 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? '📋 All' : status}
          </button>
        ))}
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-4xl mb-4">🎫</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
          <p className="text-gray-500 mb-4">Create a ticket to report an issue</p>
          <Link to="/tickets/create" className="text-blue-600 hover:underline">
            Report Issue →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => {
            const statusDisplay = getStatusDisplay(ticket.status);
            return (
              <Link
                key={ticket.id}
                to={`/tickets/${ticket.id}`}
                className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-500">#{ticket.id}</span>
                        <span>{getPriorityDisplay(ticket.priority)}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusDisplay.color}`}>
                          {statusDisplay.emoji} {statusDisplay.label}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{ticket.title}</h3>
                    </div>
                    {ticket.category && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {ticket.category}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {ticket.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      {ticket.userName && <span>👤 {ticket.userName}</span>}
                      {ticket.assignedToName && <span>👷 {ticket.assignedToName}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {ticket.comments?.length > 0 && <span>💬 {ticket.comments.length}</span>}
                      {ticket.resolutionNotes && <span>✓ Resolved</span>}
                      <span>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : ''}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
    </Layout>
  );
}