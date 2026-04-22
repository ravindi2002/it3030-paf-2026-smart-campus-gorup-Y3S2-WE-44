export const API_URL = 'http://localhost:8080/api';

export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  TECHNICIAN: 'TECHNICIAN',
} as const;

export const TICKET_CATEGORIES = [
  'Electrical',
  'Plumbing',
  'HVAC',
  'Furniture',
  'IT Equipment',
  'Cleaning',
  'Security',
  'Other',
] as const;

export const RESOURCE_TYPES = [
  'Classroom',
  'Lab',
  'Auditorium',
  'Meeting Room',
  'Sports Facility',
  'Library',
  'Other',
] as const;