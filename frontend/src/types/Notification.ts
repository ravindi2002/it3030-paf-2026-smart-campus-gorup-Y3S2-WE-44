export interface Notification {
  id?: number;
  title: string;
  message: string;
  isRead: boolean;
  notificationType?: string;
  userId: number;
  referenceId?: number;
  createdAt?: string;
}