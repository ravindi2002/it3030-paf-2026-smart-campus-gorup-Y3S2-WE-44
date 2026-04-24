import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BookingForm from '../components/BookingForm';
import { bookingService } from '../services/bookingService';
import { BookingRequest, Resource } from '../types/Booking';

export default function CreateBooking() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      // Mock resources data - in a real app, you'd fetch from resources API
      const mockResources: Resource[] = [
        {
          id: 1,
          name: 'Lecture Hall A',
          type: 'Lecture Hall',
          capacity: 150,
          location: 'Building 1, Floor 2',
          status: 'ACTIVE'
        },
        {
          id: 2,
          name: 'Computer Lab 101',
          type: 'Computer Lab',
          capacity: 30,
          location: 'Building 2, Floor 1',
          status: 'ACTIVE'
        },
        {
          id: 3,
          name: 'Meeting Room B',
          type: 'Meeting Room',
          capacity: 12,
          location: 'Building 3, Floor 3',
          status: 'ACTIVE'
        },
        {
          id: 4,
          name: 'Projector Room C',
          type: 'Equipment Room',
          capacity: 5,
          location: 'Building 1, Floor 1',
          status: 'ACTIVE'
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

  const handleSubmit = async (booking: BookingRequest) => {
    try {
      setSubmitting(true);
      setError(null);
      
      // In a real app, you'd get the current user ID from auth context
      const currentUserId = 1; // Mock user ID
      
      console.log('Creating booking with data:', booking);
      
      // Format the booking data properly - remove userId and status from body
      // Format dates to include seconds for backend LocalDateTime compatibility
      const formatDateTimeForBackend = (dateTimeString: string) => {
        if (!dateTimeString) return dateTimeString;
        // Convert YYYY-MM-DDTHH:MM to YYYY-MM-DDTHH:MM:SS
        return dateTimeString.length === 16 ? `${dateTimeString}:00` : dateTimeString;
      };

      const bookingData = {
        resourceId: booking.resourceId,
        startTime: formatDateTimeForBackend(booking.startTime),
        endTime: formatDateTimeForBackend(booking.endTime),
        purpose: booking.purpose,
        expectedAttendees: booking.expectedAttendees
      };
      
      const result = await bookingService.createBooking(bookingData, currentUserId);
      console.log('Booking created successfully:', result);
      
      setSuccess(true);
      
      // Show success message and redirect after delay
      setTimeout(() => {
        navigate('/bookings');
      }, 3000);
      
    } catch (err: any) {
      console.error('Error creating booking:', err);
      let errorMessage = 'Failed to create booking';
      
      if (err.response) {
        console.error('Response error:', err.response.data);
        errorMessage = err.response.data?.message || errorMessage;
      } else if (err.request) {
        console.error('Request error:', err.request);
        errorMessage = 'Network error - please check if the server is running';
      } else {
        console.error('General error:', err.message);
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
      
      // Clear error after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/bookings');
  };

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading resources...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">New Booking</h1>
        <button
          onClick={handleCancel}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
        >
          Back to Bookings
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          <div className="font-medium">Booking Created Successfully!</div>
          <div className="text-sm mt-1">Redirecting to bookings list...</div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          <div className="font-medium">Error</div>
          <div className="text-sm mt-1">{error}</div>
        </div>
      )}

      {/* Booking Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Booking Details</h2>
          <p className="text-sm text-gray-600 mt-1">
            Fill in the details below to create a new booking request.
          </p>
        </div>

        {resources.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500">No resources available for booking</div>
          </div>
        ) : (
          <BookingForm
            resources={resources}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={submitting}
          />
        )}
      </div>
    </div>
  );
}
