export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  REJECTED = 'REJECTED',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface Ticket {
  id?: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  category?: string;
  location?: string;
  imageUrl?: string;
  userId: number;
  userName?: string;
  assignedToId?: number;
  assignedToName?: string;
  comments?: Comment[];
  createdAt?: string;
  updatedAt?: string;
  resolvedAt?: string;
}

export interface Comment {
  id?: number;
  content: string;
  ticketId: number;
  userId: number;
  userName?: string;
  createdAt?: string;
}