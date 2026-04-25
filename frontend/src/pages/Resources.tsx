import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';

interface Resource {
  id: number;
  name: string;
  description: string;
  location: string;
  resourceType: string;
  status: string;
  capacity: number;
  availableFrom?: string;
  availableTo?: string;
  imageUrl: string;
}

const ACTIVE = 'ACTIVE';
const OUT_OF_SERVICE = 'OUT_OF_SERVICE';

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCapacity, setSearchCapacity] = useState('');
  const { isAdmin } = useAuth();

  const canManage = isAdmin();

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchName) params.append('name', searchName);
      if (searchType) params.append('type', searchType);
      if (searchLocation) params.append('location', searchLocation);
      if (searchCapacity) params.append('capacity', searchCapacity);
      
      const query = params.toString();
      const url = query ? `/admin/resources/search?${query}` : '/admin/resources';
      const res = await api.get(url);
      setResources(res.data);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await api.delete(`/admin/resources/${id}`);
      fetchResources();
    } catch (error) {
      console.error('Failed to delete resource:', error);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    const newStatus = status === ACTIVE ? OUT_OF_SERVICE : ACTIVE;
    try {
      await api.patch(`/admin/resources/${id}/status?status=${newStatus}`);
      fetchResources();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    return status === ACTIVE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-6">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
        ← Back to Home
      </Link>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resources</h1>
        {canManage && (
          <Link to="/resources/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Resource
          </Link>
        )}
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by name..."
            className="border p-2 rounded"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <select
            className="border p-2 rounded"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="LECTURE_HALL">Lecture Hall</option>
            <option value="LAB">Lab</option>
            <option value="MEETING_ROOM">Meeting Room</option>
            <option value="EQUIPMENT">Equipment</option>
            <option value="SPORTS">Sports Facility</option>
            <option value="LIBRARY">Library</option>
            <option value="AUDITORIUM">Auditorium</option>
          </select>
          <input
            type="text"
            placeholder="Location..."
            className="border p-2 rounded"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
          <input
            type="number"
            placeholder="Min Capacity..."
            className="border p-2 rounded"
            value={searchCapacity}
            onChange={(e) => setSearchCapacity(e.target.value)}
          />
        </div>
        <button
          onClick={fetchResources}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : resources.length === 0 ? (
        <p className="text-gray-500">No resources found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resources.map((r) => (
            <div key={r.id} className="bg-white p-4 rounded-lg shadow">
              {r.imageUrl && (
                <img src={r.imageUrl} alt={r.name} className="w-full h-40 object-cover rounded mb-4" />
              )}
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{r.name}</h3>
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor(r.status)}`}>
                  {r.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">{r.resourceType}</p>
              <p className="text-gray-600 text-sm mb-1">📍 {r.location}</p>
              <p className="text-gray-600 text-sm mb-1">👥 Capacity: {r.capacity}</p>
              {(r.availableFrom && r.availableTo) && (
                <p className="text-gray-600 text-sm mb-1">
                  🕒 Available: {r.availableFrom} - {r.availableTo}
                </p>
              )}
              {r.description && <p className="text-gray-500 text-sm mt-2">{r.description}</p>}
              
              {canManage && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleStatusChange(r.id, r.status)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    {r.status === ACTIVE ? 'Mark Out of Service' : 'Mark Active'}
                  </button>
                  <Link
                    to={`/resources/edit/${r.id}`}
                    className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}