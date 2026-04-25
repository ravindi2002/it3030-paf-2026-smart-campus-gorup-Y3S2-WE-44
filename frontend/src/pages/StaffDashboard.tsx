import { useState, useEffect } from 'react';
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
  createdAt: string;
}

export default function StaffDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  
  // Also keep track of staff availability status
  const [availability, setAvailability] = useState('AVAILABLE');
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  const storedUser = localStorage.getItem('smartcampus_user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    fetchData();
    if (user?.availability) {
      setAvailability(user.availability);
    } else {
      fetchUserProfile();
    }
  }, []);

  const fetchUserProfile = async () => {
    if (!user?.id) return;
    try {
      const res = await api.get(`/users/${user.id}`);
      if (res.data && res.data.availability) {
        setAvailability(res.data.availability);
        
        // Update local storage
        const updatedUser = { ...user, availability: res.data.availability };
        localStorage.setItem('smartcampus_user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error('Failed to fetch profile', err);
    }
  };

  const fetchData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      // Use the technician endpoint which returns OPEN and IN_PROGRESS tickets
      const res = await api.get(`/tickets/technician/${user.id}`);
      setTickets(res.data || []);
    } catch (err) {
      console.error('Failed to fetch assigned tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!selectedTicket) return;
    try {
      await api.put(`/tickets/${selectedTicket.id}/resolve`, null, {
        params: { resolution: resolutionNotes }
      });
      setShowResolveModal(false);
      setResolutionNotes('');
      fetchData(); // Refresh the list
    } catch (err) {
      console.error('Failed to resolve ticket');
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

  const handleAvailabilityChange = async (newAvailability: string) => {
    if (!user?.id) return;
    setUpdatingAvailability(true);
    try {
      const userRes = await api.get(`/users/${user.id}`);
      const userData = userRes.data;
      userData.availability = newAvailability;
      
      await api.put(`/users/${user.id}`, userData);
      
      setAvailability(newAvailability);
      const updatedUser = { ...user, availability: newAvailability };
      localStorage.setItem('smartcampus_user', JSON.stringify(updatedUser));
      
    } catch (err) {
      console.error('Failed to update availability', err);
    } finally {
      setUpdatingAvailability(false);
    }
  };

  const openResolve = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setResolutionNotes('');
    setShowResolveModal(true);
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'HIGH': return '🔴';
      case 'MEDIUM': return '🟡';
      case 'LOW': return '🟢';
      default: return '⚪';
    }
  };
  
  const getAvailabilityColor = (status: string) => {
    switch(status) {
      case 'AVAILABLE': return '#10b981'; // Green
      case 'BUSY': return '#ef4444'; // Red
      case 'ON_LEAVE': return '#f59e0b'; // Orange
      case 'OFF_DUTY': return '#6b7280'; // Gray
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>👷 Staff Dashboard</h1>
          <p style={{ color: '#6b7280' }}>Manage your assigned tickets and availability</p>
        </div>
        
        {/* Availability Toggle */}
        <div style={{ background: 'white', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontWeight: 500, fontSize: '14px', color: '#374151' }}>My Status:</span>
          <select 
            value={availability} 
            onChange={(e) => handleAvailabilityChange(e.target.value)}
            disabled={updatingAvailability}
            style={{ 
              padding: '6px 12px', 
              borderRadius: '6px', 
              border: `1px solid ${getAvailabilityColor(availability)}`, 
              background: `${getAvailabilityColor(availability)}15`,
              color: getAvailabilityColor(availability),
              fontWeight: 600,
              cursor: updatingAvailability ? 'not-allowed' : 'pointer',
              outline: 'none'
            }}
          >
            <option value="AVAILABLE">🟢 Available</option>
            <option value="BUSY">🔴 Busy</option>
            <option value="ON_LEAVE">🟡 On Leave</option>
            <option value="OFF_DUTY">⚪ Off Duty</option>
          </select>
        </div>
      </div>

      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', marginTop: '32px' }}>My Active Tasks</h2>

      {loading ? (
        <p>Loading your tasks...</p>
      ) : tickets.length === 0 ? (
        <div style={{ background: 'white', padding: '48px', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ fontSize: '48px' }}>🎉</p>
          <p style={{ color: '#6b7280', marginTop: '16px', fontSize: '18px', fontWeight: 500 }}>You're all caught up!</p>
          <p style={{ color: '#9ca3af', marginTop: '4px' }}>No active tickets assigned to you right now.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {tickets.map(ticket => (
            <div key={ticket.id} style={{ 
              background: 'white', 
              padding: '20px', 
              borderRadius: '12px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              border: '1px solid #e5e7eb',
              borderLeft: `4px solid ${ticket.priority === 'HIGH' ? '#ef4444' : ticket.priority === 'MEDIUM' ? '#f59e0b' : '#10b981'}`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', background: '#f3f4f6', padding: '4px 8px', borderRadius: '4px' }}>
                  #{ticket.id}
                </span>
                <span style={{ 
                  background: ticket.status === 'OPEN' ? '#fee2e2' : '#fef3c7', 
                  color: ticket.status === 'OPEN' ? '#991b1b' : '#92400e',
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '12px', 
                  fontWeight: 600 
                }}>
                  {ticket.status}
                </span>
              </div>
              
              <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px', color: '#111827' }}>
                {getPriorityIcon(ticket.priority)} {ticket.title}
              </h3>
              
              <p style={{ color: '#4b5563', fontSize: '14px', marginBottom: '16px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {ticket.description}
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '13px', color: '#6b7280' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '16px', textAlign: 'center' }}>📍</span> 
                  <span style={{ fontWeight: 500, color: '#374151' }}>{ticket.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '16px', textAlign: 'center' }}>👤</span> 
                  <span>Reported by: {ticket.userName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '16px', textAlign: 'center' }}>📅</span> 
                  <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', paddingTop: '16px', borderTop: '1px solid #f3f4f6' }}>
                {ticket.status === 'OPEN' && (
                  <button onClick={() => handleStatusChange(ticket.id, 'IN_PROGRESS')} style={{ flex: 1, background: '#2563eb', color: 'white', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
                    ▶️ Start Work
                  </button>
                )}
                {ticket.status === 'IN_PROGRESS' && (
                  <button onClick={() => openResolve(ticket)} style={{ flex: 1, background: '#10b981', color: 'white', padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
                    ✅ Mark Resolved
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resolve Modal */}
      {showResolveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '400px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Resolve Ticket #{selectedTicket?.id}</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>{selectedTicket?.title}</p>
            
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
              Resolution Notes (Required)
            </label>
            <textarea 
              value={resolutionNotes} 
              onChange={e => setResolutionNotes(e.target.value)}
              placeholder="Explain how the issue was fixed..."
              rows={4}
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', marginBottom: '20px', resize: 'vertical' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={handleResolve} 
                disabled={!resolutionNotes.trim()} 
                style={{ 
                  flex: 1, 
                  background: resolutionNotes.trim() ? '#10b981' : '#a7f3d0', 
                  color: 'white', 
                  padding: '12px', 
                  borderRadius: '6px', 
                  border: 'none', 
                  cursor: resolutionNotes.trim() ? 'pointer' : 'not-allowed',
                  fontWeight: 500
                }}
              >
                Submit Resolution
              </button>
              <button onClick={() => setShowResolveModal(false)} style={{ flex: 1, background: '#f3f4f6', color: '#374151', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
