import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Resource } from '../types/Resource';

export default function StudentResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCapacity, setSearchCapacity] = useState('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  const searchResources = async () => {
    setLoading(true);
    try {
      console.log('DEBUG: Student searching with filters:', { searchType, searchLocation, searchCapacity });
      
      let url = '/admin/resources';
      const params = new URLSearchParams();
      
      if (searchType || searchLocation) {
        url = '/admin/resources/search';
        if (searchType) params.append('type', searchType);
        if (searchLocation) params.append('location', searchLocation);
      }
      
      const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;
      console.log('DEBUG: Student calling API URL:', fullUrl);
      
      const response = await api.get(fullUrl);
      console.log('DEBUG: Student API response:', response.data);
      
      let filteredResources = response.data;
      
      // Apply capacity filter on frontend since backend doesn't support it
      if (searchCapacity) {
        console.log('DEBUG: Student applying capacity filter >=', searchCapacity);
        filteredResources = filteredResources.filter((resource: Resource) => 
          resource.capacity && resource.capacity >= parseInt(searchCapacity)
        );
        console.log('DEBUG: Student resources after capacity filter:', filteredResources);
      }
      
      // Only show ACTIVE resources to students
      filteredResources = filteredResources.filter((resource: Resource) => 
        resource.status === 'ACTIVE'
      );
      
      setResources(filteredResources);
      console.log('DEBUG: Student final resources set:', filteredResources);
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
      {/* Header Section */}
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Resources</h1>
              <p className="text-gray-600">Browse and search available campus resources</p>
            </div>
            <div className="bg-blue-100 px-4 py-2 rounded-xl">
              <span className="text-blue-800 font-semibold">{resources.length} Resources</span>
            </div>
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
            <span className="text-sm text-gray-500">Find your perfect resource</span>
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
        ) : resources.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center max-w-md">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Resources Found</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later for available resources.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource: Resource) => (
              <div key={resource.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200 hover:scale-105">
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
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                      resource.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        resource.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      {resource.status}
                    </span>
                    <button 
                      onClick={() => setSelectedResource(resource)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Resource Details Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-white">Resource Details</h3>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Resource Name</label>
                      <p className="text-gray-900 font-medium">{selectedResource.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <p className="text-gray-900 font-medium">{selectedResource.location}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Resource Type</label>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {selectedResource.resourceType?.replace('_', ' ')}
                      </span>
                    </div>
                    {selectedResource.capacity && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                        <p className="text-gray-900 font-medium">{selectedResource.capacity} people</p>
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                        selectedResource.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          selectedResource.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        {selectedResource.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Description</h4>
                  {selectedResource.description ? (
                    <p className="text-gray-700 leading-relaxed">{selectedResource.description}</p>
                  ) : (
                    <p className="text-gray-500 italic">No description available</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedResource(null)}
                  className="bg-gray-200 text-gray-800 px-6 py-2.5 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
