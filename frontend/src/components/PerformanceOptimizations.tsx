import { useState, useEffect } from 'react';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
  recommendation?: string;
  trend: 'improving' | 'stable' | 'degrading';
}

interface Optimization {
  id: string;
  name: string;
  description: string;
  category: 'frontend' | 'backend' | 'database' | 'network' | 'infrastructure';
  impact: 'high' | 'medium' | 'low';
  status: 'implemented' | 'in_progress' | 'planned' | 'not_applicable';
  estimatedImprovement: string;
  implementation: string;
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  description: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export default function PerformanceOptimizations() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [optimizations, setOptimizations] = useState<Optimization[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock performance metrics
      const mockMetrics: PerformanceMetric[] = [
        {
          id: '1',
          name: 'Page Load Time',
          value: 1.2,
          unit: 'seconds',
          status: 'excellent',
          description: 'Time for initial page load and render',
          recommendation: 'Keep under 2 seconds for optimal user experience',
          trend: 'improving'
        },
        {
          id: '2',
          name: 'Time to Interactive',
          value: 2.1,
          unit: 'seconds',
          status: 'good',
          description: 'Time until page is fully interactive',
          recommendation: 'Optimize JavaScript execution and reduce blocking operations',
          trend: 'stable'
        },
        {
          id: '3',
          name: 'First Contentful Paint',
          value: 0.8,
          unit: 'seconds',
          status: 'excellent',
          description: 'Time to render first meaningful content',
          recommendation: 'Critical for perceived performance',
          trend: 'improving'
        },
        {
          id: '4',
          name: 'Largest Contentful Paint',
          value: 1.5,
          unit: 'seconds',
          status: 'good',
          description: 'Time to render largest content element',
          recommendation: 'Optimize images and reduce bundle size',
          trend: 'stable'
        },
        {
          id: '5',
          name: 'Cumulative Layout Shift',
          value: 0.08,
          unit: 'score',
          status: 'good',
          description: 'Visual stability score (lower is better)',
          recommendation: 'Keep under 0.1 for good user experience',
          trend: 'improving'
        },
        {
          id: '6',
          name: 'First Input Delay',
          value: 85,
          unit: 'milliseconds',
          status: 'good',
          description: 'Time to respond to first user interaction',
          recommendation: 'Keep under 100ms for responsive feel',
          trend: 'stable'
        },
        {
          id: '7',
          name: 'Bundle Size',
          value: 245,
          unit: 'KB',
          status: 'good',
          description: 'Total JavaScript bundle size',
          recommendation: 'Keep under 300KB for optimal loading',
          trend: 'stable'
        },
        {
          id: '8',
          name: 'API Response Time',
          value: 145,
          unit: 'milliseconds',
          status: 'good',
          description: 'Average API endpoint response time',
          recommendation: 'Keep under 200ms for good performance',
          trend: 'improving'
        },
        {
          id: '9',
          name: 'Database Query Time',
          value: 45,
          unit: 'milliseconds',
          status: 'excellent',
          description: 'Average database query execution time',
          recommendation: 'Keep under 100ms for optimal performance',
          trend: 'stable'
        },
        {
          id: '10',
          name: 'Memory Usage',
          value: 68,
          unit: 'MB',
          status: 'fair',
          description: 'Application memory consumption',
          recommendation: 'Monitor for memory leaks and optimize data structures',
          trend: 'degrading'
        }
      ];

      // Mock optimizations
      const mockOptimizations: Optimization[] = [
        {
          id: '1',
          name: 'Code Splitting',
          description: 'Split application code into smaller chunks for better caching',
          category: 'frontend',
          impact: 'high',
          status: 'implemented',
          estimatedImprovement: '30-40% faster initial load',
          implementation: 'React.lazy() and dynamic imports for route-based code splitting'
        },
        {
          id: '2',
          name: 'Image Optimization',
          description: 'Compress and serve images in modern formats',
          category: 'frontend',
          impact: 'medium',
          status: 'implemented',
          estimatedImprovement: '50-70% smaller image sizes',
          implementation: 'WebP format with fallbacks, lazy loading, and responsive images'
        },
        {
          id: '3',
          name: 'Database Indexing',
          description: 'Add strategic indexes to improve query performance',
          category: 'database',
          impact: 'high',
          status: 'implemented',
          estimatedImprovement: '60-80% faster queries',
          implementation: 'Indexes on frequently queried columns (user_id, resource_id, dates)'
        },
        {
          id: '4',
          name: 'API Caching',
          description: 'Implement Redis caching for frequently accessed data',
          category: 'backend',
          impact: 'high',
          status: 'in_progress',
          estimatedImprovement: '70-90% faster cached responses',
          implementation: 'Redis with TTL for booking data, user info, and resources'
        },
        {
          id: '5',
          name: 'CDN Implementation',
          description: 'Use Content Delivery Network for static assets',
          category: 'infrastructure',
          impact: 'medium',
          status: 'implemented',
          estimatedImprovement: '40-60% faster asset delivery',
          implementation: 'CloudFlare CDN with automatic optimization'
        },
        {
          id: '6',
          name: 'Service Worker',
          description: 'Implement service worker for offline functionality',
          category: 'frontend',
          impact: 'medium',
          status: 'planned',
          estimatedImprovement: 'Instant loading for repeat visits',
          implementation: 'Cache-first strategy with background sync'
        },
        {
          id: '7',
          name: 'Database Connection Pooling',
          description: 'Optimize database connection management',
          category: 'database',
          impact: 'medium',
          status: 'implemented',
          estimatedImprovement: '20-30% better connection handling',
          implementation: 'HikariCP with connection pool size of 20'
        },
        {
          id: '8',
          name: 'Bundle Analysis',
          description: 'Analyze and optimize JavaScript bundle',
          category: 'frontend',
          impact: 'medium',
          status: 'implemented',
          estimatedImprovement: '15-25% smaller bundle',
          implementation: 'Webpack Bundle Analyzer and tree shaking'
        }
      ];

      // Mock performance alerts
      const mockAlerts: PerformanceAlert[] = [
        {
          id: '1',
          type: 'warning',
          title: 'Memory Usage Increasing',
          description: 'Application memory usage has increased by 15% in the last hour',
          timestamp: '2024-04-20T14:30:00Z',
          severity: 'medium'
        },
        {
          id: '2',
          type: 'info',
          title: 'Performance Improvement Detected',
          description: 'Page load time improved by 12% after latest optimization',
          timestamp: '2024-04-20T13:15:00Z',
          severity: 'low'
        },
        {
          id: '3',
          type: 'error',
          title: 'API Response Time Degradation',
          description: 'Average API response time exceeded 500ms threshold',
          timestamp: '2024-04-20T12:45:00Z',
          severity: 'high'
        }
      ];

      setMetrics(mockMetrics);
      setOptimizations(mockOptimizations);
      setAlerts(mockAlerts);
    } catch (err) {
      setError('Failed to fetch performance data');
      console.error('Error fetching performance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOptimizations = () => {
    if (selectedCategory === 'all') return optimizations;
    return optimizations.filter(opt => opt.category === selectedCategory);
  };

  const getMetricStatusColor = (status: PerformanceMetric['status']) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-100';
      case 'good':
        return 'text-blue-600 bg-blue-100';
      case 'fair':
        return 'text-yellow-600 bg-yellow-100';
      case 'poor':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getMetricTrendIcon = (trend: PerformanceMetric['trend']) => {
    switch (trend) {
      case 'improving':
        return '📈';
      case 'stable':
        return '➡️';
      case 'degrading':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getOptimizationStatusColor = (status: Optimization['status']) => {
    switch (status) {
      case 'implemented':
        return 'text-green-600 bg-green-100';
      case 'in_progress':
        return 'text-yellow-600 bg-yellow-100';
      case 'planned':
        return 'text-blue-600 bg-blue-100';
      case 'not_applicable':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertColor = (type: PerformanceAlert['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'info':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getImpactColor = (impact: Optimization['impact']) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredOptimizations = getFilteredOptimizations();

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading performance data...</div>
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
          <h1 className="text-2xl font-bold text-gray-900">Performance Optimizations</h1>
          <p className="text-gray-500">Monitor and optimize system performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchPerformanceData}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <div key={metric.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{metric.name}</h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getMetricStatusColor(metric.status)}`}>
                  {metric.status.toUpperCase()}
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                <span className="text-sm text-gray-600">{metric.unit}</span>
                <span className="text-lg">{getMetricTrendIcon(metric.trend)}</span>
              </div>
              <div className="text-sm text-gray-600 mt-2">{metric.description}</div>
              {metric.recommendation && (
                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                  <strong>Recommendation:</strong> {metric.recommendation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Performance Alerts */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Alerts</h2>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className={`border rounded-lg p-4 ${getAlertColor(alert.type)}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-lg">
                    {alert.type === 'error' && '🚨'}
                    {alert.type === 'warning' && '⚠️'}
                    {alert.type === 'info' && 'ℹ️'}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{alert.title}</h3>
                    <p className="text-sm text-gray-700 mt-1">{alert.description}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(alert.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimizations */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Optimizations</h2>
          <div className="flex items-center space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="database">Database</option>
              <option value="network">Network</option>
              <option value="infrastructure">Infrastructure</option>
            </select>
          </div>
        </div>
        <div className="space-y-4">
          {filteredOptimizations.map((optimization) => (
            <div key={optimization.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <h3 className="font-medium text-gray-900">{optimization.name}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getOptimizationStatusColor(optimization.status)}`}>
                    {optimization.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(optimization.impact)}`}>
                    {optimization.impact.toUpperCase()} IMPACT
                  </span>
                </div>
              </div>
              <p className="text-gray-600 mb-3">{optimization.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Category:</span>
                  <div className="text-gray-600 capitalize">{optimization.category}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Estimated Improvement:</span>
                  <div className="text-green-600 font-medium">{optimization.estimatedImprovement}</div>
                </div>
              </div>
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <div className="text-sm">
                  <span className="font-medium text-gray-900">Implementation:</span>
                  <div className="text-gray-700 mt-1">{optimization.implementation}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Score */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Performance Score</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">85</div>
              <div className="text-sm text-gray-600">Performance Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">A</div>
              <div className="text-sm text-gray-600">Grade</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-gray-600">
              <div>• Page Load: Excellent</div>
              <div>• User Experience: Good</div>
              <div>• Resource Usage: Fair</div>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-gray-600">
            <strong>Recommendations:</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Monitor memory usage trends and implement memory leak detection</li>
              <li>Continue optimizing bundle size with code splitting</li>
              <li>Implement service worker for better offline performance</li>
              <li>Set up automated performance monitoring and alerts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
