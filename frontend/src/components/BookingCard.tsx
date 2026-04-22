import { Booking } from '../types/Booking';
import { formatDate } from '../utils/formatDate';
import StatusBadge from './StatusBadge';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: number) => void;
  onApprove?: (id: number) => void;
}

export default function BookingCard({ booking, onCancel, onApprove }: BookingCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{booking.resourceName}</h3>
          <p className="text-gray-600 text-sm">Booked by: {booking.userName}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-sm">
          <span className="text-gray-500">From:</span> {formatDate(booking.startTime)}
        </p>
        <p className="text-sm">
          <span className="text-gray-500">To:</span> {formatDate(booking.endTime)}
        </p>
        {booking.purpose && <p className="text-sm text-gray-600 mt-2">{booking.purpose}</p>}
      </div>
      <div className="flex gap-2 mt-4">
        {onApprove && booking.status === 'PENDING' && (
          <button onClick={() => onApprove(booking.id!)} className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
            Approve
          </button>
        )}
        {onCancel && booking.status === 'PENDING' && (
          <button onClick={() => onCancel(booking.id!)} className="text-red-600 hover:underline text-sm">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}