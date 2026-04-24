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
      // Debug: Log all image URLs
      filteredResources.forEach((resource: Resource) => {
        if (resource.imageUrl) {
          console.log('DEBUG: Resource with image URL:', resource.name, 'URL:', resource.imageUrl);
        }
      });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Resource Management</h1>
              <p className="text-gray-600">Manage and monitor campus resources efficiently</p>
            </div>
            <Link 
              to="/resources/create" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Resource
            </Link>
          </div>
        </div>
        
        {/* Filter Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </h2>
            <span className="text-sm text-gray-500">{resources.length} resources found</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resource Type
              </label>
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Types</option>
                <option value="LECTURE_HALL">Lecture Hall</option>
                <option value="LAB">Lab</option>
                <option value="MEETING_ROOM">Meeting Room</option>
                <option value="EQUIPMENT">Equipment</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Search by location..."
                  className="w-full px-4 py-2.5 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <svg className="absolute left-3 top-3 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Capacity
              </label>
              <input
                type="number"
                value={searchCapacity}
                onChange={(e) => setSearchCapacity(e.target.value)}
                placeholder="Min capacity..."
                min="1"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchType('');
                  setSearchLocation('');
                  setSearchCapacity('');
                }}
                className="bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 w-full font-medium transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Clear Filters
              </button>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource: Resource) => (
              <div key={resource.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
                  <h3 className="font-bold text-xl text-white">{resource.name}</h3>
                  <p className="text-blue-100 text-sm flex items-center gap-1 mt-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {resource.location}
                  </p>
                </div>
                
                {/* Card Body */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    {resource.resourceType && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {resource.resourceType.replace('_', ' ')}
                      </span>
                    )}
                    {resource.capacity && (
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Capacity: {resource.capacity}
                      </div>
                    )}
                  </div>
                  
                  {resource.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{resource.description}</p>
                  )}
                  
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      resource.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        resource.status === 'ACTIVE' ? 'bg-green-400' :
                        'bg-red-400'
                      }`}></span>
                      {resource.status}
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <Link
                        to={`/resources/edit/${resource.id}`}
                        className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteResource(resource.id!)}
                        className="inline-flex items-center px-3 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors duration-200"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {/* Status Update Dropdown */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <label className="block text-xs font-medium text-gray-700 mb-2">Quick Status Update</label>
                    <select
                      value={resource.status}
                      disabled={resource.status === 'OUT_OF_SERVICE'}
                      onChange={(e) => updateStatus(resource.id!, e.target.value as Resource['status'])}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}