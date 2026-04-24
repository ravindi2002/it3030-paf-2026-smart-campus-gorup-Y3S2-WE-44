import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { Resource } from '../types/Resource';

export default function EditResource() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState<Resource>({
    name: '',
    description: '',
    location: '',
    resourceType: '',
    capacity: undefined,
    status: 'ACTIVE'
  });

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await api.get(`/admin/resources/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching resource:', error);
        alert('Failed to fetch resource');
        navigate('/admin/resources');
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchResource();
    }
  }, [id, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? (value ? parseInt(value) : undefined) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Updating resource with data:', formData);
      const response = await api.put(`/admin/resources/${id}/test`, formData);
      console.log('Resource updated successfully:', response.data);
      navigate('/resources');
    } catch (error: any) {
      console.error('Error updating resource:', error);
      console.error('Error details:', error.response?.data);
      alert(`Failed to update resource: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <p>Loading resource...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Resource</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resource Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resource Type
            </label>
            <select
              name="resourceType"
              value={formData.resourceType || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Type</option>
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="LAB">Lab</option>
              <option value="MEETING_ROOM">Meeting Room</option>
              <option value="EQUIPMENT">Equipment (Projectors, Cameras, etc.)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacity
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity || ''}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={formData.status === 'OUT_OF_SERVICE'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Resource'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/resources')}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
