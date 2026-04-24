import { useState, useEffect } from 'react';

interface TestSuite {
  id: string;
  name: string;
  description: string;
  type: 'unit' | 'integration' | 'e2e' | 'performance' | 'accessibility';
  status: 'passed' | 'failed' | 'running' | 'pending' | 'skipped';
  duration?: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  lastRun?: string;
  coverage?: number;
}

interface TestResult {
  id: string;
  suiteId: string;
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  errorMessage?: string;
  stackTrace?: string;
}

export default function TestingSuite() {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [selectedSuite, setSelectedSuite] = useState<TestSuite | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [filter, setFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchTestSuites();
  }, []);

  const fetchTestSuites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock test suites data
      const mockSuites: TestSuite[] = [
        {
          id: '1',
          name: 'Booking Management Tests',
          description: 'Unit tests for booking CRUD operations and validation',
          type: 'unit',
          status: 'passed',
          duration: 245,
          totalTests: 45,
          passedTests: 45,
          failedTests: 0,
          lastRun: '2024-04-20T10:30:00Z',
          coverage: 92
        },
        {
          id: '2',
          name: 'User Authentication Tests',
          description: 'Integration tests for login, registration, and role management',
          type: 'integration',
          status: 'passed',
          duration: 180,
          totalTests: 28,
          passedTests: 27,
          failedTests: 1,
          lastRun: '2024-04-20T10:15:00Z',
          coverage: 88
        },
        {
          id: '3',
          name: 'Resource Management Tests',
          description: 'Unit tests for resource CRUD and availability checking',
          type: 'unit',
          status: 'failed',
          duration: 156,
          totalTests: 32,
          passedTests: 30,
          failedTests: 2,
          lastRun: '2024-04-20T10:00:00Z',
          coverage: 85
        },
        {
          id: '4',
          name: 'End-to-End Booking Flow',
          description: 'E2E tests for complete booking workflows',
          type: 'e2e',
          status: 'passed',
          duration: 420,
          totalTests: 12,
          passedTests: 12,
          failedTests: 0,
          lastRun: '2024-04-20T09:45:00Z',
          coverage: 78
        },
        {
          id: '5',
          name: 'Performance Tests',
          description: 'Load testing and performance benchmarks',
          type: 'performance',
          status: 'running',
          duration: 0,
          totalTests: 8,
          passedTests: 0,
          failedTests: 0,
          lastRun: '2024-04-20T09:30:00Z',
          coverage: 0
        },
        {
          id: '6',
          name: 'Accessibility Tests',
          description: 'WCAG 2.1 AA compliance and screen reader tests',
          type: 'accessibility',
          status: 'pending',
          duration: 0,
          totalTests: 15,
          passedTests: 0,
          failedTests: 0,
          lastRun: '2024-04-19T16:00:00Z',
          coverage: 0
        }
      ];

      // Mock test results
      const mockResults: TestResult[] = [
        {
          id: '1',
          suiteId: '1',
          testName: 'should create booking with valid data',
          status: 'passed',
          duration: 45
        },
        {
          id: '2',
          suiteId: '1',
          testName: 'should reject booking with invalid dates',
          status: 'passed',
          duration: 23
        },
        {
          id: '3',
          suiteId: '1',
          testName: 'should detect booking conflicts',
          status: 'passed',
          duration: 67
        },
        {
          id: '4',
          suiteId: '3',
          testName: 'should create resource with valid data',
          status: 'failed',
          duration: 89,
          errorMessage: 'Expected status 201 but received 500',
          stackTrace: 'at ResourceService.create (resource.service.ts:45)'
        },
        {
          id: '5',
          suiteId: '3',
          testName: 'should update resource availability',
          status: 'failed',
          duration: 34,
          errorMessage: 'Timeout: Request took longer than 5000ms',
          stackTrace: 'at ResourceService.update (resource.service.ts:78)'
        }
      ];

      setTestSuites(mockSuites);
      setTestResults(mockResults);
    } catch (err) {
      setError('Failed to fetch test suites');
      console.error('Error fetching test suites:', err);
    } finally {
      setLoading(false);
    }
  };

  const runTestSuite = async (suiteId: string) => {
    try {
      setIsRunning(true);
      setTestSuites(prev => 
        prev.map(suite => 
          suite.id === suiteId 
            ? { ...suite, status: 'running' as const }
            : suite
        )
      );

      // Simulate test run
      await new Promise(resolve => setTimeout(resolve, 3000));

      const suite = testSuites.find(s => s.id === suiteId);
      if (suite) {
        const newStatus = Math.random() > 0.2 ? 'passed' as const : 'failed' as const;
        const passedCount = newStatus === 'passed' ? suite.totalTests : Math.floor(suite.totalTests * 0.8);
        const failedCount = newStatus === 'passed' ? 0 : suite.totalTests - passedCount;
        
        setTestSuites(prev => 
          prev.map(s => 
            s.id === suiteId 
              ? { 
                  ...s, 
                  status: newStatus,
                  duration: Math.floor(Math.random() * 500) + 100,
                  passedTests: passedCount,
                  failedTests: failedCount,
                  lastRun: new Date().toISOString(),
                  coverage: Math.floor(Math.random() * 20) + 80
                }
              : s
          )
        );
      }
    } catch (error) {
      alert('Test run failed');
    } finally {
      setIsRunning(false);
    }
  };

  const runAllTests = async () => {
    try {
      setIsRunning(true);
      
      for (const suite of testSuites) {
        if (suite.status !== 'running') {
          await runTestSuite(suite.id);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    } catch (error) {
      alert('Test run failed');
    } finally {
      setIsRunning(false);
    }
  };

  const getFilteredSuites = () => {
    return testSuites.filter(suite => {
      const matchesSearch = !filter || 
        suite.name.toLowerCase().includes(filter.toLowerCase()) ||
        suite.description.toLowerCase().includes(filter.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || suite.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  const getSuiteTypeColor = (type: TestSuite['type']) => {
    switch (type) {
      case 'unit':
        return 'text-blue-600 bg-blue-100';
      case 'integration':
        return 'text-purple-600 bg-purple-100';
      case 'e2e':
        return 'text-green-600 bg-green-100';
      case 'performance':
        return 'text-orange-600 bg-orange-100';
      case 'accessibility':
        return 'text-pink-600 bg-pink-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSuiteTypeIcon = (type: TestSuite['type']) => {
    switch (type) {
      case 'unit':
        return '🧪';
      case 'integration':
        return '🔗';
      case 'e2e':
        return '🎭';
      case 'performance':
        return '⚡';
      case 'accessibility':
        return '♿';
      default:
        return '📋';
    }
  };

  const getStatusColor = (status: TestSuite['status']) => {
    switch (status) {
      case 'passed':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'running':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'skipped':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: TestSuite['status']) => {
    switch (status) {
      case 'passed':
        return '✅';
      case 'failed':
        return '❌';
      case 'running':
        return '🔄';
      case 'pending':
        return '⏳';
      case 'skipped':
        return '⏭️';
      default:
        return '❓';
    }
  };

  const filteredSuites = getFilteredSuites();
  const totalSuites = testSuites.length;
  const passedSuites = testSuites.filter(s => s.status === 'passed').length;
  const failedSuites = testSuites.filter(s => s.status === 'failed').length;
  const totalTests = testSuites.reduce((sum, s) => sum + s.totalTests, 0);
  const totalPassed = testSuites.reduce((sum, s) => sum + s.passedTests, 0);
  const totalFailed = testSuites.reduce((sum, s) => sum + s.failedTests, 0);
  const averageCoverage = testSuites.filter(s => s.coverage).reduce((sum, s) => sum + (s.coverage || 0), 0) / testSuites.filter(s => s.coverage).length;

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading test suites...</div>
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
          <h1 className="text-2xl font-bold text-gray-900">Testing Suite</h1>
          <p className="text-gray-500">Run and manage automated tests</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? '🔄 Running...' : '🚀 Run All Tests'}
          </button>
          <button
            onClick={fetchTestSuites}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Test Statistics */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalSuites}</div>
            <div className="text-sm text-gray-600">Total Suites</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{passedSuites}</div>
            <div className="text-sm text-gray-600">Passed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{failedSuites}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{totalTests}</div>
            <div className="text-sm text-gray-600">Total Tests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalPassed}</div>
            <div className="text-sm text-gray-600">Passed Tests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{totalFailed}</div>
            <div className="text-sm text-gray-600">Failed Tests</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Average Code Coverage</div>
            <div className="text-2xl font-bold text-blue-600">{averageCoverage.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Test Suites</label>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search test suites..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="running">Running</option>
              <option value="pending">Pending</option>
              <option value="skipped">Skipped</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredSuites.length} of {totalSuites} suites
          </div>
        </div>
      </div>

      {/* Test Suites */}
      <div className="space-y-4">
        {filteredSuites.map((suite) => (
          <div key={suite.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Suite Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {getSuiteTypeIcon(suite.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{suite.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSuiteTypeColor(suite.type)}`}>
                        {suite.type.toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(suite.status)}`}>
                        <span className="mr-1">{getStatusIcon(suite.status)}</span>
                        {suite.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedSuite(suite)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    👁️ View
                  </button>
                  <button
                    onClick={() => runTestSuite(suite.id)}
                    disabled={isRunning || suite.status === 'running'}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {suite.status === 'running' ? '🔄 Running' : '🚀 Run'}
                  </button>
                </div>
              </div>

              {/* Suite Description */}
              <p className="text-gray-600 mb-4">{suite.description}</p>

              {/* Suite Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{suite.totalTests}</div>
                  <div className="text-sm text-gray-600">Total Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{suite.passedTests}</div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">{suite.failedTests}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{suite.coverage}%</div>
                  <div className="text-sm text-gray-600">Coverage</div>
                </div>
              </div>

              {/* Suite Details */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-xs text-gray-500">
                  {suite.lastRun && `Last run: ${new Date(suite.lastRun).toLocaleString()}`}
                  {suite.duration && ` • Duration: ${suite.duration}ms`}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => alert(`Download results: ${suite.name}`)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    📥 Download
                  </button>
                  <button
                    onClick={() => alert(`View logs: ${suite.name}`)}
                    className="text-purple-600 hover:text-purple-800 text-sm"
                  >
                    📊 Logs
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Test Results Modal */}
      {selectedSuite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Test Results: {selectedSuite.name}</h2>
                <button
                  onClick={() => setSelectedSuite(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{selectedSuite.totalTests}</div>
                    <div className="text-sm text-gray-600">Total Tests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{selectedSuite.passedTests}</div>
                    <div className="text-sm text-gray-600">Passed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{selectedSuite.failedTests}</div>
                    <div className="text-sm text-gray-600">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{selectedSuite.coverage}%</div>
                    <div className="text-sm text-gray-600">Coverage</div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Individual Test Results</h3>
                  <div className="space-y-2">
                    {testResults
                      .filter(result => result.suiteId === selectedSuite.id)
                      .map((result) => (
                        <div key={result.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(result.status)}`}>
                                <span className="mr-1">{getStatusIcon(result.status)}</span>
                                {result.status.toUpperCase()}
                              </span>
                              <span className="font-medium text-gray-900">{result.testName}</span>
                            </div>
                            <div className="text-sm text-gray-600">
                              {result.duration}ms
                            </div>
                          </div>
                          {result.errorMessage && (
                            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                              <div className="font-medium">Error:</div>
                              <div>{result.errorMessage}</div>
                              {result.stackTrace && (
                                <div className="mt-1 font-mono text-xs">{result.stackTrace}</div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
