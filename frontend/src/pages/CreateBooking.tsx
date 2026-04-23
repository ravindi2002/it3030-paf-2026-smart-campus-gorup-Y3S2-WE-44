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
      
      await bookingService.createBooking(booking, currentUserId);
      setSuccess(true);
      
      // Redirect to bookings list after successful creation
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create booking');
      console.error('Error creating booking:', err);
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

      {/* Help Information */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Booking Information</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• All bookings are initially created as <strong>PENDING</strong></li>
          <li>• Admin approval is required before the booking becomes active</li>
          <li>• You can cancel your own bookings if they are PENDING or APPROVED</li>
          <li>• Bookings cannot overlap for the same resource</li>
          <li>• Start time must be in the future</li>
        </ul>
      </div>
    </div>
  );
}