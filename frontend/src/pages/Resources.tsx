import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Resource } from '../types/Resource';
import { useAuth } from '../hooks/useAuth';

export default function Resources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCapacity, setSearchCapacity] = useState('');
  const { canManageResources, user } = useAuth();
  
  // Debug: Log user role and permissions
  console.log('User data:', user);
  console.log('Can manage resources:', canManageResources());
  console.log('User role:', user?.role);

  const updateStatus = async (id: number, status: Resource['status']) => {
    try {
      console.log(`Updating status for resource ${id} to ${status}`);
      const response = await api.patch(`/admin/resources/${id}/status/test?status=${status}`);
      console.log('Status updated successfully:', response.data);
      setResources(prev =>
        prev.map(r => (r.id === id ? { ...r, status } : r))
      );
    } catch (err: any) {
      console.error('Failed to update status:', err);
      console.error('Error details:', err.response?.data);
      alert(`Failed to update status: ${err.response?.data?.message || err.message}`);
    }
  };

  const deleteResource = async (id: number) => {
    console.log('Delete button clicked for resource:', id);
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        console.log('Deleting resource:', id);
        const response = await api.delete(`/admin/resources/${id}/test`);
        console.log('Resource deleted successfully:', response.data);
        setResources(prev => prev.filter(r => r.id !== id));
        alert('Resource deleted successfully');
      } catch (err: any) {
        console.error('Failed to delete resource:', err);
        console.error('Error details:', err.response?.data);
        alert(`Failed to delete resource: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const searchResources = async () => {
    setLoading(true);
    try {
      console.log('DEBUG: Searching with filters:', { searchType, searchLocation, searchCapacity });
      
      let url = '/admin/resources';
      const params = new URLSearchParams();
      
      if (searchType || searchLocation) {
        url = '/admin/resources/search';
        if (searchType) params.append('type', searchType);
        if (searchLocation) params.append('location', searchLocation);
      }
      
      const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;
      console.log('DEBUG: Calling API URL:', fullUrl);
      
      const response = await api.get(fullUrl);
      console.log('DEBUG: API response:', response.data);
      
      let filteredResources = response.data;
      
      // Apply capacity filter on frontend since backend doesn't support it
      if (searchCapacity) {
        console.log('DEBUG: Applying capacity filter >=', searchCapacity);
        filteredResources = filteredResources.filter((resource: Resource) => 
          resource.capacity && resource.capacity >= parseInt(searchCapacity)
        );
        console.log('DEBUG: Resources after capacity filter:', filteredResources);
      }
      
      setResources(filteredResources);
      console.log('DEBUG: Final resources set:', filteredResources);
    } catch (error) {
      console.error('Error searching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchResources();
  }, [searchType, searchLocation, searchCapacity]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resources</h1>
        <Link 
          to="/resources/create" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Resource
        </Link>
      </div>
      
      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resource Type
            </label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="LECTURE_HALL">Lecture Hall</option>
              <option value="LAB">Lab</option>
              <option value="MEETING_ROOM">Meeting Room</option>
              <option value="EQUIPMENT">Equipment</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Search by location..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Capacity
            </label>
            <input
              type="number"
              value={searchCapacity}
              onChange={(e) => setSearchCapacity(e.target.value)}
              placeholder="Min capacity..."
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchType('');
                setSearchLocation('');
                setSearchCapacity('');
              }}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {resources.map((resource: Resource) => (
            <div key={resource.id} className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg">{resource.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{resource.location}</p>
              {resource.resourceType && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {resource.resourceType}
                </span>
              )}
              {resource.capacity && (
                <p className="text-gray-500 text-xs mt-1">Capacity: {resource.capacity}</p>
              )}
              {resource.description && (
                <p className="text-gray-700 text-sm mt-2 line-clamp-2">{resource.description}</p>
              )}
              <div className="mt-3 flex justify-between items-center">
                <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                  resource.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {resource.status}
                </span>
                <div className="flex space-x-2">
                  <Link
                    to={`/resources/edit/${resource.id}`}
                    className="text-blue-600 text-xs hover:text-blue-800"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteResource(resource.id!)}
                    className="text-red-600 text-xs hover:text-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <select
                  value={resource.status}
                  disabled={resource.status === 'OUT_OF_SERVICE'}
                  onChange={(e) => updateStatus(resource.id!, e.target.value as Resource['status'])}
                  className="border border-gray-300 px-2 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}