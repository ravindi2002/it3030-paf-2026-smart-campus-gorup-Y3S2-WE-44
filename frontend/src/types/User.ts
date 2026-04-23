export enum RoleType {
  USER = 'USER',
  ADMIN = 'ADMIN',
  TECHNICIAN = 'TECHNICIAN',
}

export interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  fullName?: string;
  studentId?: string;
  department?: string;
  role: RoleType;
  profileImage?: string;
  createdAt?: string;
  updatedAt?: string;
  enabled?: boolean;
}