import { BookingRequest, BookingValidationResult, BookingValidationError, BookingValidationRule, BookingClarification } from '../types/Booking';

export class BookingValidationService {
  private static validationRules: Record<string, BookingValidationRule[]> = {
    resourceId: [
      { field: 'resourceId', required: true, min: 1, errorCode: 'RESOURCE_REQUIRED' }
    ],
    startTime: [
      { field: 'startTime', required: true, errorCode: 'START_TIME_REQUIRED' },
      { field: 'startTime', custom: (value, context) => {
        const startTime = new Date(value);
        const now = new Date();
        return startTime > now ? 'Start time must be in the future' : null;
      }, errorCode: 'START_TIME_FUTURE' },
      { field: 'startTime', custom: (value, context) => {
        const startTime = new Date(value);
        const hours = startTime.getHours();
        return hours < 6 || hours > 22 ? 'Start time must be between 6 AM and 10 PM' : null;
      }, errorCode: 'START_TIME_BUSINESS_HOURS' }
    ],
    endTime: [
      { field: 'endTime', required: true, code: 'END_TIME_REQUIRED' },
      { field: 'endTime', custom: (value, context) => {
        if (!context?.startTime) return null;
        const startTime = new Date(context.startTime);
        const endTime = new Date(value);
        return endTime <= startTime ? 'End time must be after start time' : null;
      }, code: 'END_TIME_AFTER_START' },
      { field: 'endTime', custom: (value) => {
        const endTime = new Date(value);
        const hours = endTime.getHours();
        return hours < 6 || hours > 23 ? 'End time must be between 6 AM and 11 PM' : null;
      }, code: 'END_TIME_BUSINESS_HOURS' }
    ],
    purpose: [
      { field: 'purpose', required: true, minLength: 10, maxLength: 500, code: 'PURPOSE_REQUIRED' },
      { field: 'purpose', pattern: /^[a-zA-Z0-9\s\-.,!?]+$/, code: 'PURPOSE_INVALID_CHARS' }
    ],
    expectedAttendees: [
      { field: 'expectedAttendees', required: true, min: 1, max: 1000, code: 'ATTENDEES_REQUIRED' },
      { field: 'expectedAttendees', custom: (value, context) => {
        if (!context?.resourceId) return null;
        // This would typically check against resource capacity
        return Number(value) > 500 ? 'Maximum 500 attendees allowed for single booking' : null;
      }, code: 'ATTENDEES_CAPACITY' }
    ],
    department: [
      { field: 'department', required: true, minLength: 2, maxLength: 100, code: 'DEPARTMENT_REQUIRED' }
    ],
    eventType: [
      { field: 'eventType', required: true, code: 'EVENT_TYPE_REQUIRED' }
    ],
    contactPhone: [
      { field: 'contactPhone', pattern: /^[\+]?[1-9][\d\-\s\(\)]{7,15}$/, code: 'PHONE_INVALID' }
    ],
    contactEmail: [
      { field: 'contactEmail', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, code: 'EMAIL_INVALID' }
    ],
    priority: [
      { field: 'priority', required: true, code: 'PRIORITY_REQUIRED' }
    ]
  };

  private static clarificationQuestions: BookingClarification[] = [
    {
      id: 'purpose_details',
      question: 'Please provide more details about the purpose of this booking',
      type: 'text',
      required: true,
      placeholder: 'e.g., Weekly team meeting, Guest lecture on AI, etc.',
      helpText: 'This helps us understand your booking requirements better',
      validation: [
        { field: 'purpose_details', required: true, minLength: 20, maxLength: 1000 }
      ]
    },
    {
      id: 'special_requirements',
      question: 'Do you have any special requirements for this booking?',
      type: 'text',
      required: false,
      placeholder: 'e.g., Projector, Whiteboard, Specific seating arrangement, etc.',
      helpText: 'Let us know if you need any special equipment or arrangements'
    },
    {
      id: 'external_participants',
      question: 'Will there be external participants (non-campus members)?',
      type: 'multiselect',
      required: false,
      options: ['Yes - VIP Guests', 'Yes - External Speakers', 'Yes - Industry Partners', 'No'],
      helpText: 'This helps us prepare appropriate security and access arrangements'
    },
    {
      id: 'cost_center',
      question: 'Which cost center should be billed for this booking?',
      type: 'select',
      required: true,
      options: ['Department Budget', 'Research Grant', 'Student Organization', 'External Funding', 'Personal'],
      helpText: 'Required for budget tracking and billing purposes'
    },
    {
      id: 'recurring_booking',
      question: 'Is this a recurring booking?',
      type: 'select',
      required: true,
      options: ['No - One time', 'Daily', 'Weekly', 'Monthly'],
      helpText: 'Recurring bookings require additional approval'
    },
    {
      id: 'recurring_pattern',
      question: 'If recurring, what is the pattern?',
      type: 'select',
      required: false,
      options: ['Every Monday', 'Every Tuesday', 'Every Wednesday', 'Every Thursday', 'Every Friday', 'Custom'],
      helpText: 'Specify the recurring pattern for your booking'
    },
    {
      id: 'estimated_cost',
      question: 'What is the estimated cost for this booking?',
      type: 'number',
      required: false,
      placeholder: '0.00',
      helpText: 'Include estimated costs for catering, equipment, etc.',
      validation: [
        { field: 'estimated_cost', min: 0, max: 10000 }
      ]
    },
    {
      id: 'contact_preferences',
      question: 'Preferred contact method for booking updates?',
      type: 'select',
      required: true,
      options: ['Email Only', 'SMS Only', 'Email + SMS', 'Campus App Notification'],
      helpText: 'How should we notify you about booking status changes?'
    },
    {
      id: 'accessibility_needs',
      question: 'Do you have any accessibility requirements?',
      type: 'multiselect',
      required: false,
      options: ['Wheelchair Access', 'Sign Language Interpreter', 'Large Print Materials', 'Assistive Listening Devices', 'Other'],
      helpText: 'Help us ensure the venue is accessible for all participants'
    },
    {
      id: 'recording_consent',
      question: 'Do you consent to this session being recorded?',
      type: 'select',
      required: true,
      options: ['Yes - For internal use', 'Yes - For public distribution', 'No - Do not record'],
      helpText: 'Some sessions may be recorded for training or documentation purposes'
    }
  ];

  static validateBooking(booking: BookingRequest): BookingValidationResult {
    const errors: BookingValidationError[] = [];
    const warnings: string[] = [];

    // Validate each field
    Object.keys(booking).forEach(field => {
      const fieldRules = this.validationRules[field];
      if (fieldRules) {
        fieldRules.forEach(rule => {
          const error = this.validateField(booking[field], rule, booking);
          if (error) {
            errors.push(error);
          }
        });
      }
    });

    // Cross-field validation
    const crossFieldErrors = this.validateCrossFields(booking);
    errors.push(...crossFieldErrors);

    // Business logic warnings
    const businessWarnings = this.generateBusinessWarnings(booking);
    warnings.push(...businessWarnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private static validateField(value: any, rule: BookingValidationRule, context: BookingRequest): BookingValidationError | null {
    if (rule.required && (value === undefined || value === null || value === '')) {
      return {
        field: rule.field,
        message: `${this.getFieldDisplayName(rule.field)} is required`,
        code: rule.code
      };
    }

    if (value && rule.minLength && value.length < rule.minLength) {
      return {
        field: rule.field,
        message: `${this.getFieldDisplayName(rule.field)} must be at least ${rule.minLength} characters`,
        code: rule.code
      };
    }

    if (value && rule.maxLength && value.length > rule.maxLength) {
      return {
        field: rule.field,
        message: `${this.getFieldDisplayName(rule.field)} must not exceed ${rule.maxLength} characters`,
        code: rule.code
      };
    }

    if (value && rule.min && Number(value) < rule.min) {
      return {
        field: rule.field,
        message: `${this.getFieldDisplayName(rule.field)} must be at least ${rule.min}`,
        code: rule.code
      };
    }

    if (value && rule.max && Number(value) > rule.max) {
      return {
        field: rule.field,
        message: `${this.getFieldDisplayName(rule.field)} must not exceed ${rule.max}`,
        code: rule.code
      };
    }

    if (value && rule.pattern && !rule.pattern.test(value)) {
      return {
        field: rule.field,
        message: `${this.getFieldDisplayName(rule.field)} format is invalid`,
        code: rule.code
      };
    }

    if (rule.custom) {
      const customError = rule.custom(value, context);
      if (customError) {
        return {
          field: rule.field,
          message: customError,
          code: rule.code
        };
      }
    }

    return null;
  }

  private static validateCrossFields(booking: BookingRequest): BookingValidationError[] {
    const errors: BookingValidationError[] = [];

    // Validate time logic
    if (booking.startTime && booking.endTime) {
      const startTime = new Date(booking.startTime);
      const endTime = new Date(booking.endTime);
      const durationMs = endTime.getTime() - startTime.getTime();
      const durationHours = durationMs / (1000 * 60 * 60);

      if (durationHours < 0.5) {
        errors.push({
          field: 'endTime',
          message: 'Booking duration must be at least 30 minutes',
          code: 'MIN_DURATION'
        });
      }

      if (durationHours > 8) {
        errors.push({
          field: 'endTime',
          message: 'Booking duration cannot exceed 8 hours',
          code: 'MAX_DURATION'
        });
      }

      // Check if booking is too far in advance
      const now = new Date();
      const daysInAdvance = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      if (daysInAdvance > 90) {
        errors.push({
          field: 'startTime',
          message: 'Bookings cannot be made more than 90 days in advance',
          code: 'MAX_ADVANCE_BOOKING'
        });
      }
    }

    return errors;
  }

  private static generateBusinessWarnings(booking: BookingRequest): string[] {
    const warnings: string[] = [];

    // Warn about peak hours
    if (booking.startTime) {
      const startTime = new Date(booking.startTime);
      const hour = startTime.getHours();
      const dayOfWeek = startTime.getDay();
      
      if (dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 9 && hour <= 11) {
        warnings.push('Peak hours (9 AM - 12 PM weekdays) may have limited availability');
      }
    }

    // Warn about large bookings
    if (booking.expectedAttendees && booking.expectedAttendees > 50) {
      warnings.push('Large bookings (50+ attendees) may require additional approval time');
    }

    // Warn about weekend bookings
    if (booking.startTime) {
      const startTime = new Date(booking.startTime);
      const dayOfWeek = startTime.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        warnings.push('Weekend bookings may incur additional charges');
      }
    }

    return warnings;
  }

  private static getFieldDisplayName(field: string): string {
    const displayNames: Record<string, string> = {
      resourceId: 'Resource',
      startTime: 'Start Time',
      endTime: 'End Time',
      purpose: 'Purpose',
      expectedAttendees: 'Expected Attendees',
      department: 'Department',
      eventType: 'Event Type',
      contactPhone: 'Contact Phone',
      contactEmail: 'Contact Email',
      priority: 'Priority'
    };
    return displayNames[field] || field;
  }

  static getClarificationQuestions(): BookingClarification[] {
    return this.clarificationQuestions;
  }

  static getValidationRules(): Record<string, BookingValidationRule[]> {
    return this.validationRules;
  }

  static getErrorMessage(code: string): string {
    const errorMessages: Record<string, string> = {
      'RESOURCE_REQUIRED': 'Please select a resource for your booking',
      'START_TIME_REQUIRED': 'Please specify a start time',
      'START_TIME_FUTURE': 'Start time must be in the future',
      'START_TIME_BUSINESS_HOURS': 'Start time must be between 6 AM and 10 PM',
      'END_TIME_REQUIRED': 'Please specify an end time',
      'END_TIME_AFTER_START': 'End time must be after start time',
      'END_TIME_BUSINESS_HOURS': 'End time must be between 6 AM and 11 PM',
      'PURPOSE_REQUIRED': 'Please provide a purpose for this booking',
      'PURPOSE_INVALID_CHARS': 'Purpose contains invalid characters',
      'ATTENDEES_REQUIRED': 'Please specify the number of expected attendees',
      'ATTENDEES_CAPACITY': 'Maximum 500 attendees allowed for single booking',
      'DEPARTMENT_REQUIRED': 'Please specify your department',
      'EVENT_TYPE_REQUIRED': 'Please select an event type',
      'PHONE_INVALID': 'Please enter a valid phone number',
      'EMAIL_INVALID': 'Please enter a valid email address',
      'PRIORITY_REQUIRED': 'Please select a priority level',
      'MIN_DURATION': 'Booking duration must be at least 30 minutes',
      'MAX_DURATION': 'Booking duration cannot exceed 8 hours',
      'MAX_ADVANCE_BOOKING': 'Bookings cannot be made more than 90 days in advance'
    };
    return errorMessages[code] || 'Validation error occurred';
  }
}
