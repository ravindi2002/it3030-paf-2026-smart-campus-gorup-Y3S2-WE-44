import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import BookingForm from '../components/BookingForm';
import { useAuth } from '../hooks/useAuth';

export default function CreateBooking() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: any) => {
    try {
      const userId = (user as any)?.id || 1;
      await bookingService.create(data, userId);
      navigate('/bookings');
    } catch (err) {
      setError('Failed to create booking');
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Booking</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <BookingForm onSubmit={handleSubmit} onCancel={() => navigate('/bookings')} />
    </div>
  );
}