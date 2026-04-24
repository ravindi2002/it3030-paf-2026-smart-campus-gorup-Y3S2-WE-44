import { useState, useEffect } from 'react';
import { BookingRequest, Resource } from '../types/Booking';

interface BookingFormProps {
  resources: Resource[];
  onSubmit: (booking: BookingRequest) => void;
  onCancel: () => void;
  loading?: boolean;
  initialData?: Partial<BookingRequest>;
  onConflictCheck?: (resourceId: number, startTime: string, endTime: string) => Promise<boolean>;
}

export default function BookingForm({ 
  resources, 
  onSubmit, 
  onCancel, 
  loading = false,
  initialData,
  onConflictCheck 
}: BookingFormProps) {
  const [formData, setFormData] = useState<Partial<BookingRequest>>(initialData || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Check conflicts when relevant fields change
  useEffect(() => {
    if (onConflictCheck && formData.resourceId && formData.startTime && formData.endTime) {
      const timeoutId = setTimeout(() => {
        checkConflicts();
      }, 500); // Debounce conflict checking

      return () => clearTimeout(timeoutId);
    } else {
      setConflictWarning(null);
    }
  }, [formData.resourceId, formData.startTime, formData.endTime]);

  const checkConflicts = async () => {
    if (!onConflictCheck || !formData.resourceId || !formData.startTime || !formData.endTime) {
      return;
    }

    try {
      const hasConflict = await onConflictCheck(
        formData.resourceId, 
        formData.startTime, 
        formData.endTime
      );
      
      if (hasConflict) {
        setConflictWarning('⚠️ This resource is already booked for the selected time period. Please choose a different time.');
      } else {
        setConflictWarning(null);
      }
    } catch (err) {
      console.error('Error checking conflicts:', err);
      setConflictWarning(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.resourceId) {
      newErrors.resourceId = 'Please select a resource';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    } else if (formData.startTime && new Date(formData.startTime) <= new Date()) {
      newErrors.startTime = 'Start time must be in the future';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    } else if (formData.endTime && formData.startTime && new Date(formData.endTime) <= new Date(formData.startTime)) {
      newErrors.endTime = 'End time must be after start time';
    }

    if (!formData.purpose || formData.purpose.trim().length < 3) {
      newErrors.purpose = 'Purpose must be at least 3 characters long';
    }

    if (formData.expectedAttendees !== undefined && formData.expectedAttendees <= 0) {
      newErrors.expectedAttendees = 'Expected attendees must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    
    if (validateForm()) {
      console.log('Form validation passed, submitting booking...');
      // Ensure all required fields are present before submitting
      const bookingData: BookingRequest = {
        resourceId: formData.resourceId!,
        startTime: formData.startTime!,
        endTime: formData.endTime!,
        purpose: formData.purpose!,
        expectedAttendees: formData.expectedAttendees || 1
      };
      onSubmit(bookingData);
    } else {
      console.log('Form validation failed:', errors);
    }
  };

  const handleChange = (field: keyof BookingRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const formatDateTimeForInput = (dateTimeString: string | undefined) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    // Format as YYYY-MM-DDTHH:MM for datetime-local input
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Conflict Warning */}
      {conflictWarning && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-lg">⚠️</span>
            </div>
            <div className="ml-3">
              <div className="text-sm font-medium">Scheduling Conflict Detected</div>
              <div className="text-sm mt-1">{conflictWarning}</div>
            </div>
          </div>
        </div>
      )}

      {/* Resource Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resource *
        </label>
        <select
          value={formData.resourceId}
          onChange={(e) => handleChange('resourceId', parseInt(e.target.value))}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.resourceId ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loading}
        >
          <option value={0}>Select a resource...</option>
          {resources.map(resource => (
            <option key={resource.id} value={resource.id}>
              {resource.name} ({resource.type}) - {resource.location} - Capacity: {resource.capacity}
            </option>
          ))}
        </select>
        {errors.resourceId && (
          <p className="mt-1 text-sm text-red-600">{errors.resourceId}</p>
        )}
      </div>

      {/* Start Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Start Time *
        </label>
        <input
          type="datetime-local"
          value={formatDateTimeForInput(formData.startTime)}
          onChange={(e) => handleChange('startTime', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.startTime ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loading}
        />
        {errors.startTime && (
          <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>
        )}
      </div>

      {/* End Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          End Time *
        </label>
        <input
          type="datetime-local"
          value={formatDateTimeForInput(formData.endTime)}
          onChange={(e) => handleChange('endTime', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.endTime ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={loading}
        />
        {errors.endTime && (
          <p className="mt-1 text-sm text-red-600">{errors.endTime}</p>
        )}
      </div>

      {/* Expected Attendees */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Expected Attendees (Optional)
        </label>
        <input
          type="number"
          min="1"
          value={formData.expectedAttendees || ''}
          onChange={(e) => handleChange('expectedAttendees', e.target.value ? parseInt(e.target.value) : 0)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.expectedAttendees ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Enter number of expected attendees"
          disabled={loading}
        />
        {errors.expectedAttendees && (
          <p className="mt-1 text-sm text-red-600">{errors.expectedAttendees}</p>
        )}
      </div>

      {/* Purpose */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Purpose *
        </label>
        <textarea
          value={formData.purpose || ''}
          onChange={(e) => handleChange('purpose', e.target.value)}
          rows={4}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.purpose ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe the purpose of this booking..."
          disabled={loading}
        />
        {errors.purpose && (
          <p className="mt-1 text-sm text-red-600">{errors.purpose}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : initialData ? 'Update Booking' : 'Create Booking'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
