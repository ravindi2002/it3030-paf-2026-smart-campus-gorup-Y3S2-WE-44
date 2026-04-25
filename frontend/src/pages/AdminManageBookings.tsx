import { useState, useEffect } from 'react';
import api from '../utils/api';

interface Booking {
  id: number;
  resourceName: string;
  userName: string;
  userEmail?: string;
  startTime: string;
  endTime: string;
  status: string;
  purpose?: string;
}

export default function AdminManageBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [filter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filter !== 'all') params.status = filter;
      
      const res = await api.get('/admin/bookings', { params });
      setBookings(res.data || []);
    } catch (err) {
      console.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await api.put(`/admin/bookings/${id}/approve`);
      fetchBookings();
    } catch (err) {
      console.error('Failed to approve booking');
    }
  };

  const handleReject = async () => {
    if (!selectedBooking || !rejectReason) return;
    try {
      await api.put(`/admin/bookings/${selectedBooking.id}/reject`, null, {
        params: { reason: rejectReason }
      });
      setShowModal(false);
      setRejectReason('');
      fetchBookings();
    } catch (err) {
      console.error('Failed to reject booking');
    }
  };

  const openRejectModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setRejectReason('');
    setShowModal(true);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'APPROVED': return '#d1fae5';
      case 'PENDING': return '#fef3c7';
      case 'REJECTED': return '#fee2e2';
      case 'CANCELLED': return '#e5e7eb';
      default: return '#f3f4f6';
    }
  };

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>📅 Manage Bookings</h1>
        <p style={{ color: '#6b7280' }}>Review, approve, or reject booking requests</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['all', 'PENDING', 'APPROVED', 'REJECTED'].map(status => (
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

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <div style={{ background: 'white', padding: '48px', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ fontSize: '48px' }}>📅</p>
          <p style={{ color: '#6b7280' }}>No bookings found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {bookings.map(booking => (
            <div key={booking.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>#{booking.id}</span>
                    <span style={{ background: getStatusColor(booking.status), padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>
                      {booking.status}
                    </span>
                  </div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '18px', marginTop: '8px' }}>{booking.resourceName}</h3>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '14px', color: '#9ca3af' }}>
                    <span>👤 {booking.userName}</span>
                    {booking.userEmail && <span>📧 {booking.userEmail}</span>}
                    <span>🕐 {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}</span>
                  </div>
                  {booking.purpose && (
                    <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '8px' }}>Purpose: {booking.purpose}</p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {booking.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleApprove(booking.id)} style={{ background: '#10b981', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                        ✓ Approve
                      </button>
                      <button onClick={() => openRejectModal(booking)} style={{ background: '#dc2626', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                        ✕ Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '400px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Reject Booking</h2>
            <p style={{ marginBottom: '16px', color: '#6b7280' }}>Please provide a reason for rejection:</p>
            <textarea 
              value={rejectReason} 
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              rows={4}
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleReject} disabled={!rejectReason} style={{ flex: 1, background: '#dc2626', color: 'white', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                Reject Booking
              </button>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, background: '#f3f4f6', color: '#374151', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}