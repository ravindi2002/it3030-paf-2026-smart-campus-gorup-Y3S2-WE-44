import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  location: string;
  userName: string;
  assignedToName?: string;
  createdAt: string;
  resolutionNotes?: string;
}

interface User {
  id: number;
  username: string;
  fullName?: string;
  email?: string;
  role: string;
  availability?: string;
}

export default function AdminManageTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<number | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showResolveModal, setShowResolveModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filter !== 'all') params.status = filter;
      
      const [ticketsRes, usersRes] = await Promise.all([
        api.get('/tickets', { params }),
        api.get('/users/all')
      ]);
      
      setTickets(ticketsRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedTicket || !selectedTechnician) return;
    try {
      await api.put(`/tickets/${selectedTicket.id}/assign`, null, {
        params: { technicianId: selectedTechnician }
      });
      setShowAssignModal(false);
      fetchData();
    } catch (err) {
      console.error('Failed to assign ticket');
    }
  };

  const handleStatusChange = async (ticketId: number, newStatus: string) => {
    try {
      await api.put(`/tickets/${ticketId}/status`, null, {
        params: { status: newStatus }
      });
      fetchData();
    } catch (err) {
      console.error('Failed to update status');
    }
  };

  const handleResolve = async () => {
    if (!selectedTicket) return;
    try {
      await api.put(`/tickets/${selectedTicket.id}/resolve`, null, {
        params: { resolutionNotes }
      });
      setShowResolveModal(false);
      setResolutionNotes('');
      fetchData();
    } catch (err) {
      console.error('Failed to resolve ticket');
    }
  };

  const openAssign = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setSelectedTechnician(null);
    setShowAssignModal(true);
  };

  const openResolve = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setResolutionNotes('');
    setShowResolveModal(true);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'OPEN': return '#fee2e2';
      case 'IN_PROGRESS': return '#fef3c7';
      case 'RESOLVED': return '#d1fae5';
      case 'CLOSED': return '#e5e7eb';
      case 'REJECTED': return '#fee2e2';
      default: return '#f3f4f6';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'HIGH': return '🔴';
      case 'MEDIUM': return '🟡';
      case 'LOW': return '🟢';
      default: return '⚪';
    }
  };

  const technicians = users.filter(u => u.role === 'TECHNICIAN');

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>🎫 Manage Tickets</h1>
        <p style={{ color: '#6b7280' }}>View and manage all reported tickets</p>
      </div>

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input 
          type="text" 
          placeholder="Search by ticket ID, title, or user..." 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #d1d5db', width: '300px' }}
        />
        
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {['all', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: filter === status ? '#2563eb' : '#f3f4f6',
              color: filter === status ? 'white' : '#374151',
              fontWeight: 500
            }}
          >
            {status === 'all' ? '📋 All' : status}
          </button>
        ))}
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : tickets.length === 0 ? (
        <div style={{ background: 'white', padding: '48px', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ fontSize: '48px' }}>🎫</p>
          <p style={{ color: '#6b7280' }}>No tickets found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tickets.filter(t => 
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            t.id.toString().includes(searchQuery) ||
            t.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase())
          ).map(ticket => (
            <div key={ticket.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>#{ticket.id}</span>
                    <span>{getPriorityIcon(ticket.priority)}</span>
                    <span style={{ background: getStatusColor(ticket.status), padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>
                      {ticket.status}
                    </span>
                  </div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginTop: '8px' }}>{ticket.title}</h3>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>{ticket.description}</p>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '14px', color: '#9ca3af' }}>
                    <span>📧 {ticket.userName}</span>
                    <span>📍 {ticket.location}</span>
                    <span>📅 {new Date(ticket.createdAt).toLocaleDateString()}</span>
                    {ticket.assignedToName && <span>👷 {ticket.assignedToName}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {ticket.status === 'OPEN' && (
                    <button onClick={() => openAssign(ticket)} style={{ background: '#2563eb', color: 'white', padding: '8px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                      👷 Assign
                    </button>
                  )}
                  {ticket.status === 'IN_PROGRESS' && (
                    <button onClick={() => openResolve(ticket)} style={{ background: '#10b981', color: 'white', padding: '8px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                      ✓ Resolve
                    </button>
                  )}
                  {ticket.status === 'RESOLVED' && (
                    <button onClick={() => handleStatusChange(ticket.id, 'CLOSED')} style={{ background: '#6b7280', color: 'white', padding: '8px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                      Close Ticket
                    </button>
                  )}
                  {ticket.status !== 'CLOSED' && ticket.status !== 'RESOLVED' && ticket.status !== 'REJECTED' && (
                    <button onClick={() => handleStatusChange(ticket.id, 'REJECTED')} style={{ background: '#dc2626', color: 'white', padding: '8px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                      Reject
                    </button>
                  )}
                </div>
              </div>
              {ticket.resolutionNotes && (
                <div style={{ marginTop: '12px', padding: '12px', background: '#d1fae5', borderRadius: '6px' }}>
                  <strong>Resolution:</strong> {ticket.resolutionNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '400px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Assign Technician</h2>
            <select 
              value={selectedTechnician || ''} 
              onChange={e => setSelectedTechnician(parseInt(e.target.value))}
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', marginBottom: '16px' }}
            >
              <option value="">Select technician</option>
              {technicians.map(t => {
                const getAvailabilityEmoji = (status?: string) => {
                  switch(status) {
                    case 'AVAILABLE': return '🟢';
                    case 'BUSY': return '🔴';
                    case 'ON_LEAVE': return '🟡';
                    case 'OFF_DUTY': return '⚪';
                    default: return '❓';
                  }
                };
                
                return (
                  <option key={t.id} value={t.id}>
                    {getAvailabilityEmoji(t.availability)} {t.username} ({t.fullName}) - {t.availability || 'UNKNOWN'}
                  </option>
                );
              })}
            </select>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleAssign} disabled={!selectedTechnician} style={{ flex: 1, background: '#2563eb', color: 'white', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                Assign
              </button>
              <button onClick={() => setShowAssignModal(false)} style={{ flex: 1, background: '#f3f4f6', color: '#374151', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Modal */}
      {showResolveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '400px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Resolve Ticket</h2>
            <textarea 
              value={resolutionNotes} 
              onChange={e => setResolutionNotes(e.target.value)}
              placeholder="Enter resolution notes..."
              rows={4}
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleResolve} disabled={!resolutionNotes} style={{ flex: 1, background: '#10b981', color: 'white', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                Mark Resolved
              </button>
              <button onClick={() => setShowResolveModal(false)} style={{ flex: 1, background: '#f3f4f6', color: '#374151', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}