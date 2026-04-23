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
}

export interface BookingRequest {
  resourceId: number;
  startTime: string;
  endTime: string;
  purpose: string;
  expectedAttendees?: number;
}

export interface BookingFilters {
  userId?: number;
  resourceId?: number;
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
}

export interface Resource {
  id: number;
  name: string;
  type: string;
  capacity: number;
  location: string;
  status: string;
}
