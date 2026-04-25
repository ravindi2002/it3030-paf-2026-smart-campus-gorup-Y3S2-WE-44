import { useState, useEffect } from 'react';

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
  isActive: boolean;
  userCount: number;
  createdAt: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'booking' | 'resource' | 'user' | 'admin' | 'system';
  isSystem: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
  currentRole: string;
  department: string;
  isActive: boolean;
}

interface RoleAssignment {
  userId: number;
  roleId: number;
  assignedBy: number;
  assignedAt: string;
  expiresAt?: string;
}

// Temporarily disabled due to TypeScript issues - can be re-enabled after fixing
export default function RoleBasedAccess_disabled() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [filter, setFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    fetchRoleData();
  }, []);

  const fetchRoleData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock roles data
      const mockRoles: Role[] = [
        {
          id: 1,
          name: 'Super Admin',
          description: 'Full system access with all permissions',
          permissions: ['all'],
          isActive: true,
          userCount: 2,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          name: 'Facility Manager',
          description: 'Manage campus facilities and resources',
          permissions: ['booking.create', 'booking.read', 'booking.update', 'booking.delete', 'resource.create', 'resource.read', 'resource.update', 'resource.delete'],
          isActive: true,
          userCount: 5,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 3,
          name: 'Booking Administrator',
          description: 'Manage booking system and approve requests',
          permissions: ['booking.create', 'booking.read', 'booking.update', 'booking.delete', 'booking.approve', 'booking.reject'],
          isActive: true,
          userCount: 8,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 4,
          name: 'Support Staff',
          description: 'Handle user support and ticket management',
          permissions: ['ticket.create', 'ticket.read', 'ticket.update', 'ticket.resolve', 'user.read'],
          isActive: true,
          userCount: 12,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 5,
          name: 'Faculty',
          description: 'Academic staff with booking privileges',
          permissions: ['booking.create', 'booking.read', 'booking.update', 'resource.read'],
          isActive: true,
          userCount: 45,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 6,
          name: 'Student',
          description: 'Students with basic booking access',
          permissions: ['booking.create', 'booking.read', 'booking.update', 'resource.read'],
          isActive: true,
          userCount: 384,
          createdAt: '2024-01-01T00:00:00Z'
        }
      ];

      // Mock permissions data
      const mockPermissions: Permission[] = [
        { id: 'booking.create', name: 'Create Booking', description: 'Create new bookings', category: 'booking', isSystem: false },
        { id: 'booking.read', name: 'View Bookings', description: 'View booking details', category: 'booking', isSystem: false },
        { id: 'booking.update', name: 'Update Booking', description: 'Modify existing bookings', category: 'booking', isSystem: false },
        { id: 'booking.delete', name: 'Delete Booking', description: 'Cancel/delete bookings', category: 'booking', isSystem: false },
        { id: 'booking.approve', name: 'Approve Booking', description: 'Approve pending bookings', category: 'booking', isSystem: false },
        { id: 'booking.reject', name: 'Reject Booking', description: 'Reject booking requests', category: 'booking', isSystem: false },
        { id: 'resource.create', name: 'Create Resource', description: 'Add new resources', category: 'resource', isSystem: false },
        { id: 'resource.read', name: 'View Resources', description: 'View resource information', category: 'resource', isSystem: false },
        { id: 'resource.update', name: 'Update Resource', description: 'Modify resource details', category: 'resource', isSystem: false },
        { id: 'resource.delete', name: 'Delete Resource', description: 'Remove resources', category: 'resource', isSystem: false },
        { id: 'user.create', name: 'Create User', description: 'Create new user accounts', category: 'user', isSystem: false },
        { id: 'user.read', name: 'View Users', description: 'View user information', category: 'user', isSystem: false },
        { id: 'user.update', name: 'Update User', description: 'Modify user accounts', category: 'user', isSystem: false },
        { id: 'user.delete', name: 'Delete User', description: 'Remove user accounts', category: 'user', isSystem: false },
        { id: 'ticket.create', name: 'Create Ticket', description: 'Create support tickets', category: 'admin', isSystem: false },
        { id: 'ticket.read', name: 'View Tickets', description: 'View support tickets', category: 'admin', isSystem: false },
        { id: 'ticket.update', name: 'Update Ticket', description: 'Modify support tickets', category: 'admin', isSystem: false },
        { id: 'ticket.resolve', name: 'Resolve Ticket', description: 'Resolve support tickets', category: 'admin', isSystem: false },
        { id: 'system.config', name: 'System Config', description: 'Configure system settings', category: 'system', isSystem: true },
        { id: 'system.logs', name: 'View Logs', description: 'Access system logs', category: 'system', isSystem: true },
        { id: 'system.backup', name: 'System Backup', description: 'Perform system backups', category: 'system', isSystem: true }
      ];

      // Mock users data
      const mockUsers: User[] = [
        { id: 1, name: 'Admin User', email: 'admin@campus.edu', currentRole: 'Super Admin', department: 'IT', isActive: true },
        { id: 2, name: 'John Manager', email: 'john@campus.edu', currentRole: 'Facility Manager', department: 'Facilities', isActive: true },
        { id: 3, name: 'Jane Admin', email: 'jane@campus.edu', currentRole: 'Booking Administrator', department: 'Bookings', isActive: true },
        { id: 4, name: 'Mike Support', email: 'mike@campus.edu', currentRole: 'Support Staff', department: 'IT Support', isActive: true },
        { id: 5, name: 'Dr. Smith', email: 'smith@campus.edu', currentRole: 'Faculty', department: 'Computer Science', isActive: true },
        { id: 6, name: 'Student User', email: 'student@campus.edu', currentRole: 'Student', department: 'Engineering', isActive: true }
      ];

      // Mock role assignments
      const mockAssignments: RoleAssignment[] = [
        { userId: 1, roleId: 1, assignedBy: 1, assignedAt: '2024-01-01T00:00:00Z' },
        { userId: 2, roleId: 2, assignedBy: 1, assignedAt: '2024-01-15T00:00:00Z' },
        { userId: 3, roleId: 3, assignedBy: 1, assignedAt: '2024-02-01T00:00:00Z' },
        { userId: 4, roleId: 4, assignedBy: 1, assignedAt: '2024-02-15T00:00:00Z' },
        { userId: 5, roleId: 5, assignedBy: 1, assignedAt: '2024-03-01T00:00:00Z' },
        { userId: 6, roleId: 6, assignedBy: 1, assignedAt: '2024-03-01T00:00:00Z' }
      ];

      setRoles(mockRoles);
      setPermissions(mockPermissions);
      setUsers(mockUsers);
      setRoleAssignments(mockAssignments);
    } catch (err) {
      setError('Failed to fetch role data');
      console.error('Error fetching role data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredRoles = () => {
    return roles.filter(role => {
      const matchesSearch = !filter || 
        role.name.toLowerCase().includes(filter.toLowerCase()) ||
        role.description.toLowerCase().includes(filter.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || 
        (categoryFilter === 'active' && role.isActive) ||
        (categoryFilter === 'inactive' && !role.isActive);
      
      return matchesSearch && matchesCategory;
    });
  };

  const getPermissionCategory = (category: Permission['category']) => {
    switch (category) {
      case 'booking':
        return { icon: '📅', color: 'text-blue-600 bg-blue-100' };
      case 'resource':
        return { icon: '🏢', color: 'text-green-600 bg-green-100' };
      case 'user':
        return { icon: '👥', color: 'text-purple-600 bg-purple-100' };
      case 'admin':
        return { icon: '⚙️', color: 'text-orange-600 bg-orange-100' };
      case 'system':
        return { icon: '🔧', color: 'text-red-600 bg-red-100' };
      default:
        return { icon: '📋', color: 'text-gray-600 bg-gray-100' };
    }
  };

  const handleAssignRole = async (userId: number, roleId: number) => {
    try {
      const newAssignment: RoleAssignment = {
        userId,
        roleId,
        assignedBy: 1, // Current admin user
        assignedAt: new Date().toISOString()
      };
      
      setRoleAssignments(prev => [...prev, newAssignment]);
      
      // Update user's current role
      setUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, currentRole: roles.find(r => r.id === roleId)?.name || 'Unknown' }
            : user
        )
      );
      
      alert(`Role assigned successfully!`);
    } catch (error) {
      alert('Failed to assign role');
    }
  };

  const handleRevokeRole = async (userId: number) => {
    try {
      setRoleAssignments(prev => prev.filter(assignment => assignment.userId !== userId));
      
      // Update user's current role
      setUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, currentRole: 'No Role' }
            : user
        )
      );
      
      alert(`Role revoked successfully!`);
    } catch (error) {
      alert('Failed to revoke role');
    }
  };

  const filteredRoles = getFilteredRoles();

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading role management data...</div>
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
          <h1 className="text-2xl font-bold text-gray-900">Role-Based Access Control</h1>
          <p className="text-gray-500">Manage user roles and permissions</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            ➕ Create Role
          </button>
          <button
            onClick={() => setShowAssignModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            👥 Assign Role
          </button>
          <button
            onClick={fetchRoleData}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Roles</label>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search roles..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredRoles.length} of {roles.length} roles
          </div>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredRoles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Role Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      role.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {role.isActive ? '✅ Active' : '❌ Inactive'}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      👥 {role.userCount} users
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedRole(role)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    👁️ View
                  </button>
                  <button
                    onClick={() => alert(`Edit role: ${role.name}`)}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors"
                  >
                    ✏️ Edit
                  </button>
                </div>
              </div>

              {/* Role Description */}
              <p className="text-gray-600 mb-4">{role.description}</p>

              {/* Permissions */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Permissions:</h4>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.includes('all') ? (
                    <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium">
                      🔒 All Permissions
                    </span>
                  ) : (
                    role.permissions.map((permissionId) => {
                      const permission = permissions.find(p => p.id === permissionId);
                      if (permission) {
                        const category = getPermissionCategory(permission.category);
                        return (
                          <span key={permissionId} className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${category.color}`}>
                            <span className="mr-1">{category.icon}</span>
                            {permission.name}
                          </span>
                        );
                      }
                      return null;
                    })
                  )}
                </div>
              </div>

              {/* Role Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-xs text-gray-500">
                  Created: {new Date(role.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => alert(`Duplicate role: ${role.name}`)}
                    className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700 transition-colors"
                  >
                    📋 Duplicate
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete role "${role.name}"?`)) {
                        setRoles(prev => prev.filter(r => r.id !== role.id));
                      }
                    }}
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

      {/* Users with Roles */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Users with Assigned Roles</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm">👤</span>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {user.currentRole}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? '✅ Active' : '❌ Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowAssignModal(true)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Change Role
                      </button>
                      {user.currentRole !== 'No Role' && (
                        <button
                          onClick={() => handleRevokeRole(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Role Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{roles.length}</div>
            <div className="text-sm text-gray-600">Total Roles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {roles.filter(r => r.isActive).length}
            </div>
            <div className="text-sm text-gray-600">Active Roles</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{users.length}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {users.filter(u => u.currentRole !== 'No Role').length}
            </div>
            <div className="text-sm text-gray-600">Assigned Users</div>
          </div>
        </div>
      </div>

      {/* Role Details Modal */}
      {selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Role Details: {selectedRole.name}</h2>
                <button
                  onClick={() => setSelectedRole(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{selectedRole.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Permissions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['booking', 'resource', 'user', 'admin', 'system'].map((category) => {
                      const categoryPermissions = permissions.filter(p => p.category === category);
                      if (categoryPermissions.length > 0) {
                        const categoryInfo = getPermissionCategory(category as Permission['category']);
                        return (
                          <div key={category} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-3">
                              <span className="text-2xl">{categoryInfo.icon}</span>
                              <h4 className="text-lg font-medium text-gray-900 capitalize">{category}</h4>
                            </div>
                            <div className="space-y-2">
                              {categoryPermissions.map((permission) => (
                                <div key={permission.id} className="flex items-center justify-between">
                                  <span className="text-sm text-gray-700">{permission.name}</span>
                                  <span className="text-xs text-gray-500">{permission.description}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    Created: {new Date(selectedRole.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => alert(`Edit role: ${selectedRole.name}`)}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                      Edit Role
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete role "${selectedRole.name}"?`)) {
                          setRoles(prev => prev.filter(r => r.id !== selectedRole.id));
                          setSelectedRole(null);
                        }
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                    >
                      Delete Role
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
