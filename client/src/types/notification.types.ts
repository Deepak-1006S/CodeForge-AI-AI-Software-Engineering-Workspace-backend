import { User } from './auth.types';

export type NotificationType =
  | 'issue_assigned'
  | 'issue_updated'
  | 'issue_commented'
  | 'project_updated'
  | 'invitation'
  | 'mention'
  | 'status_change'
  | 'general';

export interface Notification {
  _id: string;
  recipient: string;
  sender?: User | null;
  type: NotificationType;
  message: string;
  read: boolean;
  link?: string | null;
  createdAt: string;
}
