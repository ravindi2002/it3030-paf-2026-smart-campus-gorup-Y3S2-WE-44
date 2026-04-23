import { useState, useEffect } from 'react';

interface GuideSection {
  id: string;
  title: string;
  description: string;
  content: string[];
  category: 'getting-started' | 'booking' | 'management' | 'troubleshooting' | 'advanced';
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

interface Tutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: string[];
  category: string;
}

export default function UserGuide() {
  const [sections, setSections] = useState<GuideSection[]>([]);
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<GuideSection | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    fetchGuideData();
  }, []);

  const fetchGuideData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock guide sections
      const mockSections: GuideSection[] = [
        {
          id: '1',
          title: 'Getting Started',
          description: 'Learn the basics of the Smart Campus booking system',
          content: [
            'Create your account using your campus email',
            'Complete your profile with department information',
            'Browse available resources and facilities',
            'Make your first booking with the booking form',
            'Check your booking status and receive notifications'
          ],
          category: 'getting-started',
          icon: '🚀',
          difficulty: 'beginner'
        },
        {
          id: '2',
          title: 'Making Bookings',
          description: 'Complete guide to booking campus resources',
          content: [
            'Search for available resources by type or location',
            'Check resource availability in calendar view',
            'Fill out the booking form with required details',
            'Review booking details before submission',
            'Wait for admin approval if required',
            'Receive confirmation and calendar integration'
          ],
          category: 'booking',
          icon: '📅',
          difficulty: 'beginner'
        },
        {
          id: '3',
          title: 'Managing Your Bookings',
          description: 'View, edit, and manage your existing bookings',
          content: [
            'Access your booking history from the dashboard',
            'Filter bookings by status, date, or resource',
            'Edit booking details if changes are needed',
            'Cancel bookings that are no longer required',
            'Export booking data for external calendar applications'
          ],
          category: 'booking',
          icon: '📋',
          difficulty: 'intermediate'
        },
        {
          id: '4',
          title: 'Resource Management',
          description: 'Understanding available resources and their features',
          content: [
            'Browse different resource types (lecture halls, labs, meeting rooms)',
            'Check resource specifications and equipment',
            'View resource availability in real-time',
            'Understand booking rules and restrictions',
            'Contact support for special requirements'
          ],
          category: 'management',
          icon: '🏢',
          difficulty: 'beginner'
        },
        {
          id: '5',
          title: 'Notifications and Reminders',
          description: 'Stay informed about your bookings and system updates',
          content: [
            'Enable email notifications for booking updates',
            'Set up SMS reminders for upcoming bookings',
            'Configure push notifications in your browser',
            'Customize notification preferences',
            'Review notification history for missed updates'
          ],
          category: 'management',
          icon: '🔔',
          difficulty: 'intermediate'
        },
        {
          id: '6',
          title: 'Advanced Features',
          description: 'Explore advanced features for power users',
          content: [
            'Use advanced search with filters and autocomplete',
            'Create recurring bookings for regular events',
            'Generate detailed reports and analytics',
            'Integrate with external calendar applications',
            'Use API for custom integrations'
          ],
          category: 'advanced',
          icon: '⚡',
          difficulty: 'advanced'
        },
        {
          id: '7',
          title: 'Troubleshooting',
          description: 'Common issues and their solutions',
          content: [
            'Booking conflicts and how to resolve them',
            'Login and authentication issues',
            'Payment and billing problems',
            'Resource availability questions',
            'Technical support contact information'
          ],
          category: 'troubleshooting',
          icon: '🔧',
          difficulty: 'intermediate'
        }
      ];

      // Mock FAQs
      const mockFAQs: FAQ[] = [
        {
          id: '1',
          question: 'How do I create a booking?',
          answer: 'Navigate to the Bookings page, click "Create Booking", select your resource, choose date/time, provide purpose, and submit. You\'ll receive a confirmation email.',
          category: 'Booking',
          helpful: 45
        },
        {
          id: '2',
          question: 'What happens if my booking is rejected?',
          answer: 'If your booking is rejected, you\'ll receive an email with the reason. You can modify the booking details and resubmit, or contact the booking administrator for assistance.',
          category: 'Booking',
          helpful: 32
        },
        {
          id: '3',
          question: 'Can I cancel a booking?',
          answer: 'Yes, you can cancel your own bookings from the booking details page. For approved bookings, cancellation may have restrictions depending on the resource type and timing.',
          category: 'Booking',
          helpful: 28
        },
        {
          id: '4',
          question: 'How do I check resource availability?',
          answer: 'Use the Calendar view to see real-time availability, or check individual resource pages. You can filter by date range, resource type, or location.',
          category: 'Resource',
          helpful: 38
        },
        {
          id: '5',
          question: 'What are the booking rules?',
          answer: 'Booking rules vary by resource type. Generally, you must book at least 24 hours in advance, respect time limits, and follow department-specific guidelines.',
          category: 'Resource',
          helpful: 41
        },
        {
          id: '6',
          question: 'How do I enable notifications?',
          answer: 'Go to your Profile settings, select "Notifications", and choose your preferred notification methods (email, SMS, push). You can customize which events trigger notifications.',
          category: 'Account',
          helpful: 35
        },
        {
          id: '7',
          question: 'Can I book resources for others?',
          answer: 'This depends on your role and permissions. Faculty and staff can book for departmental events. Students can only book for personal use unless authorized otherwise.',
          category: 'Account',
          helpful: 22
        },
        {
          id: '8',
          question: 'What should I do if I encounter technical issues?',
          answer: 'Try refreshing the page, checking your internet connection, and clearing browser cache. If issues persist, contact IT support at support@campus.edu or use the help ticket system.',
          category: 'Technical',
          helpful: 51
        }
      ];

      // Mock tutorials
      const mockTutorials: Tutorial[] = [
        {
          id: '1',
          title: 'Complete Booking Workflow',
          description: 'Step-by-step guide from finding a resource to confirming your booking',
          duration: '10 minutes',
          difficulty: 'beginner',
          steps: [
            'Log in to your Smart Campus account',
            'Navigate to the Resources page',
            'Search for your desired resource',
            'Check availability in calendar view',
            'Click "Book Now" on your chosen resource',
            'Fill in the booking form with all required details',
            'Review your booking information',
            'Submit the booking request',
            'Wait for approval (if required)',
            'Receive confirmation and add to your calendar'
          ],
          category: 'Booking'
        },
        {
          id: '2',
          title: 'Advanced Search Techniques',
          description: 'Master the search functionality to find resources quickly',
          duration: '8 minutes',
          difficulty: 'intermediate',
          steps: [
            'Use the search bar with specific keywords',
            'Apply filters for resource type, capacity, and location',
            'Use date range filters for time-specific searches',
            'Save frequently used search combinations',
            'Use autocomplete for quick resource selection',
            'Sort results by relevance or availability',
            'Export search results for offline reference'
          ],
          category: 'Search'
        },
        {
          id: '3',
          title: 'Calendar Integration',
          description: 'Sync your bookings with external calendar applications',
          duration: '12 minutes',
          difficulty: 'intermediate',
          steps: [
            'Go to Profile > Calendar Integration',
            'Select your calendar application (Google Calendar, Outlook, etc.)',
            'Authorize the integration with your calendar account',
            'Choose which booking types to sync',
            'Set default reminder preferences',
            'Test the integration with a sample booking',
            'Troubleshoot common sync issues',
            'Manage multiple calendar integrations if needed'
          ],
          category: 'Integration'
        }
      ];

      setSections(mockSections);
      setFAQs(mockFAQs);
      setTutorials(mockTutorials);
    } catch (err) {
      setError('Failed to load guide data');
      console.error('Error fetching guide data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredSections = () => {
    return sections.filter(section => {
      const matchesSearch = !filter || 
        section.title.toLowerCase().includes(filter.toLowerCase()) ||
        section.description.toLowerCase().includes(filter.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || section.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
  };

  const getDifficultyColor = (difficulty: GuideSection['difficulty']) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-100';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100';
      case 'advanced':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: GuideSection['category']) => {
    switch (category) {
      case 'getting-started':
        return 'text-blue-600 bg-blue-100';
      case 'booking':
        return 'text-purple-600 bg-purple-100';
      case 'management':
        return 'text-green-600 bg-green-100';
      case 'troubleshooting':
        return 'text-orange-600 bg-orange-100';
      case 'advanced':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredSections = getFilteredSections();

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading user guide...</div>
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
          <h1 className="text-2xl font-bold text-gray-900">User Guide & Documentation</h1>
          <p className="text-gray-500">Complete guide to using the Smart Campus booking system</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => alert('Downloading PDF guide...')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            📥 Download PDF
          </button>
          <button
            onClick={() => alert('Opening video tutorials...')}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
          >
            🎥 Video Tutorials
          </button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-blue-600 text-white px-4 py-3 rounded hover:bg-blue-700 transition-colors">
            📚 Getting Started
          </button>
          <button className="bg-purple-600 text-white px-4 py-3 rounded hover:bg-purple-700 transition-colors">
            📅 Booking Guide
          </button>
          <button className="bg-green-600 text-white px-4 py-3 rounded hover:bg-green-700 transition-colors">
            🔧 Troubleshooting
          </button>
          <button className="bg-orange-600 text-white px-4 py-3 rounded hover:bg-orange-700 transition-colors">
            📞 Contact Support
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search Guide</label>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search guide sections..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="getting-started">Getting Started</option>
              <option value="booking">Booking</option>
              <option value="management">Management</option>
              <option value="troubleshooting">Troubleshooting</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredSections.length} of {sections.length} sections
          </div>
        </div>
      </div>

      {/* Guide Sections */}
      <div className="space-y-4 mb-6">
        {filteredSections.map((section) => (
          <div key={section.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Section Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{section.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(section.category)}`}>
                        {section.category.replace('-', ' ').toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(section.difficulty)}`}>
                        {section.difficulty.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSection(section)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  👁️ View Details
                </button>
              </div>

              {/* Section Description */}
              <p className="text-gray-600 mb-4">{section.description}</p>

              {/* Section Content Preview */}
              <div className="space-y-2">
                {section.content.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-700 text-sm">{item}</span>
                  </div>
                ))}
                {section.content.length > 3 && (
                  <div className="text-sm text-gray-500 italic">
                    ... and {section.content.length - 3} more items
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <div key={faq.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-700 text-sm">{faq.answer}</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{faq.category}</span>
                  <span>👍 {faq.helpful}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tutorials Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Step-by-Step Tutorials</h2>
        <div className="space-y-4">
          {tutorials.map((tutorial) => (
            <div key={tutorial.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{tutorial.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{tutorial.description}</p>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                    {tutorial.difficulty.toUpperCase()}
                  </span>
                  <span className="text-gray-500">⏱️ {tutorial.duration}</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Steps:</h4>
                <ol className="space-y-1 text-sm text-gray-700">
                  {tutorial.steps.map((step, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-600 font-medium">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Need More Help?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">📧 Email Support</h3>
            <div className="space-y-2 text-sm">
              <div>support@smartcampus.edu</div>
              <div>Response time: 24 hours</div>
              <div>Available: Monday-Friday, 9AM-5PM</div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">📞 Phone Support</h3>
            <div className="space-y-2 text-sm">
              <div>+1 (555) 123-4567</div>
              <div>Emergency: +1 (555) 123-4568</div>
              <div>Available: 24/7 for emergencies</div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">💬 Live Chat</h3>
            <div className="space-y-2 text-sm">
              <div>Available on the website</div>
              <div>Response time: 5 minutes</div>
              <div>Available: Monday-Friday, 8AM-6PM</div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">🏢 On-Site Support</h3>
            <div className="space-y-2 text-sm">
              <div>IT Help Desk - Building A, Room 101</div>
              <div>Available: Monday-Friday, 9AM-5PM</div>
              <div>Walk-ins welcome</div>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={() => alert('Opening knowledge base...')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              📚 Knowledge Base
            </button>
            <button
              onClick={() => alert('Opening community forum...')}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            >
              👥 Community Forum
            </button>
            <button
              onClick={() => alert('Opening system status...')}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
            >
              📊 System Status
            </button>
          </div>
        </div>
      </div>

      {/* Section Details Modal */}
      {selectedSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">{selectedSection.title}</h2>
                <button
                  onClick={() => setSelectedSection(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedSection.category)}`}>
                    {selectedSection.category.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedSection.difficulty)}`}>
                    {selectedSection.difficulty.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-700">{selectedSection.description}</p>
                <div className="space-y-2">
                  {selectedSection.content.map((item, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
