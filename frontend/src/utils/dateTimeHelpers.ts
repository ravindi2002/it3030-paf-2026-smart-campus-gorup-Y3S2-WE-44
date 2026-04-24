// Date and Time Utility Functions for Smart Campus Booking System

export interface TimeSlot {
  id: string;
  startTime: Date;
  endTime: Date;
  available: boolean;
  resource?: {
    id: number;
    name: string;
  };
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface BusinessHours {
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  openTime: string; // "09:00"
  closeTime: string; // "17:00"
  closed: boolean;
}

export class DateTimeHelpers {
  // Business hours configuration
  private static businessHours: BusinessHours[] = [
    { dayOfWeek: 1, openTime: '09:00', closeTime: '17:00', closed: false }, // Monday
    { dayOfWeek: 2, openTime: '09:00', closeTime: '17:00', closed: false }, // Tuesday
    { dayOfWeek: 3, openTime: '09:00', closeTime: '17:00', closed: false }, // Wednesday
    { dayOfWeek: 4, openTime: '09:00', closeTime: '17:00', closed: false }, // Thursday
    { dayOfWeek: 5, openTime: '09:00', closeTime: '17:00', closed: false }, // Friday
    { dayOfWeek: 6, openTime: '09:00', closeTime: '17:00', closed: true },  // Saturday
    { dayOfWeek: 0, openTime: '09:00', closeTime: '17:00', closed: true }  // Sunday
  ];

  // Format date for display
  static formatDate(date: Date | string, format: string = 'YYYY-MM-DD'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
  }

  // Format date and time for display
  static formatDateTime(date: Date | string, format: string = 'YYYY-MM-DD HH:mm'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Check if a date is within business hours
  static isWithinBusinessHours(date: Date): boolean {
    const dayOfWeek = date.getDay();
    const hours = date.getHours();
    const businessHour = this.businessHours.find(bh => bh.dayOfWeek === dayOfWeek);
    
    if (!businessHour || businessHour.closed) {
      return false;
    }

    const [openHour, openMinute] = businessHour.openTime.split(':').map(Number);
    const [closeHour, closeMinute] = businessHour.closeTime.split(':').map(Number);
    
    return hours >= openHour && hours < closeHour;
  }

  // Check if date is weekend
  static isWeekend(date: Date): boolean {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
  }

  // Get next available time slot from a specific date
  static getNextAvailableTime(date: Date, duration: number): Date | null {
    const startTime = new Date(date);
    const endTime = new Date(startTime.getTime() + duration * 60 * 1000);
    
    // Check if end time is within business hours
    if (!this.isWithinBusinessHours(endTime)) {
      return null;
    }
    
    return endTime;
  }

  // Generate time slots for a specific date range
  static generateTimeSlots(
    startDate: Date, 
    endDate: Date, 
    duration: number, 
    interval: number = 30 // minutes
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const current = new Date(startDate);
    
    while (current < endDate) {
      const slotStart = new Date(current);
      const slotEnd = new Date(current.getTime() + duration * 60 * 1000);
      
      // Only add slots that are within business hours
      if (this.isWithinBusinessHours(slotStart) && this.isWithinBusinessHours(slotEnd)) {
        slots.push({
          id: `slot-${slots.length}`,
          startTime: slotStart,
          endTime: slotEnd,
          available: true
        });
      }
      
      current.setTime(current.getTime() + interval * 60 * 1000);
    }
    
    return slots;
  }

  // Check if two date ranges overlap
  static doDateRangesOverlap(
    start1: Date, 
    end1: Date, 
    start2: Date, 
    end2: Date
  ): boolean {
    return start1 < end2 && start2 < end1 && start2 < end2;
  }

  // Validate time input
  static validateTimeInput(time: string): { isValid: boolean; error?: string } {
    const timeRegex = /^([01]?[0-9]|1[0-9]|2[0-3]):[0-5][0-9]\s?([aAp][mM])?$/;
    
    if (!timeRegex.test(time)) {
      return {
        isValid: false,
        error: 'Please enter a valid time in HH:MM or HH:MM AM/PM format'
      };
    }
    
    return { isValid: true };
  }

  // Parse time string to minutes
  static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    const period = time.toLowerCase().includes('am') ? 'am' : 'pm';
    let hour24 = hours;
    
    if (period === 'pm' && hour24 !== 12) {
      hour24 += 12;
    }
    
    return hour24 * 60 + minutes;
  }

  // Get date difference in human readable format
  static getDateDifference(startDate: Date, endDate: Date): string {
    const diffMs = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} days ${diffHours}h ${diffMinutes}m`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    } else {
      return `${diffMinutes}m`;
    }
  }

  // Check if date is in the past
  static isPastDate(date: Date): boolean {
    const now = new Date();
    return date < now.setHours(0, 0, 0, 0);
  }

  // Check if date is too far in the future
  static isTooFarInFuture(date: Date, maxDays: number = 90): boolean {
    const now = new Date();
    const daysInAdvance = (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return daysInAdvance > maxDays;
  }

  // Get business days in a date range
  static getBusinessDaysInRange(startDate: Date, endDate: Date): number {
    let businessDays = 0;
    const current = new Date(startDate);
    
    while (current <= endDate) {
      if (this.isWithinBusinessHours(current)) {
        businessDays++;
      }
      current.setDate(current.getDate() + 1);
    }
    
    return businessDays;
  }

  // Format currency
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // Generate recurring dates
  static generateRecurringDates(
    startDate: Date,
    pattern: 'daily' | 'weekly' | 'monthly',
    count: number
  ): Date[] {
    const dates: Date[] = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < count; i++) {
      const nextDate = new Date(current);
      
      switch (pattern) {
        case 'daily':
          nextDate.setDate(current.getDate() + 1);
          break;
        case 'weekly':
          nextDate.setDate(current.getDate() + 7);
          break;
        case 'monthly':
          nextDate.setMonth(current.getMonth() + 1);
          break;
      }
      
      dates.push(new Date(nextDate));
      current.setTime(nextDate.getTime());
    }
    
    return dates;
  }

  // Validate date range
  static validateDateRange(startDate: Date, endDate: Date): { isValid: boolean; error?: string } {
    if (startDate >= endDate) {
      return {
        isValid: false,
        error: 'End date must be after start date'
      };
    }
    
    if (this.isPastDate(startDate)) {
      return {
        isValid: false,
        error: 'Start date cannot be in the past'
      };
    }
    
    if (this.isTooFarInFuture(startDate)) {
      return {
        isValid: false,
        error: 'Bookings cannot be made more than 90 days in advance'
      };
    }
    
    return { isValid: true };
  }

  // Get peak hours warning
  static getPeakHoursWarning(date: Date): string | null {
    const hour = date.getHours();
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 9 && hour <= 11) {
      return 'Peak hours (9 AM - 12 PM weekdays) may have limited availability';
    }
    
    return null;
  }

  // Check resource availability for a time slot
  static checkResourceAvailability(
    resourceId: number,
    startTime: Date,
    endTime: Date,
    existingBookings: Array<{ startTime: Date; endTime: Date }>
  ): boolean {
    return !existingBookings.some(booking => 
      this.doDateRangesOverlap(
        booking.startTime,
        booking.endTime,
        startTime,
        endTime
      )
    );
  }

  // Get time slot suggestions
  static getTimeSlotSuggestions(
    date: Date,
    duration: number,
    preferredTime?: string
  ): TimeSlot[] {
    const suggestions: TimeSlot[] = [];
    const availableSlots = this.generateTimeSlots(date, date, duration, 30);
    
    // Sort by preferred time if specified
    if (preferredTime) {
      const preferredMinutes = this.timeToMinutes(preferredTime);
      availableSlots.sort((a, b) => {
        const aMinutes = this.timeToMinutes(`${a.startTime.getHours().toString().padStart(2, '0')}:${a.startTime.getMinutes().toString().padStart(2, '0')}`);
        const bMinutes = this.timeToMinutes(`${b.startTime.getHours().toString().padStart(2, '0')}:${b.startTime.getMinutes().toString().padStart(2, '0')}`);
        
        const aDiff = Math.abs(aMinutes - preferredMinutes);
        const bDiff = Math.abs(bMinutes - preferredMinutes);
        
        return aDiff - bDiff;
      });
    }
    
    return availableSlots.slice(0, 5); // Return top 5 suggestions
  }
}
