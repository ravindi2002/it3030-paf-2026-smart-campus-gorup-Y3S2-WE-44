import { useState } from 'react';
import { Booking, BookingStatus } from '../types/Booking';

interface BookingCalendarProps {
  bookings: Booking[];
  onDateClick?: (date: Date, dateBookings: Booking[]) => void;
}

export default function BookingCalendar({ bookings, onDateClick }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50 border border-gray-100 rounded-lg"></div>);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = new Date(year, month, d).toISOString().split('T')[0];
    
    // Find bookings for this day
    const dayBookings = bookings.filter(b => {
      const bookingDate = new Date(b.startTime).toISOString().split('T')[0];
      return bookingDate === dateStr;
    });

    const isToday = new Date().toISOString().split('T')[0] === dateStr;

    days.push(
      <div 
        key={`day-${d}`} 
        className={`h-24 p-2 border rounded-lg flex flex-col relative overflow-hidden transition-all hover:shadow-md cursor-pointer
          ${isToday ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 bg-white hover:border-blue-300'}
        `}
        onClick={() => onDateClick && onDateClick(new Date(year, month, d), dayBookings)}
      >
        <div className="flex justify-between items-start mb-1">
          <span className={`text-sm font-semibold ${isToday ? 'text-blue-600 bg-blue-100 w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-700'}`}>
            {d}
          </span>
          {dayBookings.length > 0 && (
            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 rounded-full font-medium">
              {dayBookings.length}
            </span>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden space-y-1 pr-1 custom-scrollbar">
          {dayBookings.slice(0, 3).map((booking, idx) => {
            let colorClass = 'bg-gray-100 text-gray-700 border-gray-200';
            if (booking.status === BookingStatus.APPROVED) colorClass = 'bg-green-100 text-green-700 border-green-200';
            if (booking.status === BookingStatus.PENDING) colorClass = 'bg-yellow-100 text-yellow-700 border-yellow-200';
            if (booking.status === BookingStatus.REJECTED) colorClass = 'bg-red-100 text-red-700 border-red-200';

            return (
              <div 
                key={booking.id || idx} 
                className={`text-[10px] leading-tight truncate px-1.5 py-0.5 rounded border ${colorClass}`}
                title={`${booking.resourceName} - ${booking.userName}`}
              >
                {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} {booking.resourceName}
              </div>
            );
          })}
          {dayBookings.length > 3 && (
            <div className="text-[10px] text-gray-500 text-center font-medium">
              +{dayBookings.length - 3} more
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span>📅</span> Bookings Calendar
        </h2>
        <div className="flex items-center gap-4">
          <button 
            onClick={prevMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-900"
          >
            ←
          </button>
          <span className="text-lg font-semibold w-40 text-center">
            {monthNames[month]} {year}
          </span>
          <button 
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-900"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-3 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-3">
        {days}
      </div>
    </div>
  );
}
