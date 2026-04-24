import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Resource } from '../types/Resource';

export default function StudentResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchType, setSearchType] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCapacity, setSearchCapacity] = useState('');

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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Available Resources</h1>
        <p className="text-gray-600 mt-2">Browse and search available campus resources</p>
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
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resources...</p>
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-8">
          <div className="bg-gray-100 rounded-lg p-8">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources available</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later.</p>
          </div>
        </div>
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
                <div className="text-gray-400 text-xs">
                  Available
                </div>
              </div>
              {resource.imageUrl && (
                <div className="mt-3">
                  <img 
                    src={resource.imageUrl} 
                    alt={resource.name}
                    className="w-full h-32 object-cover rounded-md"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
