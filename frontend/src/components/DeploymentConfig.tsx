import { useState, useEffect } from 'react';

interface DeploymentConfig {
  id: string;
  name: string;
  environment: 'development' | 'staging' | 'production';
  apiUrl: string;
  buildCommand: string;
  deployCommand: string;
  lastDeployed?: string;
  status: 'active' | 'inactive' | 'failed';
  version: string;
  description: string;
}

interface DeploymentEnvironment {
  name: string;
  url: string;
  status: 'healthy' | 'unhealthy' | 'unknown';
  lastCheck: string;
  responseTime?: number;
  uptime?: number;
}

interface BuildConfig {
  name: string;
  command: string;
  status: 'success' | 'failed' | 'running';
  duration?: number;
  logs: string[];
  artifacts: string[];
}

export default function DeploymentConfig() {
  const [configs, setConfigs] = useState<DeploymentConfig[]>([]);
  const [environments, setEnvironments] = useState<DeploymentEnvironment[]>([]);
  const [builds, setBuilds] = useState<BuildConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<DeploymentConfig | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    environment: 'development' as const,
    apiUrl: '',
    buildCommand: 'npm run build',
    deployCommand: 'npm run deploy',
    version: '1.0.0',
    description: ''
  });

  useEffect(() => {
    fetchDeploymentData();
  }, []);

  const fetchDeploymentData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock deployment configs
      const mockConfigs: DeploymentConfig[] = [
        {
          id: '1',
          name: 'Development Environment',
          environment: 'development',
          apiUrl: 'http://localhost:3000/api',
          buildCommand: 'npm run build:dev',
          deployCommand: 'npm run deploy:dev',
          lastDeployed: '2024-04-20T14:30:00Z',
          status: 'active',
          version: '1.0.0',
          description: 'Development environment with hot reload and debugging enabled'
        },
        {
          id: '2',
          name: 'Staging Environment',
          environment: 'staging',
          apiUrl: 'https://staging.smartcampus.edu/api',
          buildCommand: 'npm run build:staging',
          deployCommand: 'npm run deploy:staging',
          lastDeployed: '2024-04-19T10:15:00Z',
          status: 'active',
          version: '1.0.0',
          description: 'Staging environment for testing and QA'
        },
        {
          id: '3',
          name: 'Production Environment',
          environment: 'production',
          apiUrl: 'https://smartcampus.edu/api',
          buildCommand: 'npm run build:prod',
          deployCommand: 'npm run deploy:prod',
          lastDeployed: '2024-04-18T16:45:00Z',
          status: 'active',
          version: '1.0.0',
          description: 'Production environment for live users'
        }
      ];

      // Mock environments
      const mockEnvironments: DeploymentEnvironment[] = [
        {
          name: 'Development Server',
          url: 'http://localhost:3000',
          status: 'healthy',
          lastCheck: new Date().toISOString(),
          responseTime: 45,
          uptime: 99.8
        },
        {
          name: 'Staging Server',
          url: 'https://staging.smartcampus.edu',
          status: 'healthy',
          lastCheck: new Date().toISOString(),
          responseTime: 120,
          uptime: 98.5
        },
        {
          name: 'Production Server',
          url: 'https://smartcampus.edu',
          status: 'healthy',
          lastCheck: new Date().toISOString(),
          responseTime: 85,
          uptime: 99.9
        },
        {
          name: 'Database Server',
          url: 'https://db.smartcampus.edu',
          status: 'healthy',
          lastCheck: new Date().toISOString(),
          responseTime: 25,
          uptime: 99.95
        }
      ];

      // Mock builds
      const mockBuilds: BuildConfig[] = [
        {
          name: 'Development Build',
          command: 'npm run build:dev',
          status: 'success',
          duration: 120,
          logs: ['Starting development build...', 'Compiling TypeScript...', 'Building assets...', 'Build completed successfully'],
          artifacts: ['dev-bundle.js', 'dev-bundle.css', 'index.html']
        },
        {
          name: 'Staging Build',
          command: 'npm run build:staging',
          status: 'success',
          duration: 180,
          logs: ['Starting staging build...', 'Optimizing for production...', 'Generating source maps...', 'Build completed successfully'],
          artifacts: ['staging-bundle.js', 'staging-bundle.css', 'index.html', 'source-map.js']
        },
        {
          name: 'Production Build',
          command: 'npm run build:prod',
          status: 'success',
          duration: 240,
          logs: ['Starting production build...', 'Optimizing for production...', 'Minifying assets...', 'Build completed successfully'],
          artifacts: ['prod-bundle.js', 'prod-bundle.css', 'index.html', 'source-map.js', 'manifest.json']
        }
      ];

      setConfigs(mockConfigs);
      setEnvironments(mockEnvironments);
      setBuilds(mockBuilds);
    } catch (err) {
      setError('Failed to fetch deployment data');
      console.error('Error fetching deployment data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConfig = () => {
    const newConfig: DeploymentConfig = {
      id: Date.now().toString(),
      name: formData.name,
      environment: formData.environment,
      apiUrl: formData.apiUrl,
      buildCommand: formData.buildCommand,
      deployCommand: formData.deployCommand,
      version: formData.version,
      description: formData.description,
      lastDeployed: new Date().toISOString(),
      status: 'inactive'
    };
    
    setConfigs(prev => [...prev, newConfig]);
    setShowCreateModal(false);
    setFormData({
      name: '',
      environment: 'development',
      apiUrl: '',
      buildCommand: 'npm run build',
      deployCommand: 'npm run deploy',
      version: '1.0.0',
      description: ''
    });
  };

  const handleDeploy = async (configId: string) => {
    try {
      setConfigs(prev => 
        prev.map(config => 
          config.id === configId 
            ? { ...config, status: 'active' as const, lastDeployed: new Date().toISOString() }
            : config
        )
      );
      
      // Simulate deployment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Deployment initiated for configuration: ${configs.find(c => c.id === configId)?.name}`);
    } catch (error) {
      alert('Deployment failed');
    }
  };

  const handleBuild = async (buildName: string) => {
    try {
      setBuilds(prev => 
        prev.map(build => 
          build.name === buildName 
            ? { ...build, status: 'running' as const }
            : build
        )
      );
      
      // Simulate build
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setBuilds(prev => 
        prev.map(build => 
          build.name === buildName 
            ? { 
                ...build, 
                status: 'success' as const, 
                duration: Math.floor(Math.random() * 300) + 100,
                logs: ['Build completed successfully']
              }
            : build
        )
      );
      
      alert(`Build completed: ${buildName}`);
    } catch (error) {
      alert('Build failed');
    }
  };

  const getEnvironmentStatusColor = (status: DeploymentEnvironment['status']) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'unhealthy':
        return 'text-red-600 bg-red-100';
      case 'unknown':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getBuildStatusColor = (status: BuildConfig['status']) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'running':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getConfigStatusColor = (status: DeploymentConfig['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getEnvironmentIcon = (status: DeploymentEnvironment['status']) => {
    switch (status) {
      case 'healthy':
        return '💚';
      case 'unhealthy':
        return '❌';
      case 'unknown':
        return '❓';
      default:
        return '📊';
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading deployment configuration...</div>
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
          <h1 className="text-2xl font-bold text-gray-900">Deployment Configuration</h1>
          <p className="text-gray-500">Manage deployment environments and build processes</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            ➕ New Config
          </button>
          <button
            onClick={fetchDeploymentData}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Environments Status */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Environment Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {environments.map((env, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{env.name}</h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getEnvironmentStatusColor(env.status)}`}>
                  <span className="mr-1">{getEnvironmentIcon(env.status)}</span>
                  {env.status.toUpperCase()}
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">URL:</span>
                  <span className="text-gray-900 font-mono text-xs">{env.url}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Response Time:</span>
                  <span className="text-gray-900">{env.responseTime}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uptime:</span>
                  <span className="text-gray-900">{env.uptime}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Check:</span>
                  <span className="text-gray-900">{new Date(env.lastCheck).toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deployment Configurations */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Deployment Configurations</h2>
        <div className="space-y-4">
          {configs.map((config) => (
            <div key={config.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{config.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConfigStatusColor(config.status)}`}>
                      {config.status.toUpperCase()}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {config.environment.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{config.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedConfig(config)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    👁️ View
                  </button>
                  <button
                    onClick={() => handleDeploy(config.id)}
                    disabled={config.status === 'active'}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    🚀 Deploy
                  </button>
                  <button
                    onClick={() => alert(`Edit config: ${config.name}`)}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 transition-colors"
                  >
                    ✏️ Edit
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">API URL:</span>
                  <code className="block bg-gray-100 px-2 py-1 rounded text-gray-900">{config.apiUrl}</code>
                </div>
                <div>
                  <span className="text-gray-600">Build Command:</span>
                  <code className="block bg-gray-100 px-2 py-1 rounded text-gray-900">{config.buildCommand}</code>
                </div>
                <div>
                  <span className="text-gray-600">Deploy Command:</span>
                  <code className="block bg-gray-100 px-2 py-1 rounded text-gray-900">{config.deployCommand}</code>
                </div>
                <div>
                  <span className="text-gray-600">Version:</span>
                  <code className="block bg-gray-100 px-2 py-1 rounded text-gray-900">{config.version}</code>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-xs text-gray-500">
                  Last deployed: {config.lastDeployed ? new Date(config.lastDeployed).toLocaleString() : 'Never'}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => alert(`Download config: ${config.name}`)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    📥 Download
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete configuration "${config.name}"?`)) {
                        setConfigs(prev => prev.filter(c => c.id !== config.id));
                      }
                    }}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Builds */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Builds</h2>
        <div className="space-y-4">
          {builds.map((build, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">{build.name}</h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBuildStatusColor(build.status)}`}>
                  {build.status.toUpperCase()}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Command:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded text-gray-900">{build.command}</code>
                </div>
                {build.duration && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="text-gray-900">{build.duration}s</span>
                  </div>
                )}
              </div>

              <div className="mt-3">
                <div className="text-sm text-gray-600 mb-2">Build Logs:</div>
                <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono max-h-32 overflow-y-auto">
                  {build.logs.map((log, logIndex) => (
                    <div key={logIndex} className="mb-1">
                      <span className="text-green-400">[{new Date().toLocaleTimeString()}]</span> {log}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="text-xs text-gray-500">
                  {build.artifacts.length} artifacts generated
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBuild(build.name)}
                    disabled={build.status === 'running'}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {build.status === 'running' ? '⏳ Building...' : '🔨 Rebuild'}
                  </button>
                  <button
                    onClick={() => alert(`Download artifacts: ${build.name}`)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    📦 Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => alert('Starting full deployment...')}
            className="bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700 transition-colors"
          >
            🚀 Full Deploy
          </button>
          <button
            onClick={() => alert('Building all environments...')}
            className="bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 transition-colors"
          >
            🔨 Build All
          </button>
          <button
            onClick={() => alert('Running health checks...')}
            className="bg-purple-600 text-white px-4 py-3 rounded hover:bg-purple-700 transition-colors"
          >
            🔍 Health Check
          </button>
          <button
            onClick={() => alert('Opening deployment logs...')}
            className="bg-orange-600 text-white px-4 py-3 rounded hover:bg-orange-700 transition-colors"
          >
            📊 View Logs
          </button>
        </div>
      </div>

      {/* Create Config Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Create New Configuration</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({
                      name: '',
                      environment: 'development',
                      apiUrl: '',
                      buildCommand: 'npm run build',
                      deployCommand: 'npm run deploy',
                      version: '1.0.0',
                      description: ''
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Configuration Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
                  <select
                    value={formData.environment}
                    onChange={(e) => setFormData(prev => ({ ...prev, environment: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="development">Development</option>
                    <option value="staging">Staging</option>
                    <option value="production">Production</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">API URL</label>
                  <input
                    type="url"
                    value={formData.apiUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, apiUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({
                      name: '',
                      environment: 'development',
                      apiUrl: '',
                      buildCommand: 'npm run build',
                      deployCommand: 'npm run deploy',
                      version: '1.0.0',
                      description: ''
                    });
                  }}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateConfig}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Create Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
