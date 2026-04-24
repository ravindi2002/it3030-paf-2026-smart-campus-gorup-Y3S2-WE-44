import { useState, useMemo } from 'react';
import { Booking, BookingStatus } from '../types/Booking';

interface BookingCalendarProps {
  bookings: Booking[];
  onBookingClick?: (booking: Booking) => void;
  onDateClick?: (date: Date) => void;
}

interface CalendarDay {
  date: Date;
  bookings: Booking[];
  isCurrentMonth: boolean;
  isToday: boolean;
}

export default function BookingCalendar({ 
  bookings, 
  onBookingClick, 
  onDateClick 
}: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const statusColors = {
    [BookingStatus.PENDING]: 'bg-yellow-200 border-yellow-400 text-yellow-800',
    [BookingStatus.APPROVED]: 'bg-green-200 border-green-400 text-green-800',
    [BookingStatus.REJECTED]: 'bg-red-200 border-red-400 text-red-800',
    [BookingStatus.CANCELLED]: 'bg-gray-200 border-gray-400 text-gray-800',
  };

  const statusDotColors = {
    [BookingStatus.PENDING]: 'bg-yellow-500',
    [BookingStatus.APPROVED]: 'bg-green-500',
    [BookingStatus.REJECTED]: 'bg-red-500',
    [BookingStatus.CANCELLED]: 'bg-gray-500',
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.startTime);
        return (
          bookingDate.getDate() === date.getDate() &&
          bookingDate.getMonth() === date.getMonth() &&
          bookingDate.getFullYear() === date.getFullYear()
        );
      });

      days.push({
        date,
        bookings: dayBookings,
        isCurrentMonth: date.getMonth() === month,
        isToday: 
          date.getDate() === today.getDate() &&
          date.getMonth() === today.getMonth() &&
          date.getFullYear() === today.getFullYear(),
      });
    }
    
    return days;
  }, [currentDate, bookings]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (date: CalendarDay) => {
    setSelectedDate(date.date);
    onDateClick?.(date.date);
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const getBookingCountByStatus = (dayBookings: Booking[]) => {
    return dayBookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {} as Record<BookingStatus, number>);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ←
        </button>
        <h2 className="text-xl font-bold text-gray-900">
          {formatMonth(currentDate)}
        </h2>
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          →
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const bookingCountByStatus = getBookingCountByStatus(day.bookings);
          const totalBookings = day.bookings.length;
          
          return (
            <div
              key={index}
              onClick={() => handleDateClick(day)}
              className={`
                min-h-[80px] p-2 border rounded-lg cursor-pointer transition-all
                ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                ${day.isToday ? 'border-blue-500 border-2' : 'border-gray-200'}
                ${selectedDate?.toDateString() === day.date.toDateString() ? 'bg-blue-50' : ''}
                hover:bg-gray-50 hover:border-gray-300
              `}
            >
              {/* Date Number */}
              <div className={`
                text-sm font-medium mb-1
                ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${day.isToday ? 'text-blue-600' : ''}
              `}>
                {day.date.getDate()}
              </div>

              {/* Booking Indicators */}
              {totalBookings > 0 && (
                <div className="space-y-1">
                  {/* Status dots */}
                  <div className="flex space-x-1">
                    {Object.entries(bookingCountByStatus).map(([status, count]) => (
                      <div
                        key={status}
                        className={`w-2 h-2 rounded-full ${statusDotColors[status as BookingStatus]}`}
                        title={`${count} ${status.toLowerCase()}`}
                      />
                    ))}
                  </div>
                  
                  {/* Booking count */}
                  <div className="text-xs text-gray-600">
                    {totalBookings} booking{totalBookings !== 1 ? 's' : ''}
                  </div>
                </div>
              )}

              {/* Quick booking preview */}
              {day.bookings.length > 0 && day.bookings.length <= 2 && (
                <div className="mt-1 space-y-1">
                  {day.bookings.slice(0, 2).map(booking => (
                    <div
                      key={booking.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookingClick?.(booking);
                      }}
                      className={`text-xs p-1 rounded truncate cursor-pointer ${statusColors[booking.status]}`}
                      title={`${booking.resourceName} - ${booking.userName}`}
                    >
                      {booking.resourceName}
                    </div>
                  ))}
                </div>
              )}

              {/* More bookings indicator */}
              {day.bookings.length > 2 && (
                <div className="text-xs text-gray-500 mt-1">
                  +{day.bookings.length - 2} more
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Status Legend</h3>
        <div className="flex flex-wrap gap-4">
          {Object.entries(statusColors).map(([status]) => (
            <div key={status} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${statusDotColors[status as BookingStatus]}`}></div>
              <span className="text-xs text-gray-600">{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          {(() => {
            const dayBookings = bookings.filter(booking => {
              const bookingDate = new Date(booking.startTime);
              return (
                bookingDate.getDate() === selectedDate.getDate() &&
                bookingDate.getMonth() === selectedDate.getMonth() &&
                bookingDate.getFullYear() === selectedDate.getFullYear()
              );
            });

            return dayBookings.length > 0 ? (
              <div className="space-y-2">
                {dayBookings.map(booking => (
                  <div
                    key={booking.id}
                    onClick={() => onBookingClick?.(booking)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${statusColors[booking.status]}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{booking.resourceName}</div>
                        <div className="text-sm opacity-75">{booking.userName}</div>
                        <div className="text-xs opacity-75">
                          {new Date(booking.startTime).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} - {new Date(booking.endTime).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                      <div className="text-sm font-medium">{booking.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No bookings scheduled for this date
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
