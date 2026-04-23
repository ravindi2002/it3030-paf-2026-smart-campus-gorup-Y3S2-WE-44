import { useState, useEffect } from 'react';

interface Resource {
  id: number;
  name: string;
  type: 'lecture_hall' | 'computer_lab' | 'meeting_room' | 'projector_room' | 'study_room' | 'conference_room';
  capacity: number;
  location: string;
  equipment: string[];
  availability: 'available' | 'maintenance' | 'reserved' | 'unavailable';
  description: string;
  image?: string;
  rules: string[];
  createdAt: string;
  updatedAt: string;
}

interface ResourceManagementProps {
  onResourceUpdate?: (resource: Resource) => void;
}

export default function ResourceManagement({ onResourceUpdate }: ResourceManagementProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState<Partial<Resource>>({});

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock resources data
      const mockResources: Resource[] = [
        {
          id: 1,
          name: 'Lecture Hall A',
          type: 'lecture_hall',
          capacity: 100,
          location: 'Building A, Floor 1',
          equipment: ['Projector', 'Whiteboard', 'Sound System', 'Microphone'],
          availability: 'available',
          description: 'Large lecture hall with modern audio-visual equipment',
          rules: ['No food or drinks', 'Clean up after use', 'Book at least 24 hours in advance'],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-04-20T14:30:00Z'
        },
        {
          id: 2,
          name: 'Computer Lab 101',
          type: 'computer_lab',
          capacity: 30,
          location: 'Building B, Floor 2',
          equipment: ['Computers', 'Projector', 'Whiteboard', 'WiFi'],
          availability: 'available',
          description: 'Computer lab with 30 workstations and high-speed internet',
          rules: ['No food or drinks', 'Log off when finished', 'Report technical issues'],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-04-20T14:30:00Z'
        },
        {
          id: 3,
          name: 'Meeting Room B',
          type: 'meeting_room',
          capacity: 12,
          location: 'Building A, Floor 2',
          equipment: ['Conference Phone', 'Whiteboard', 'TV Screen'],
          availability: 'maintenance',
          description: 'Small meeting room perfect for team discussions',
          rules: ['Maximum 2 hours booking', 'Clean up after use'],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-04-20T14:30:00Z'
        },
        {
          id: 4,
          name: 'Projector Room C',
          type: 'projector_room',
          capacity: 20,
          location: 'Building C, Floor 1',
          equipment: ['Projector', 'Screen', 'Sound System'],
          availability: 'available',
          description: 'Dedicated room for presentations with high-quality projector',
          rules: ['No food or drinks', 'Technical support available'],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-04-20T14:30:00Z'
        },
        {
          id: 5,
          name: 'Study Room 201',
          type: 'study_room',
          capacity: 6,
          location: 'Library, Floor 2',
          equipment: ['Desk', 'Chair', 'Power Outlet', 'WiFi'],
          availability: 'available',
          description: 'Quiet study room for individual or small group work',
          rules: ['Quiet hours only', 'Maximum 4 hours booking', 'No food or drinks'],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-04-20T14:30:00Z'
        },
        {
          id: 6,
          name: 'Conference Room D',
          type: 'conference_room',
          capacity: 50,
          location: 'Building A, Floor 3',
          equipment: ['Video Conference System', 'Projector', 'Sound System', 'Recording Equipment'],
          availability: 'available',
          description: 'Professional conference room with video conferencing capabilities',
          rules: ['Business hours only', 'Catering available', 'Technical support required'],
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-04-20T14:30:00Z'
        }
      ];
      
      setResources(mockResources);
    } catch (err) {
      setError('Failed to fetch resources');
      console.error('Error fetching resources:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredResources = () => {
    return resources.filter(resource => {
      const matchesSearch = !filter || 
        resource.name.toLowerCase().includes(filter.toLowerCase()) ||
        resource.location.toLowerCase().includes(filter.toLowerCase()) ||
        resource.description.toLowerCase().includes(filter.toLowerCase());
      
      const matchesType = typeFilter === 'all' || resource.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || resource.availability === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  };

  const handleAddResource = () => {
    const newResource: Resource = {
      id: Date.now(),
      name: formData.name || '',
      type: formData.type || 'meeting_room',
      capacity: formData.capacity || 10,
      location: formData.location || '',
      equipment: formData.equipment || [],
      availability: 'available',
      description: formData.description || '',
      rules: formData.rules || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setResources(prev => [newResource, ...prev]);
    setShowAddModal(false);
    setFormData({});
    onResourceUpdate?.(newResource);
  };

  const handleEditResource = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      name: resource.name,
      type: resource.type,
      capacity: resource.capacity,
      location: resource.location,
      equipment: resource.equipment,
      description: resource.description,
      rules: resource.rules
    });
  };

  const handleUpdateResource = () => {
    if (!editingResource) return;
    
    const updatedResource = {
      ...editingResource,
      ...formData,
      updatedAt: new Date().toISOString()
    };
    
    setResources(prev => 
      prev.map(resource => 
        resource.id === editingResource.id ? updatedResource : resource
      )
    );
    setEditingResource(null);
    setFormData({});
    setShowAddModal(false);
    onResourceUpdate?.(updatedResource);
  };

  const handleDeleteResource = (resourceId: number) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      setResources(prev => prev.filter(resource => resource.id !== resourceId));
    }
  };

  const handleStatusChange = (resourceId: number, newStatus: Resource['availability']) => {
    setResources(prev => 
      prev.map(resource => 
        resource.id === resourceId 
          ? { ...resource, availability: newStatus, updatedAt: new Date().toISOString() }
          : resource
      )
    );
  };

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'lecture_hall':
        return '🏛️';
      case 'computer_lab':
        return '💻';
      case 'meeting_room':
        return '🤝';
      case 'projector_room':
        return '📽';
      case 'study_room':
        return '📚';
      case 'conference_room':
        return '🏢';
      default:
        return '🏢';
    }
  };

  const getStatusColor = (status: Resource['availability']) => {
    switch (status) {
      case 'available':
        return 'text-green-600 bg-green-100';
      case 'maintenance':
        return 'text-yellow-600 bg-yellow-100';
      case 'reserved':
        return 'text-blue-600 bg-blue-100';
      case 'unavailable':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: Resource['availability']) => {
    switch (status) {
      case 'available':
        return '✅';
      case 'maintenance':
        return '🔧';
      case 'reserved':
        return '📅';
      case 'unavailable':
        return '❌';
      default:
        return '❓';
    }
  };

  const filteredResources = getFilteredResources();

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading resources...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resource Management</h1>
          <p className="text-gray-500">Manage campus facilities and equipment</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            ➕ Add Resource
          </button>
          <button
            onClick={fetchResources}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search resources..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="lecture_hall">Lecture Halls</option>
              <option value="computer_lab">Computer Labs</option>
              <option value="meeting_room">Meeting Rooms</option>
              <option value="projector_room">Projector Rooms</option>
              <option value="study_room">Study Rooms</option>
              <option value="conference_room">Conference Rooms</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
              <option value="reserved">Reserved</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredResources.length} of {resources.length} resources
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">
                    {getTypeIcon(resource.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{resource.name}</h3>
                    <p className="text-sm text-gray-500">{resource.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resource.availability)}`}>
                    <span className="mr-1">{getStatusIcon(resource.availability)}</span>
                    {resource.availability.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{resource.capacity} people</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Equipment:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {resource.equipment.map((item, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Description:</p>
                  <p className="text-gray-900">{resource.description}</p>
                </div>
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Rules:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {resource.rules.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-xs text-gray-500">
                  Updated: {new Date(resource.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditResource(resource)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleStatusChange(resource.id, resource.availability === 'available' ? 'maintenance' : 'available')}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors"
                  >
                    {resource.availability === 'available' ? '🔧 Maintenance' : '✅ Available'}
                  </button>
                  <button
                    onClick={() => handleDeleteResource(resource.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Resource Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{resources.length}</div>
            <div className="text-sm text-gray-600">Total Resources</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {resources.filter(r => r.availability === 'available').length}
            </div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {resources.filter(r => r.availability === 'maintenance').length}
            </div>
            <div className="text-sm text-gray-600">Under Maintenance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {resources.filter(r => r.availability === 'unavailable').length}
            </div>
            <div className="text-sm text-gray-600">Unavailable</div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingResource) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingResource ? 'Edit Resource' : 'Add New Resource'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingResource(null);
                    setFormData({});
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={formData.type || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="meeting_room">Meeting Room</option>
                    <option value="lecture_hall">Lecture Hall</option>
                    <option value="computer_lab">Computer Lab</option>
                    <option value="projector_room">Projector Room</option>
                    <option value="study_room">Study Room</option>
                    <option value="conference_room">Conference Room</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingResource(null);
                    setFormData({});
                  }}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingResource ? handleUpdateResource : handleAddResource}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  {editingResource ? 'Update' : 'Add'} Resource
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
