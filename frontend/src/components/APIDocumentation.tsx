import { useState, useEffect } from 'react';

interface APIEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters: Parameter[];
  requestBody?: RequestBody;
  responses: Response[];
  authentication: boolean;
  rateLimit?: string;
  deprecated?: boolean;
}

interface Parameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  example?: any;
  validation?: string;
}

interface RequestBody {
  contentType: string;
  schema: any;
  example?: any;
}

interface Response {
  statusCode: number;
  description: string;
  schema?: any;
  example?: any;
}

export default function APIDocumentation() {
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [showTryIt, setShowTryIt] = useState(false);
  const [requestBody, setRequestBody] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAPIDocumentation();
  }, []);

  const fetchAPIDocumentation = async () => {
    try {
      // Mock API documentation data
      const mockEndpoints: APIEndpoint[] = [
        {
          id: '1',
          method: 'POST',
          path: '/api/bookings',
          description: 'Create a new booking for a campus resource',
          parameters: [],
          requestBody: {
            contentType: 'application/json',
            schema: {
              type: 'object',
              properties: {
                resourceName: { type: 'string', description: 'Name of the resource to book' },
                startTime: { type: 'string', format: 'date-time', description: 'Start time of the booking' },
                endTime: { type: 'string', format: 'date-time', description: 'End time of the booking' },
                purpose: { type: 'string', description: 'Purpose of the booking' },
                expectedAttendees: { type: 'number', description: 'Number of expected attendees' }
              },
              required: ['resourceName', 'startTime', 'endTime', 'purpose']
            },
            example: {
              resourceName: 'Lecture Hall A',
              startTime: '2024-04-25T10:00:00Z',
              endTime: '2024-04-25T12:00:00Z',
              purpose: 'Computer Science Lecture',
              expectedAttendees: 50
            }
          },
          responses: [
            {
              statusCode: 201,
              description: 'Booking created successfully',
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  resourceName: { type: 'string' },
                  status: { type: 'string' },
                  createdAt: { type: 'string' }
                }
              }
            },
            {
              statusCode: 400,
              description: 'Bad request - Invalid booking data'
            },
            {
              statusCode: 409,
              description: 'Conflict - Resource already booked for this time'
            }
          ],
          authentication: true,
          rateLimit: '100 requests per hour'
        },
        {
          id: '2',
          method: 'GET',
          path: '/api/bookings',
          description: 'Retrieve all bookings with optional filtering',
          parameters: [
            {
              name: 'userId',
              type: 'number',
              required: false,
              description: 'Filter bookings by user ID',
              example: 123
            },
            {
              name: 'resourceId',
              type: 'number',
              required: false,
              description: 'Filter bookings by resource ID',
              example: 456
            },
            {
              name: 'status',
              type: 'string',
              required: false,
              description: 'Filter bookings by status (PENDING, APPROVED, REJECTED, CANCELLED)',
              example: 'APPROVED'
            },
            {
              name: 'startDate',
              type: 'string',
              required: false,
              description: 'Filter bookings from start date (ISO 8601 format)',
              example: '2024-04-01T00:00:00Z'
            },
            {
              name: 'endDate',
              type: 'string',
              required: false,
              description: 'Filter bookings to end date (ISO 8601 format)',
              example: '2024-04-30T23:59:59Z'
            }
          ],
          responses: [
            {
              statusCode: 200,
              description: 'Bookings retrieved successfully',
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                    resourceName: { type: 'string' },
                    startTime: { type: 'string' },
                    endTime: { type: 'string' },
                    status: { type: 'string' },
                    userId: { type: 'number' }
                  }
                }
              }
            }
          ],
          authentication: true,
          rateLimit: '200 requests per hour'
        },
        {
          id: '3',
          method: 'GET',
          path: '/api/bookings/{id}',
          description: 'Retrieve a specific booking by ID',
          parameters: [
            {
              name: 'id',
              type: 'number',
              required: true,
              description: 'Unique identifier of the booking',
              example: 123,
              validation: 'Must be a valid booking ID'
            }
          ],
          responses: [
            {
              statusCode: 200,
              description: 'Booking retrieved successfully',
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  resourceName: { type: 'string' },
                  startTime: { type: 'string' },
                  endTime: { type: 'string' },
                  status: { type: 'string' },
                  purpose: { type: 'string' },
                  userId: { type: 'number' },
                  createdAt: { type: 'string' },
                  updatedAt: { type: 'string' }
                }
              }
            },
            {
              statusCode: 404,
              description: 'Booking not found'
            }
          ],
          authentication: true
        },
        {
          id: '4',
          method: 'PUT',
          path: '/api/bookings/{id}',
          description: 'Update an existing booking',
          parameters: [
            {
              name: 'id',
              type: 'number',
              required: true,
              description: 'Unique identifier of the booking',
              example: 123
            }
          ],
          requestBody: {
            contentType: 'application/json',
            schema: {
              type: 'object',
              properties: {
                resourceName: { type: 'string' },
                startTime: { type: 'string', format: 'date-time' },
                endTime: { type: 'string', format: 'date-time' },
                purpose: { type: 'string' },
                expectedAttendees: { type: 'number' }
              }
            }
          },
          responses: [
            {
              statusCode: 200,
              description: 'Booking updated successfully'
            },
            {
              statusCode: 404,
              description: 'Booking not found'
            },
            {
              statusCode: 403,
              description: 'Forbidden - Cannot modify other users bookings'
            }
          ],
          authentication: true
        },
        {
          id: '5',
          method: 'PUT',
          path: '/api/bookings/{id}/approve',
          description: 'Approve a pending booking (Admin only)',
          parameters: [
            {
              name: 'id',
              type: 'number',
              required: true,
              description: 'Unique identifier of the booking',
              example: 123
            }
          ],
          requestBody: {
            contentType: 'application/json',
            schema: {
              type: 'object',
              properties: {
                rejectionReason: { type: 'string', description: 'Reason for rejection (if rejecting)' }
              }
            }
          },
          responses: [
            {
              statusCode: 200,
              description: 'Booking approved successfully'
            },
            {
              statusCode: 404,
              description: 'Booking not found'
            },
            {
              statusCode: 403,
              description: 'Forbidden - Admin access required'
            }
          ],
          authentication: true
        },
        {
          id: '6',
          method: 'PUT',
          path: '/api/bookings/{id}/cancel',
          description: 'Cancel a booking',
          parameters: [
            {
              name: 'id',
              type: 'number',
              required: true,
              description: 'Unique identifier of the booking',
              example: 123
            }
          ],
          responses: [
            {
              statusCode: 200,
              description: 'Booking cancelled successfully'
            },
            {
              statusCode: 404,
              description: 'Booking not found'
            },
            {
              statusCode: 403,
              description: 'Forbidden - Cannot cancel other users bookings'
            }
          ],
          authentication: true
        },
        {
          id: '7',
          method: 'DELETE',
          path: '/api/bookings/{id}',
          description: 'Delete a booking (Admin only)',
          parameters: [
            {
              name: 'id',
              type: 'number',
              required: true,
              description: 'Unique identifier of the booking',
              example: 123
            }
          ],
          responses: [
            {
              statusCode: 204,
              description: 'Booking deleted successfully'
            },
            {
              statusCode: 404,
              description: 'Booking not found'
            },
            {
              statusCode: 403,
              description: 'Forbidden - Admin access required'
            }
          ],
          authentication: true
        },
        {
          id: '8',
          method: 'GET',
          path: '/api/resources',
          description: 'Retrieve all available resources',
          parameters: [
            {
              name: 'type',
              type: 'string',
              required: false,
              description: 'Filter resources by type (lecture_hall, computer_lab, meeting_room, etc.)',
              example: 'lecture_hall'
            },
            {
              name: 'available',
              type: 'boolean',
              required: false,
              description: 'Filter only available resources',
              example: true
            }
          ],
          responses: [
            {
              statusCode: 200,
              description: 'Resources retrieved successfully',
              schema: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                    name: { type: 'string' },
                    type: { type: 'string' },
                    capacity: { type: 'number' },
                    location: { type: 'string' },
                    equipment: { type: 'array' },
                    availability: { type: 'string' }
                  }
                }
              }
            }
          ],
          authentication: false,
          rateLimit: '500 requests per hour'
        },
        {
          id: '9',
          method: 'POST',
          path: '/api/auth/login',
          description: 'Authenticate user and get access token',
          parameters: [],
          requestBody: {
            contentType: 'application/json',
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string', format: 'email', description: 'User email address' },
                password: { type: 'string', description: 'User password' }
              },
              required: ['email', 'password']
            },
            example: {
              email: 'john.doe@campus.edu',
              password: 'password123'
            }
          },
          responses: [
            {
              statusCode: 200,
              description: 'Authentication successful',
              schema: {
                type: 'object',
                properties: {
                  token: { type: 'string' },
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      name: { type: 'string' },
                      email: { type: 'string' },
                      role: { type: 'string' }
                    }
                  }
                }
              }
            },
            {
              statusCode: 401,
              description: 'Authentication failed - Invalid credentials'
            }
          ],
          authentication: false,
          rateLimit: '10 requests per minute'
        },
        {
          id: '10',
          method: 'POST',
          path: '/api/auth/register',
          description: 'Register a new user account',
          parameters: [],
          requestBody: {
            contentType: 'application/json',
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Full name' },
                email: { type: 'string', format: 'email', description: 'Email address' },
                password: { type: 'string', description: 'Password (min 8 characters)' },
                department: { type: 'string', description: 'Department' }
              },
              required: ['name', 'email', 'password', 'department']
            }
          },
          responses: [
            {
              statusCode: 201,
              description: 'User registered successfully',
              schema: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  name: { type: 'string' },
                  email: { type: 'string' },
                  role: { type: 'string' }
                }
              }
            },
            {
              statusCode: 400,
              description: 'Bad request - Invalid user data'
            },
            {
              statusCode: 409,
              description: 'Conflict - Email already exists'
            }
          ],
          authentication: false,
          rateLimit: '5 requests per minute'
        }
      ];

      setEndpoints(mockEndpoints);
    } catch (error) {
      console.error('Error fetching API documentation:', error);
    }
  };

  const getFilteredEndpoints = () => {
    return endpoints.filter(endpoint => {
      const matchesSearch = !filter || 
        endpoint.path.toLowerCase().includes(filter.toLowerCase()) ||
        endpoint.description.toLowerCase().includes(filter.toLowerCase());
      
      const matchesMethod = methodFilter === 'all' || endpoint.method === methodFilter;
      
      return matchesSearch && matchesMethod;
    });
  };

  const getMethodColor = (method: APIEndpoint['method']) => {
    switch (method) {
      case 'GET':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'POST':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'PUT':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'DELETE':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'PATCH':
        return 'text-purple-600 bg-purple-100 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusCodeColor = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) return 'text-green-600 bg-green-100';
    if (statusCode >= 300 && statusCode < 400) return 'text-yellow-600 bg-yellow-100';
    if (statusCode >= 400 && statusCode < 500) return 'text-orange-600 bg-orange-100';
    if (statusCode >= 500) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  const tryEndpoint = async () => {
    if (!selectedEndpoint) return;
    
    setLoading(true);
    setResponse('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResponse = {
        success: true,
        data: {
          message: 'API call successful',
          endpoint: selectedEndpoint.path,
          method: selectedEndpoint.method,
          timestamp: new Date().toISOString()
        }
      };
      
      setResponse(JSON.stringify(mockResponse, null, 2));
    } catch (error) {
      setResponse(JSON.stringify({ error: 'API call failed' }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const filteredEndpoints = getFilteredEndpoints();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API Documentation</h1>
          <p className="text-gray-500">Smart Campus Booking System REST API</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => alert('Downloading OpenAPI specification...')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            📥 Download OpenAPI
          </button>
          <button
            onClick={() => alert('Opening Postman collection...')}
            className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition-colors"
          >
            📮 Postman Collection
          </button>
        </div>
      </div>

      {/* API Info */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">API Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">🌐 Base URL</h3>
            <code className="block bg-gray-100 px-3 py-2 rounded text-sm">
              https://api.smartcampus.edu/v1
            </code>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">🔐 Authentication</h3>
            <div className="space-y-2 text-sm">
              <div>• Bearer Token (JWT)</div>
              <div>• API Key (for services)</div>
              <div>• OAuth 2.0 (for external apps)</div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">📊 Rate Limits</h3>
            <div className="space-y-2 text-sm">
              <div>• Auth endpoints: 10 req/min</div>
              <div>• Booking endpoints: 100 req/hr</div>
              <div>• Resource endpoints: 500 req/hr</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Endpoints</label>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search endpoints..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Method Filter</label>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Methods</option>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredEndpoints.length} of {endpoints.length} endpoints
          </div>
        </div>
      </div>

      {/* Endpoints List */}
      <div className="space-y-4">
        {filteredEndpoints.map((endpoint) => (
          <div key={endpoint.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Endpoint Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                    {endpoint.path}
                  </code>
                  {endpoint.deprecated && (
                    <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      DEPRECATED
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {endpoint.authentication && (
                    <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      🔒 Requires Auth
                    </span>
                  )}
                  {endpoint.rateLimit && (
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      ⏱️ {endpoint.rateLimit}
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSelectedEndpoint(endpoint);
                      setShowTryIt(true);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    🧪 Try It
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-4">{endpoint.description}</p>

              {/* Parameters */}
              {endpoint.parameters.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Parameters</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Required</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Example</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {endpoint.parameters.map((param, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm">
                              <code className="bg-gray-100 px-2 py-1 rounded">{param.name}</code>
                            </td>
                            <td className="px-4 py-2 text-sm">
                              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {param.type}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm">
                              <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                                param.required 
                                  ? 'bg-red-100 text-red-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {param.required ? 'Required' : 'Optional'}
                              </span>
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-700">{param.description}</td>
                            <td className="px-4 py-2 text-sm">
                              {param.example && (
                                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                  {JSON.stringify(param.example)}
                                </code>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Request Body */}
              {endpoint.requestBody && (
                <div className="mb-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Request Body</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="mb-2">
                      <span className="text-sm text-gray-600">Content-Type:</span>
                      <code className="ml-2 bg-white px-2 py-1 rounded text-sm">
                        {endpoint.requestBody.contentType}
                      </code>
                    </div>
                    {endpoint.requestBody.example && (
                      <div>
                        <div className="text-sm text-gray-600 mb-2">Example:</div>
                        <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                          {JSON.stringify(endpoint.requestBody.example, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Responses */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Responses</h4>
                <div className="space-y-2">
                  {endpoint.responses.map((response, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${getStatusCodeColor(response.statusCode)}`}>
                          {response.statusCode}
                        </span>
                        <span className="font-medium text-gray-900">{response.description}</span>
                      </div>
                      {response.example && (
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Example Response:</div>
                          <pre className="bg-gray-900 text-gray-100 p-3 rounded text-xs overflow-x-auto">
                            {JSON.stringify(response.example, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Try It Modal */}
      {showTryIt && selectedEndpoint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Try API: {selectedEndpoint.method} {selectedEndpoint.path}
                </h2>
                <button
                  onClick={() => {
                    setShowTryIt(false);
                    setRequestBody('');
                    setResponse('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {/* Request Body */}
                {selectedEndpoint.requestBody && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Request Body (JSON)</label>
                    <textarea
                      rows={8}
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      placeholder="Enter JSON request body..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    />
                  </div>
                )}

                {/* Send Button */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={tryEndpoint}
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? '🔄 Sending...' : '🚀 Send Request'}
                  </button>
                  <button
                    onClick={() => {
                      setRequestBody('');
                      setResponse('');
                    }}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                  >
                    🔄 Clear
                  </button>
                </div>

                {/* Response */}
                {response && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">Response</h3>
                      <button
                        onClick={() => navigator.clipboard.writeText(response)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        📋 Copy
                      </button>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded text-xs overflow-x-auto max-h-64">
                      {response}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
