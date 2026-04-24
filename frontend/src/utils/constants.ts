export const API_URL = 'http://localhost:8081/api';

export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  TECHNICIAN: 'TECHNICIAN',
} as const;

export const TICKET_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
  REJECTED: 'REJECTED',
} as const;

export const PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
} as const;

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
} as const;

export const RESOURCE_STATUS = {
  ACTIVE: 'ACTIVE',
  OUT_OF_SERVICE: 'OUT_OF_SERVICE',
} as const;