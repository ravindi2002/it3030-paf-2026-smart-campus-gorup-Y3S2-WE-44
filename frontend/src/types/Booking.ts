export enum BookingStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export interface Booking {
  id: number;
  userId: number;
  userName: string;
  resourceId: number;
  resourceName: string;
  startTime: string;
  endTime: string;
  purpose: string;
  expectedAttendees?: number;
  rejectionReason?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  approvedBy?: number;
  // Enhanced validation fields
  department?: string;
  eventType?: 'lecture' | 'meeting' | 'workshop' | 'event' | 'other';
  specialRequirements?: string;
  contactPhone?: string;
  contactEmail?: string;
  recurringBooking?: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  approvalNotes?: string;
  cancellationReason?: string;
  lastModifiedBy?: number;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  attachments?: string[];
  estimatedCost?: number;
  actualCost?: number;
  billingCode?: string;
  externalParticipants?: {
    name: string;
    email: string;
    organization?: string;
  }[];
}

export interface BookingRequest {
  resourceId: number;
  startTime: string;
  endTime: string;
  purpose: string;
  expectedAttendees?: number;
  // Enhanced validation fields
  department?: string;
  eventType?: 'lecture' | 'meeting' | 'workshop' | 'event' | 'other';
  specialRequirements?: string;
  contactPhone?: string;
  contactEmail?: string;
  recurringBooking?: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly';
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  estimatedCost?: number;
  externalParticipants?: {
    name: string;
    email: string;
    organization?: string;
  }[];
}

export interface BookingFilters {
  userId?: number;
  resourceId?: number;
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
  // Enhanced filter options
  department?: string;
  eventType?: 'lecture' | 'meeting' | 'workshop' | 'event' | 'other';
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  minAttendees?: number;
  maxAttendees?: number;
  search?: string;
}

// Validation interfaces
export interface BookingValidationError {
  field: string;
  message: string;
  code: string;
}

export interface BookingValidationRule {
  field: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: any) => string | null;
}

export interface BookingValidationResult {
  isValid: boolean;
  errors: BookingValidationError[];
  warnings: string[];
}

export interface BookingClarification {
  id: string;
  question: string;
  type: 'text' | 'select' | 'multiselect' | 'date' | 'number' | 'email' | 'phone';
  required: boolean;
  options?: string[];
  placeholder?: string;
  validation?: BookingValidationRule[];
  helpText?: string;
  example?: string;
}

export interface BookingValidationRule {
  field: string;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: any, context?: BookingRequest) => string | null;
  errorCode: string;
}

export interface BookingValidationError {
  field: string;
  message: string;
  code: string;
}

export interface BookingValidationResult {
  isValid: boolean;
  errors: BookingValidationError[];
  warnings: string[];
}

export interface Resource {
  id: number;
  name: string;
  type: string;
  capacity: number;
  location: string;
  status: string;
}
