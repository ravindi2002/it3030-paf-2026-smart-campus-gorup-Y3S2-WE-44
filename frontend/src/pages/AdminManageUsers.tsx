import { useState, useEffect } from 'react';
import api from '../utils/api';

interface User {
  id: number;
  username: string;
  fullName?: string;
  email?: string;
  role: string;
  enabled?: boolean;
}

export default function AdminManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState('USER');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!selectedUser) return;
    try {
      await api.put(`/admin/users/${selectedUser.id}/role`, null, {
        params: { role: newRole }
      });
      setShowRoleModal(false);
      fetchUsers();
    } catch (err) {
      console.error('Failed to update role');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user');
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      await api.put(`/admin/users/${user.id}/toggle`, null, {
        params: { enabled: !user.enabled }
      });
      fetchUsers();
    } catch (err) {
      console.error('Failed to toggle status');
    }
  };

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'ADMIN': return '#7c3aed';
      case 'TECHNICIAN': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>👥 Manage Users</h1>
        <p style={{ color: '#6b7280' }}>View and manage all registered users</p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <div style={{ background: 'white', padding: '48px', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ fontSize: '48px' }}>👥</p>
          <p style={{ color: '#6b7280' }}>No users found</p>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Username</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Full Name</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Email</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Role</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px 16px' }}>{user.username}</td>
                  <td style={{ padding: '12px 16px' }}>{user.fullName || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>{user.email || '-'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <button 
                      onClick={() => openRoleModal(user)}
                      style={{ 
                        background: getRoleColor(user.role), 
                        color: 'white', 
                        padding: '4px 12px', 
                        borderRadius: '4px', 
                        border: 'none', 
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 600
                      }}
                    >
                      {user.role}
                    </button>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button 
                      onClick={() => handleToggleStatus(user)}
                      style={{ 
                        background: user.enabled ? '#d1fae5' : '#fee2e2', 
                        color: user.enabled ? '#065f46' : '#991b1b', 
                        padding: '4px 12px', 
                        borderRadius: '4px', 
                        border: 'none', 
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {user.enabled ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
                      title="Delete user"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Role Modal */}
      {showRoleModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '400px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>Change Role</h2>
            <p style={{ marginBottom: '16px', color: '#6b7280' }}>Select new role for {selectedUser?.username}</p>
            <select 
              value={newRole} 
              onChange={e => setNewRole(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db', marginBottom: '16px' }}
            >
              <option value="USER">User (Student/Staff)</option>
              <option value="TECHNICIAN">Technician</option>
              <option value="ADMIN">Admin</option>
            </select>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleRoleChange} style={{ flex: 1, background: '#2563eb', color: 'white', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                Update Role
              </button>
              <button onClick={() => setShowRoleModal(false)} style={{ flex: 1, background: '#f3f4f6', color: '#374151', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}