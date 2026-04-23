import { Booking, BookingStatus } from '../types/Booking';

interface BookingStatusManagerProps {
  booking: Booking;
  onStatusChange: (id: number, status: BookingStatus, reason?: string) => void;
  loading?: boolean;
}

export default function BookingStatusManager({ 
  booking, 
  onStatusChange, 
  loading = false 
}: BookingStatusManagerProps) {
  const handleApprove = () => {
    onStatusChange(booking.id, BookingStatus.APPROVED);
  };

  const handleReject = () => {
    const reason = prompt('Enter rejection reason:');
    if (reason !== null) {
      onStatusChange(booking.id, BookingStatus.REJECTED, reason);
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      onStatusChange(booking.id, BookingStatus.CANCELLED);
    }
  };

  
  const getNextStatuses = () => {
    switch (booking.status) {
      case BookingStatus.PENDING:
        return [
          { status: BookingStatus.APPROVED, label: 'Approve', color: 'green', action: handleApprove },
          { status: BookingStatus.REJECTED, label: 'Reject', color: 'red', action: handleReject },
          { status: BookingStatus.CANCELLED, label: 'Cancel', color: 'gray', action: handleCancel },
        ];
      case BookingStatus.APPROVED:
        return [
          { status: BookingStatus.CANCELLED, label: 'Cancel', color: 'gray', action: handleCancel },
        ];
      case BookingStatus.REJECTED:
        return [
          { status: BookingStatus.PENDING, label: 'Reset to Pending', color: 'yellow', action: () => onStatusChange(booking.id, BookingStatus.PENDING) },
        ];
      default:
        return [];
    }
  };

  const statusColors = {
    [BookingStatus.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    [BookingStatus.APPROVED]: 'bg-green-100 text-green-800 border-green-200',
    [BookingStatus.REJECTED]: 'bg-red-100 text-red-800 border-red-200',
    [BookingStatus.CANCELLED]: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const buttonColors: Record<string, string> = {
    green: 'bg-green-500 hover:bg-green-600 text-white',
    red: 'bg-red-500 hover:bg-red-600 text-white',
    yellow: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    gray: 'bg-gray-500 hover:bg-gray-600 text-white',
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-semibold text-gray-900 mb-3">Status Management</h3>
      
      {/* Current Status */}
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Current Status:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[booking.status]}`}>
            {booking.status}
          </span>
        </div>
        {booking.rejectionReason && (
          <div className="mt-2 text-sm text-red-700">
            <span className="font-medium">Rejection Reason:</span> {booking.rejectionReason}
          </div>
        )}
      </div>

      {/* Status Actions */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700 mb-2">Available Actions:</div>
        <div className="flex flex-wrap gap-2">
          {getNextStatuses().map(({ status, label, color, action }) => (
            <button
              key={status}
              onClick={action}
              disabled={loading}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${buttonColors[color]}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Status Timeline */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-sm font-medium text-gray-700 mb-2">Timeline:</div>
        <div className="space-y-1 text-xs text-gray-600">
          <div>Created: {new Date(booking.createdAt).toLocaleString()}</div>
          {booking.updatedAt !== booking.createdAt && (
            <div>Last Updated: {new Date(booking.updatedAt).toLocaleString()}</div>
          )}
          {booking.approvedBy && (
            <div>Processed by User ID: {booking.approvedBy}</div>
          )}
        </div>
      </div>
    </div>
  );
}
