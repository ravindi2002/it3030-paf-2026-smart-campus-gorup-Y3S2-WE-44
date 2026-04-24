import { useState, useEffect } from 'react';

interface Ticket {
  id: number;
  title: string;
  description: string;
  type: 'incident' | 'maintenance' | 'request' | 'complaint' | 'suggestion';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed' | 'cancelled';
  category: 'facility' | 'equipment' | 'booking' | 'access' | 'other';
  userId: number;
  userName: string;
  userEmail: string;
  location?: string;
  resource?: string;
  assignedTo?: number;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolution?: string;
  attachments?: string[];
  tags?: string[];
}

interface TicketsIncidentProps {
  userId?: number;
  isAdmin?: boolean;
}

export default function TicketsIncident({ userId = 1, isAdmin = false }: TicketsIncidentProps) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
    const [formData, setFormData] = useState<Partial<Ticket>>({});

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock tickets data
      const mockTickets: Ticket[] = [
        {
          id: 1,
          title: 'Projector not working in Lecture Hall A',
          description: 'The main projector in Lecture Hall A is not turning on. Tried multiple times but no response.',
          type: 'incident',
          priority: 'high',
          status: 'in_progress',
          category: 'equipment',
          userId: 1,
          userName: 'John Doe',
          userEmail: 'john.doe@campus.edu',
          location: 'Lecture Hall A',
          resource: 'Projector',
          assignedTo: 2,
          assignedToName: 'IT Support Team',
          createdAt: '2024-04-20T09:00:00Z',
          updatedAt: '2024-04-20T14:30:00Z',
          tags: ['urgent', 'equipment', 'lecture-hall']
        },
        {
          id: 2,
          title: 'Air conditioning not working in Computer Lab 101',
          description: 'The AC unit has been malfunctioning for the past 2 days. Room temperature is getting too hot.',
          type: 'maintenance',
          priority: 'medium',
          status: 'open',
          category: 'facility',
          userId: 2,
          userName: 'Jane Smith',
          userEmail: 'jane.smith@campus.edu',
          location: 'Computer Lab 101',
          createdAt: '2024-04-19T10:00:00Z',
          updatedAt: '2024-04-19T10:00:00Z',
          tags: ['maintenance', 'facility', 'ac']
        },
        {
          id: 3,
          title: 'Booking system access issue',
          description: 'Unable to access the booking system from my mobile device. Getting authentication error.',
          type: 'incident',
          priority: 'medium',
          status: 'resolved',
          category: 'access',
          userId: 3,
          userName: 'Mike Johnson',
          userEmail: 'mike.johnson@campus.edu',
          assignedTo: 4,
          assignedToName: 'System Admin',
          createdAt: '2024-04-18T15:00:00Z',
          updatedAt: '2024-04-19T09:00:00Z',
          resolvedAt: '2024-04-19T09:30:00Z',
          resolution: 'Fixed authentication token issue. User can now access the system from mobile.',
          tags: ['access', 'mobile', 'authentication']
        },
        {
          id: 4,
          title: 'Request for additional whiteboards',
          description: 'Meeting Room B needs additional whiteboards for group discussions.',
          type: 'request',
          priority: 'low',
          status: 'open',
          category: 'facility',
          userId: 4,
          userName: 'Sarah Wilson',
          userEmail: 'sarah.wilson@campus.edu',
          location: 'Meeting Room B',
          createdAt: '2024-04-17T11:00:00Z',
          updatedAt: '2024-04-17T11:00:00Z',
          tags: ['request', 'facility', 'equipment']
        },
        {
          id: 5,
          title: 'Noise complaint from Study Room 201',
          description: 'Students making excessive noise in designated quiet study area.',
          type: 'complaint',
          priority: 'medium',
          status: 'in_progress',
          category: 'other',
          userId: 5,
          userName: 'Campus Security',
          userEmail: 'security@campus.edu',
          location: 'Study Room 201',
          assignedTo: 6,
          assignedToName: 'Facility Management',
          createdAt: '2024-04-16T16:00:00Z',
          updatedAt: '2024-04-16T16:30:00Z',
          tags: ['complaint', 'noise', 'study-room']
        }
      ];
      
      setTickets(mockTickets);
    } catch (err) {
      setError('Failed to fetch tickets');
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTickets = () => {
    return tickets.filter(ticket => {
      const matchesSearch = !filter || 
        ticket.title.toLowerCase().includes(filter.toLowerCase()) ||
        ticket.description.toLowerCase().includes(filter.toLowerCase()) ||
        ticket.userName.toLowerCase().includes(filter.toLowerCase()) ||
        ticket.location?.toLowerCase().includes(filter.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
      const matchesType = typeFilter === 'all' || ticket.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesType;
    });
  };

  const handleCreateTicket = () => {
    const newTicket: Ticket = {
      id: Date.now(),
      title: formData.title || '',
      description: formData.description || '',
      type: formData.type || 'incident',
      priority: formData.priority || 'medium',
      status: 'open',
      category: formData.category || 'other',
      userId: userId,
      userName: 'Current User',
      userEmail: 'user@campus.edu',
      location: formData.location,
      resource: formData.resource,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: formData.tags || []
    };
    
    setTickets(prev => [newTicket, ...prev]);
    setShowCreateModal(false);
    setFormData({});
  };

  const handleUpdateTicket = (ticketId: number, updates: Partial<Ticket>) => {
    setTickets(prev => 
      prev.map(ticket => 
        ticket.id === ticketId 
          ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
          : ticket
      )
    );
  };

  const handleResolveTicket = (ticketId: number, resolution: string) => {
    handleUpdateTicket(ticketId, {
      status: 'resolved',
      resolvedAt: new Date().toISOString(),
      resolution
    });
  };

  const handleAssignTicket = (ticketId: number, assignedTo: number, assignedToName: string) => {
    handleUpdateTicket(ticketId, {
      assignedTo,
      assignedToName,
      status: 'in_progress'
    });
  };

  const getTypeIcon = (type: Ticket['type']) => {
    switch (type) {
      case 'incident':
        return '⚠️';
      case 'maintenance':
        return '🔧';
      case 'request':
        return '📝';
      case 'complaint':
        return '😞';
      case 'suggestion':
        return '💡';
      default:
        return '📋';
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-100 border-green-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return 'text-blue-600 bg-blue-100';
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-100';
      case 'resolved':
        return 'text-green-600 bg-green-100';
      case 'closed':
        return 'text-gray-600 bg-gray-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  
  const filteredTickets = getFilteredTickets();

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading tickets...</div>
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
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets & Incidents</h1>
          <p className="text-gray-500">Manage campus support tickets and incidents</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            ➕ Create Ticket
          </button>
          <button
            onClick={fetchTickets}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search tickets..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="incident">Incident</option>
              <option value="maintenance">Maintenance</option>
              <option value="request">Request</option>
              <option value="complaint">Complaint</option>
              <option value="suggestion">Suggestion</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredTickets.length} of {tickets.length} tickets
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-500 text-lg mb-4">📋</div>
            <div className="text-gray-700 font-medium">No tickets found</div>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or create a new ticket</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Ticket Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {getTypeIcon(ticket.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>👤 {ticket.userName}</span>
                        <span>📍 {ticket.location || 'N/A'}</span>
                        <span>📅 {new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="mb-4">
                  <p className="text-gray-700 mb-3">{ticket.description}</p>
                  
                  {ticket.tags && ticket.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {ticket.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {ticket.assignedToName && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Assigned to:</span> {ticket.assignedToName}
                    </div>
                  )}

                  {ticket.resolution && (
                    <div className="text-sm text-green-600 bg-green-50 p-3 rounded">
                      <span className="font-medium">Resolution:</span> {ticket.resolution}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-xs text-gray-500">
                    Created: {new Date(ticket.createdAt).toLocaleString()}
                    {ticket.updatedAt !== ticket.createdAt && (
                      <span> • Updated: {new Date(ticket.updatedAt).toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      👁️ View
                    </button>
                    {isAdmin && ticket.status === 'open' && (
                      <button
                        onClick={() => handleAssignTicket(ticket.id, 99, 'Support Team')}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        👥 Assign
                      </button>
                    )}
                    {isAdmin && ticket.status !== 'resolved' && ticket.status !== 'closed' && (
                      <button
                        onClick={() => handleResolveTicket(ticket.id, 'Issue resolved by support team')}
                        className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
                      >
                        ✅ Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ticket Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {tickets.filter(t => t.status === 'open').length}
            </div>
            <div className="text-sm text-gray-600">Open</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {tickets.filter(t => t.status === 'in_progress').length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {tickets.filter(t => t.status === 'resolved').length}
            </div>
            <div className="text-sm text-gray-600">Resolved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {tickets.filter(t => t.priority === 'critical').length}
            </div>
            <div className="text-sm text-gray-600">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((tickets.filter(t => t.status === 'resolved').length / tickets.length) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Resolution Rate</div>
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Create New Ticket</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={4}
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={formData.type || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="incident">Incident</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="request">Request</option>
                      <option value="complaint">Complaint</option>
                      <option value="suggestion">Suggestion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={formData.priority || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="facility">Facility</option>
                      <option value="equipment">Equipment</option>
                      <option value="booking">Booking</option>
                      <option value="access">Access</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({});
                  }}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTicket}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Create Ticket
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
