import { useState, useEffect } from 'react';

interface AccessibilityFeature {
  id: string;
  name: string;
  description: string;
  implemented: boolean;
  category: 'navigation' | 'forms' | 'content' | 'visual' | 'keyboard' | 'screen-reader';
  impact: 'high' | 'medium' | 'low';
}

export default function AccessibilityFeatures() {
  const [features, setFeatures] = useState<AccessibilityFeature[]>([
    {
      id: '1',
      name: 'Semantic HTML',
      description: 'Use proper semantic elements (header, nav, main, etc.)',
      implemented: true,
      category: 'content',
      impact: 'high'
    },
    {
      id: '2',
      name: 'ARIA Labels',
      description: 'Add ARIA labels and descriptions for screen readers',
      implemented: true,
      category: 'screen-reader',
      impact: 'high'
    },
    {
      id: '3',
      name: 'Keyboard Navigation',
      description: 'Full keyboard accessibility for all interactive elements',
      implemented: true,
      category: 'keyboard',
      impact: 'high'
    },
    {
      id: '4',
      name: 'Focus Management',
      description: 'Visible focus indicators and logical tab order',
      implemented: true,
      category: 'navigation',
      impact: 'high'
    },
    {
      id: '5',
      name: 'Color Contrast',
      description: 'WCAG AA compliant color contrast ratios',
      implemented: true,
      category: 'visual',
      impact: 'medium'
    },
    {
      id: '6',
      name: 'Text Scaling',
      description: 'Support for browser zoom and text resizing',
      implemented: true,
      category: 'visual',
      impact: 'medium'
    },
    {
      id: '7',
      name: 'Form Labels',
      description: 'Proper labels and field descriptions for forms',
      implemented: true,
      category: 'forms',
      impact: 'high'
    },
    {
      id: '8',
      name: 'Error Messages',
      description: 'Clear and accessible error notifications',
      implemented: true,
      category: 'forms',
      impact: 'medium'
    },
    {
      id: '9',
      name: 'Skip Links',
      description: 'Skip to main content links for keyboard users',
      implemented: false,
      category: 'navigation',
      impact: 'medium'
    },
    {
      id: '10',
      name: 'Alternative Text',
      description: 'Alt text for all meaningful images',
      implemented: true,
      category: 'screen-reader',
      impact: 'medium'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnlyImplemented, setShowOnlyImplemented] = useState(false);

  const getImpactColor = (impact: string) => {
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

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'high':
        return '🔴';
      case 'medium':
        return '🟡';
      case 'low':
        return '🟢';
      default:
        return '⚪';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'navigation':
        return '🧭';
      case 'forms':
        return '📝';
      case 'content':
        return '📄';
      case 'visual':
        return '👁️';
      case 'keyboard':
        return '⌨️';
      case 'screen-reader':
        return '🔊';
      default:
        return '♿';
    }
  };

  const filteredFeatures = features.filter(feature => {
    if (selectedCategory !== 'all' && feature.category !== selectedCategory) {
      return false;
    }
    if (showOnlyImplemented && !feature.implemented) {
      return false;
    }
    return true;
  });

  const implementedCount = features.filter(f => f.implemented).length;
  const totalCount = features.length;
  const implementationPercentage = Math.round((implementedCount / totalCount) * 100);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Accessibility Features</h1>
          <p className="text-gray-500">WCAG 2.1 AA compliance and inclusive design</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            {implementedCount}/{totalCount} features implemented
          </div>
          <div className="text-sm font-medium text-green-600">
            {implementationPercentage}% compliant
          </div>
        </div>
      </div>

      {/* Compliance Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Compliance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{implementationPercentage}%</div>
            <div className="text-sm text-gray-600">WCAG 2.1 AA</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{implementedCount}</div>
            <div className="text-sm text-gray-600">Features Implemented</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{totalCount - implementedCount}</div>
            <div className="text-sm text-gray-600">Features Pending</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-green-600 h-full transition-all duration-500"
              style={{ width: `${implementationPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="navigation">Navigation</option>
              <option value="forms">Forms</option>
              <option value="content">Content</option>
              <option value="visual">Visual</option>
              <option value="keyboard">Keyboard</option>
              <option value="screen-reader">Screen Reader</option>
            </select>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showOnlyImplemented}
                onChange={(e) => setShowOnlyImplemented(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">Show only implemented features</span>
            </label>
          </div>
        </div>
      </div>

      {/* Features List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Accessibility Features ({filteredFeatures.length})
        </h2>

        {filteredFeatures.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 text-lg mb-4">♿</div>
            <div className="text-gray-700 font-medium">No features found</div>
            <p className="text-gray-500 text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeatures.map((feature) => (
              <div 
                key={feature.id} 
                className={`border rounded-lg p-4 transition-all ${
                  feature.implemented 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="text-2xl">
                      {getCategoryIcon(feature.category)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{feature.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(feature.impact)}`}>
                          <span className="mr-1">{getImpactIcon(feature.impact)}</span>
                          {feature.impact.toUpperCase()} IMPACT
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getCategoryIcon(feature.category)} {feature.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {feature.implemented ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✅ Implemented
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        ⏳ Pending
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Testing Tools */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Accessibility Testing Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-3">🔍 Browser Tools</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Chrome Accessibility Inspector</li>
              <li>• Firefox Accessibility Toolbar</li>
              <li>• Safari Accessibility Inspector</li>
              <li>• Edge Accessibility Insights</li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-3">🧪 Screen Readers</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• NVDA (Windows)</li>
              <li>• JAWS (Windows)</li>
              <li>• VoiceOver (Mac/iOS)</li>
              <li>• TalkBack (Android)</li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-3">🎨 Color Contrast</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• WebAIM Contrast Checker</li>
              <li>• Adobe Color Accessibility Tools</li>
              <li>• Colour Contrast Analyser</li>
              <li>• Stark Contrast Checker</li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-3">📱 Mobile Testing</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• iOS Accessibility Inspector</li>
              <li>• Android Accessibility Suite</li>
              <li>• TalkBack Testing</li>
              <li>• VoiceOver Testing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Guidelines */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">WCAG 2.1 Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-3">🎯 Perceivable</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Text alternatives for non-text content</li>
              <li>• Captions for media</li>
              <li>• Color contrast requirements</li>
              <li>• Responsive design</li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-3">🎮 Operable</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Keyboard accessibility</li>
              <li>• No flashing content</li>
              <li>• Navigation assistance</li>
              <li>• Time limits for interactions</li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-3">🎨 Understandable</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Readable text content</li>
              <li>• Predictable functionality</li>
              <li>• Input assistance</li>
              <li>• Error identification</li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-3">🔧 Robust</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Compatible with assistive technologies</li>
              <li>• Semantic HTML markup</li>
              <li>• Error prevention</li>
              <li>• Future compatibility</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => alert('Running accessibility audit...')}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔍 Run Audit
          </button>
          <button 
            onClick={() => alert('Generating accessibility report...')}
            className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            📊 Generate Report
          </button>
          <button 
            onClick={() => alert('Opening testing checklist...')}
            className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            ✅ Test Checklist
          </button>
          <button 
            onClick={() => alert('Opening WCAG guidelines...')}
            className="bg-orange-600 text-white px-4 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            📚 Guidelines
          </button>
        </div>
      </div>
    </div>
  );
}
