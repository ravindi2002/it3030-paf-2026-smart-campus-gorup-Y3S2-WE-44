import { useNavigate } from 'react-router-dom';

export default function CreateBooking() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Booking</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500">Booking form coming soon...</p>
        <button onClick={() => navigate('/bookings')} className="mt-4 bg-gray-200 px-4 py-2 rounded">
          Back
        </button>
      </div>
    </div>
  );
}