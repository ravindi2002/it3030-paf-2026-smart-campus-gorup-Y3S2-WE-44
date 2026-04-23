import { Booking, BookingStatus } from '../types/Booking';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: number) => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number, reason?: string) => void;
  isAdmin?: boolean;
  currentUserId?: number;
}

const statusColors = {
  [BookingStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [BookingStatus.APPROVED]: 'bg-green-100 text-green-800',
  [BookingStatus.REJECTED]: 'bg-red-100 text-red-800',
  [BookingStatus.CANCELLED]: 'bg-gray-100 text-gray-800',
};

const statusIcons = {
  [BookingStatus.PENDING]: '⏳',
  [BookingStatus.APPROVED]: '✅',
  [BookingStatus.REJECTED]: '❌',
  [BookingStatus.CANCELLED]: '🚫',
};

export default function BookingCard({ 
  booking, 
  onCancel, 
  onApprove, 
  onReject, 
  isAdmin = false,
  currentUserId 
}: BookingCardProps) {
  const canCancel = currentUserId === booking.userId && 
    (booking.status === BookingStatus.PENDING || booking.status === BookingStatus.APPROVED);
  
  const canApproveReject = isAdmin && booking.status === BookingStatus.PENDING;

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateTimeString;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{booking.resourceName}</h3>
          <p className="text-sm text-gray-600 mt-1">Booked by: {booking.userName}</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg">{statusIcons[booking.status]}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
            {booking.status}
          </span>
        </div>
      </div>

      {/* Booking Details */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-700">
          <span className="font-medium mr-2">📅 Start:</span>
          <span>{formatDateTime(booking.startTime)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-700">
          <span className="font-medium mr-2">🏁 End:</span>
          <span>{formatDateTime(booking.endTime)}</span>
        </div>
        {booking.expectedAttendees && (
          <div className="flex items-center text-sm text-gray-700">
            <span className="font-medium mr-2">👥 Attendees:</span>
            <span>{booking.expectedAttendees}</span>
          </div>
        )}
        {booking.purpose && (
          <div className="text-sm text-gray-700">
            <span className="font-medium">📋 Purpose:</span>
            <p className="mt-1 text-gray-600 italic">{booking.purpose}</p>
          </div>
        )}
        {booking.rejectionReason && (
          <div className="text-sm text-red-700 bg-red-50 p-2 rounded">
            <span className="font-medium">📝 Rejection Reason:</span>
            <p className="mt-1">{booking.rejectionReason}</p>
          </div>
        )}
      </div>

      {/* Timestamps */}
      <div className="text-xs text-gray-500 border-t pt-2 mb-4">
        <div>Created: {formatDateTime(booking.createdAt)}</div>
        {booking.updatedAt !== booking.createdAt && (
          <div>Updated: {formatDateTime(booking.updatedAt)}</div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        {canCancel && onCancel && (
          <button
            onClick={() => onCancel(booking.id)}
            className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        )}
        
        {canApproveReject && (
          <>
            {onApprove && (
              <button
                onClick={() => onApprove(booking.id)}
                className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
              >
                Approve
              </button>
            )}
            {onReject && (
              <button
                onClick={() => {
                  const reason = prompt('Enter rejection reason (optional):');
                  onReject(booking.id, reason || undefined);
                }}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
              >
                Reject
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
