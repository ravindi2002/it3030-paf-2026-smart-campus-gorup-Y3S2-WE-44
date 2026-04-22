import { useState, useEffect } from 'react';
import { bookingService } from '../services/bookingService';
import { Booking } from '../types/Booking';
import BookingCard from '../components/BookingCard';

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getAll().then(setBookings).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id: number) => {
    if (confirm('Cancel this booking?')) {
      await bookingService.updateStatus(id, 'CANCELLED');
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED' } : b));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <a href="/bookings/create" className="bg-blue-600 text-white px-4 py-2 rounded">
          New Booking
        </a>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map(booking => (
            <BookingCard key={booking.id} booking={booking} onCancel={handleCancel} />
          ))}
        </div>
      )}
    </div>
  );
}