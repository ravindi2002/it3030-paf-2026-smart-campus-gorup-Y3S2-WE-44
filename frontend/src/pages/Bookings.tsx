import { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings').then(res => setBookings(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <a href="/bookings/create" className="bg-blue-600 text-white px-4 py-2 rounded">
          New Booking
        </a>
      </div>
      {loading ? <p>Loading...</p> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookings.map(b => (
            <div key={b.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold">{b.resourceName}</h3>
              <p className="text-gray-600 text-sm">{b.userName}</p>
              <p className="text-sm text-gray-500 mt-2">{b.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}