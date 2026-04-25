import { useState, useEffect, ReactFormEvent } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

interface Resource {
  id: number;
  name: string;
  resourceType: string;
  location: string;
  capacity?: number;
  description?: string;
  status: string;
  availableFrom?: string;
  availableTo?: string;
  available?: boolean;
}

export default function AdminResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState({
    name: '', resourceType: '', location: '', capacity: '', description: '', status: 'ACTIVE'
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await api.get('/admin/resources');
      setResources(res.data || []);
    } catch (err) {
      console.error('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity) : null
      };
      
      if (editingResource?.id) {
        await api.put(`/admin/resources/${editingResource.id}`, data);
      } else {
        await api.post('/admin/resources', data);
      }
      
      setShowModal(false);
      setEditingResource(null);
      setFormData({ name: '', resourceType: '', location: '', capacity: '', description: '', status: 'ACTIVE' });
      fetchResources();
    } catch (err) {
      console.error('Failed to save resource');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await api.delete(`/admin/resources/${id}`);
      fetchResources();
    } catch (err) {
      console.error('Failed to delete resource');
    }
  };

  const openEdit = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      name: resource.name,
      resourceType: resource.resourceType || '',
      location: resource.location,
      capacity: resource.capacity?.toString() || '',
      description: resource.description || '',
      status: resource.status || 'ACTIVE'
    });
    setShowModal(true);
  };

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>📦 Manage Resources</h1>
          <p style={{ color: '#6b7280' }}>Add, edit, or remove campus resources</p>
        </div>
        <button
          onClick={() => { setEditingResource(null); setFormData({ name: '', resourceType: '', location: '', capacity: '', description: '', status: 'ACTIVE' }); setShowModal(true); }}
          style={{ background: '#2563eb', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
        >
          ➕ Add Resource
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : resources.length === 0 ? (
        <div style={{ background: 'white', padding: '48px', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ fontSize: '48px' }}>📦</p>
          <p style={{ color: '#6b7280', marginTop: '16px' }}>No resources found</p>
          <button onClick={() => setShowModal(true)} style={{ marginTop: '16px', color: '#2563eb' }}>Add your first resource</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {resources.map(resource => (
            <div key={resource.id} style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h3 style={{ fontWeight: 'bold', fontSize: '18px' }}>{resource.name}</h3>
                  <span style={{ background: resource.status === 'ACTIVE' ? '#d1fae5' : '#fee2e2', color: resource.status === 'ACTIVE' ? '#065f46' : '#991b1b', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                    {resource.status === 'ACTIVE' ? '✓ Available' : '✕ Unavailable'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => openEdit(resource)} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>✏️</button>
                  <button onClick={() => handleDelete(resource.id)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>🗑️</button>
                </div>
              </div>
              <p style={{ color: '#6b7280', marginTop: '8px', fontSize: '14px' }}>{resource.resourceType} • {resource.location}</p>
              {resource.capacity && <p style={{ color: '#6b7280', fontSize: '14px' }}>Capacity: {resource.capacity}</p>}
              {(resource.availableFrom && resource.availableTo) && (
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Available: {resource.availableFrom} - {resource.availableTo}
                </p>
              )}
              {resource.description && <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '8px' }}>{resource.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', width: '500px', maxHeight: '90vh', overflow: 'auto' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              {editingResource ? 'Edit Resource' : 'Add New Resource'}
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Name *</label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Type *</label>
                <select value={formData.resourceType} onChange={e => setFormData({...formData, resourceType: e.target.value})} required style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}>
                  <option value="">Select type</option>
                  <option value="Lecture Hall">Lecture Hall</option>
                  <option value="Lab">Computer Lab</option>
                  <option value="Meeting Room">Meeting Room</option>
                  <option value="Auditorium">Auditorium</option>
                  <option value="Equipment">Equipment</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Location *</label>
                <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Capacity</label>
                <input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" checked={formData.status === 'ACTIVE'} onChange={e => setFormData({...formData, status: e.target.checked ? 'ACTIVE' : 'INACTIVE'})} />
                <label>Available for booking</label>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="submit" style={{ flex: 1, background: '#2563eb', color: 'white', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  {editingResource ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: '#f3f4f6', color: '#374151', padding: '12px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}