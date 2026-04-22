export enum BookingStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export interface Booking {
  id?: number;
  userId: number;
  userName?: string;
  resourceId: number;
  resourceName?: string;
  startTime: string;
  endTime: string;
  purpose?: string;
  status: BookingStatus;
  createdAt?: string;
  updatedAt?: string;
  approvedBy?: number;
}