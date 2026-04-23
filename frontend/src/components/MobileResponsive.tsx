import { useState, useEffect } from 'react';

interface ResponsiveBreakpoint {
  name: string;
  min: number;
  max?: number;
}

interface ResponsiveConfig {
  breakpoints: ResponsiveBreakpoint[];
  currentBreakpoint: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export default function MobileResponsive() {
  const [config, setConfig] = useState<ResponsiveConfig>({
    breakpoints: [
      { name: 'mobile', min: 0, max: 767 },
      { name: 'tablet', min: 768, max: 1023 },
      { name: 'desktop', min: 1024, max: 1439 },
      { name: 'large', min: 1440 }
    ],
    currentBreakpoint: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const currentBreakpoint = config.breakpoints.find(bp => 
        width >= bp.min && (!bp.max || width <= bp.max)
      );

      if (currentBreakpoint) {
        setConfig(prev => ({
          ...prev,
          currentBreakpoint: currentBreakpoint.name,
          isMobile: currentBreakpoint.name === 'mobile',
          isTablet: currentBreakpoint.name === 'tablet',
          isDesktop: ['desktop', 'large'].includes(currentBreakpoint.name)
        }));
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Mobile Responsive Design
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          Optimizing the Smart Campus booking system for all devices
        </p>
      </div>

      {/* Current Breakpoint Indicator */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Viewport</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`text-center p-3 rounded-lg ${
            config.currentBreakpoint === 'mobile' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
          }`}>
            <div className="text-2xl mb-1">📱</div>
            <div className="text-sm font-medium">Mobile</div>
            <div className="text-xs">0-767px</div>
          </div>
          <div className={`text-center p-3 rounded-lg ${
            config.currentBreakpoint === 'tablet' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
          }`}>
            <div className="text-2xl mb-1">📱</div>
            <div className="text-sm font-medium">Tablet</div>
            <div className="text-xs">768-1023px</div>
          </div>
          <div className={`text-center p-3 rounded-lg ${
            config.currentBreakpoint === 'desktop' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
          }`}>
            <div className="text-2xl mb-1">💻</div>
            <div className="text-sm font-medium">Desktop</div>
            <div className="text-xs">1024-1439px</div>
          </div>
          <div className={`text-center p-3 rounded-lg ${
            config.currentBreakpoint === 'large' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
          }`}>
            <div className="text-2xl mb-1">🖥</div>
            <div className="text-sm font-medium">Large</div>
            <div className="text-xs">1440px+</div>
          </div>
        </div>
      </div>

      {/* Responsive Design Examples */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Responsive Components</h2>
        
        {/* Navigation Example */}
        <div className="mb-8">
          <h3 className="text-md font-medium text-gray-900 mb-3">Navigation Menu</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            {/* Mobile Navigation */}
            <div className="md:hidden">
              <div className="space-y-2">
                <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  ☰ Menu
                </button>
                <div className="space-y-1 mt-2">
                  <a href="#" className="block bg-white px-4 py-3 rounded hover:bg-gray-100 transition-colors">📅 Bookings</a>
                  <a href="#" className="block bg-white px-4 py-3 rounded hover:bg-gray-100 transition-colors">👤 Profile</a>
                  <a href="#" className="block bg-white px-4 py-3 rounded hover:bg-gray-100 transition-colors">📊 Analytics</a>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              <a href="#" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">📅 Bookings</a>
              <a href="#" className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">👤 Profile</a>
              <a href="#" className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">📊 Analytics</a>
            </div>
          </div>
        </div>

        {/* Card Grid Example */}
        <div className="mb-8">
          <h3 className="text-md font-medium text-gray-900 mb-3">Responsive Card Grid</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="text-2xl mb-2">📋</div>
                <h4 className="font-semibold text-gray-900 mb-1">Card {item}</h4>
                <p className="text-sm text-gray-600">
                  This card adapts to screen size automatically
                </p>
                <div className="mt-3 flex justify-between">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                    Action
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 transition-colors text-sm">
                    Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table Example */}
        <div className="mb-8">
          <h3 className="text-md font-medium text-gray-900 mb-3">Responsive Table</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resource
                  </th>
                  <th className="hidden sm:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="hidden md:table-cell px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[1, 2, 3].map((item) => (
                  <tr key={item} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{item}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      Lecture Hall {item}
                    </td>
                    <td className="hidden sm:table-cell px-3 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Approved
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      Apr {24 - item}, 2024
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-900 font-medium">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form Example */}
        <div className="mb-8">
          <h3 className="text-md font-medium text-gray-900 mb-3">Responsive Form</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resource
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Lecture Hall A</option>
                  <option>Computer Lab 101</option>
                  <option>Meeting Room B</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter booking purpose..."
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Submit Booking
              </button>
              <button className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Optimization Tips */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Mobile Optimization Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-3">🎯 Touch-Friendly</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Large tap targets (44px minimum)</li>
              <li>• Adequate spacing between elements</li>
              <li>• Swipe gestures for navigation</li>
              <li>• Touch-optimized form controls</li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-3">📱 Performance</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Optimized images for mobile</li>
              <li>• Lazy loading for content</li>
              <li>• Reduced animations on mobile</li>
              <li>• Compressed assets</li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-3">🎨 Design</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Single column layouts</li>
              <li>• Collapsible navigation</li>
              <li>• Readable font sizes</li>
              <li>• High contrast colors</li>
            </ul>
          </div>
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-3">⚡ Features</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Progressive disclosure</li>
              <li>• Mobile-first approach</li>
              <li>• Responsive typography</li>
              <li>• Adaptive components</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Implementation Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Implementation Status</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-green-600 text-xl mr-3">✅</span>
              <span className="font-medium text-gray-900">Responsive Grid System</span>
            </div>
            <span className="text-sm text-green-600">Implemented</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-green-600 text-xl mr-3">✅</span>
              <span className="font-medium text-gray-900">Mobile Navigation</span>
            </div>
            <span className="text-sm text-green-600">Implemented</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-green-600 text-xl mr-3">✅</span>
              <span className="font-medium text-gray-900">Touch Optimization</span>
            </div>
            <span className="text-sm text-green-600">Implemented</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-yellow-600 text-xl mr-3">⏳</span>
              <span className="font-medium text-gray-900">Progressive Web App</span>
            </div>
            <span className="text-sm text-yellow-600">In Progress</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-yellow-600 text-xl mr-3">⏳</span>
              <span className="font-medium text-gray-900">Offline Support</span>
            </div>
            <span className="text-sm text-yellow-600">Planned</span>
          </div>
        </div>
      </div>
    </div>
  );
}
