import { useState, useEffect, useRef } from 'react';
import { bookingService } from '../services/bookingService';
import { Booking, BookingStatus } from '../types/Booking';

interface SearchFilters {
  query: string;
  userId?: number;
  resourceId?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  purpose?: string;
}

interface AdvancedSearchProps {
  onSearch: (results: Booking[]) => void;
  onFiltersChange?: (filters: SearchFilters) => void;
  placeholder?: string;
  showAdvanced?: boolean;
}

export default function AdvancedSearch({ 
  onSearch, 
  onFiltersChange, 
  placeholder = "Search bookings...", 
  showAdvanced = true 
}: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    userId: undefined,
    resourceId: undefined,
    status: '',
    startDate: '',
    endDate: '',
    purpose: ''
  });
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularSearches] setPopularSearches] = useState<string[]>([
    'Lecture Hall',
    'Computer Lab',
    'Meeting Room',
    'Projector Room',
    'Study Room',
    'Conference Room'
  ]);

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mock data for autocomplete
  const allBookings: Booking[] = [
    {
      id: 1,
      userId: 1,
      userName: "John Doe",
      resourceId: 1,
      resourceName: "Lecture Hall A",
      startTime: "2024-04-25T10:00:00",
      endTime: "2024-04-25T12:00:00",
      purpose: "Programming Lecture",
      status: BookingStatus.APPROVED,
      expectedAttendees: 50,
      createdAt: "2024-04-24T10:00:00",
      updatedAt: "2024-04-24T10:00:00"
    },
    {
      id: 2,
      userId: 2,
      userName: "Jane Smith",
      resourceId: 2,
      resourceName: "Computer Lab 101",
      startTime: "2024-04-26T14:00:00",
      endTime: "2024-04-26T16:00:00",
      purpose: "Lab Session",
      status: BookingStatus.PENDING,
      expectedAttendees: 30,
      createdAt: "2024-04-24T11:00:00",
      updatedAt: "2024-04-24T11:00:00"
    },
    {
      id: 3,
      userId: 1,
      userName: "John Doe",
      resourceId: 3,
      resourceName: "Meeting Room B",
      startTime: "2024-04-27T09:00:00",
      endTime: "2024-04-27T11:00:00",
      purpose: "Team Meeting",
      status: BookingStatus.REJECTED,
      rejectionReason: "Time slot already booked",
      expectedAttendees: 12,
      createdAt: "2024-04-24T09:00:00",
      updatedAt: "2024-04-24T10:00:00"
    }
  ];

  const generateSuggestions = (input: string) => {
    if (!input || input.length < 2) {
      setSuggestions([]);
      return;
    }

    const lowerInput = input.toLowerCase();
    const filteredSuggestions = new Set<string>();

    // Generate suggestions from various sources
    allBookings.forEach(booking => {
      // Resource name suggestions
      if (booking.resourceName.toLowerCase().includes(lowerInput)) {
        filteredSuggestions.add(booking.resourceName);
      }
      // Purpose suggestions
      if (booking.purpose && booking.purpose.toLowerCase().includes(lowerInput)) {
        filteredSuggestions.add(booking.purpose);
      }
      // User name suggestions
      if (booking.userName.toLowerCase().includes(lowerInput)) {
        filteredSuggestions.add(booking.userName);
      }
    });

    // Add popular searches that match
    popularSearches.forEach(popular => {
      if (popular.toLowerCase().includes(lowerInput)) {
        filteredSuggestions.add(popular);
      }
    });

    // Add common booking terms
    const commonTerms = ['booking', 'reservation', 'schedule', 'appointment', 'meeting', 'lecture', 'lab', 'class'];
    commonTerms.forEach(term => {
      if (term.includes(lowerInput)) {
        filteredSuggestions.add(term);
      }
    });

    setSuggestions(Array.from(filteredSuggestions).slice(0, 8));
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    generateSuggestions(value);
    setShowSuggestions(value.length > 1);
    
    const newFilters = { ...filters, query: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
    
    const newFilters = { ...filters, query: suggestion };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setShowSuggestions(false);

    try {
      // Mock search - in real app, this would call booking service
      const searchResults = allBookings.filter(booking => {
        const matchesQuery = !query || 
          booking.resourceName.toLowerCase().includes(query.toLowerCase()) ||
          booking.purpose?.toLowerCase().includes(query.toLowerCase()) ||
          booking.userName.toLowerCase().includes(query.toLowerCase());

        const matchesFilters = 
          (!filters.userId || booking.userId === filters.userId) &&
          (!filters.resourceId || booking.resourceId === filters.resourceId) &&
          (!filters.status || booking.status === filters.status) &&
          (!filters.startDate || new Date(booking.startTime) >= new Date(filters.startDate)) &&
          (!filters.endDate || new Date(booking.endTime) <= new Date(filters.endDate)) &&
          (!filters.purpose || (booking.purpose && booking.purpose.toLowerCase().includes(filters.purpose.toLowerCase())));

        return matchesQuery && matchesFilters;
      });

      // Add to recent searches
      setRecentSearches(prev => {
        const updated = [query, ...prev.filter(s => s !== query)].slice(0, 5);
        return updated;
      });

      onSearch(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      query: '',
      userId: undefined,
      resourceId: undefined,
      status: '',
      startDate: '',
      endDate: '',
      purpose: ''
    };
    setFilters(clearedFilters);
    setQuery('');
    setShowSuggestions(false);
    setSuggestions([]);
    onFiltersChange?.(clearedFilters);
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.APPROVED:
        return 'text-green-600 bg-green-100';
      case BookingStatus.PENDING:
        return 'text-yellow-600 bg-yellow-100';
      case BookingStatus.REJECTED:
        return 'text-red-600 bg-red-100';
      case BookingStatus.CANCELLED:
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div ref={searchRef} className="relative">
        {/* Main Search Input */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyPress}
              onFocus={() => setShowSuggestions(query.length > 1)}
              placeholder={placeholder}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            
            {/* Search Icon */}
            <div className="absolute right-3 top-1/2 text-gray-400">
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 7-7 7 7v14a7 7 0 0 7-7 7-7H7a7 7 0 0-7 7-7 7v14a7 7 0 0 7 7 7z" />
                </svg>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                <div className="p-2">
                  <div className="text-xs text-gray-500 mb-2">Suggestions</div>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer rounded flex items-center justify-between"
                    >
                      <span className="text-sm">{suggestion}</span>
                      <span className="text-xs text-gray-400">⌘</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Advanced Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* User Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                <input
                  type="number"
                  value={filters.userId || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, userId: e.target.value ? parseInt(e.target.value) : undefined }))}
                  placeholder="Enter user ID"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Resource Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resource</label>
                <select
                  value={filters.resourceId || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, resourceId: e.target.value ? parseInt(e.target.value) : undefined }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Resources</option>
                  <option value="1">Lecture Hall A</option>
                  <option value="2">Computer Lab 101</option>
                  <option value="3">Meeting Room B</option>
                  <option value="4">Projector Room C</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value={BookingStatus.APPROVED}>Approved</option>
                  <option value={BookingStatus.PENDING}>Pending</option>
                  <option value={BookingStatus.REJECTED}>Rejected</option>
                  <option value={BookingStatus.CANCELLED}>Cancelled</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="datetime-local"
                  value={filters.startDate || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="datetime-local"
                  value={filters.endDate || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Purpose Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <input
                  type="text"
                  value={filters.purpose || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, purpose: e.target.value }))}
                  placeholder="Search in purpose"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h4>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <button
                  key={search}
                  onClick={() => handleSuggestionClick(search)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
                >
                  🕐 {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Searches */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Searches</h4>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((search, index) => (
              <button
                key={search}
                onClick={() => handleSuggestionClick(search)}
                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200 transition-colors"
              >
                🔥 {search}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
