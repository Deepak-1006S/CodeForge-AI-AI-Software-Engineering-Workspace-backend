export interface NotificationPayload {
  id?: string;
  _id?: string;
  title?: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  createdAt: string;
  data?: Record<string, any>;
  sender?: string;
}

export interface ActivityPayload {
  id: string;
  type: 'issue' | 'project' | 'notification';
  title: string;
  message: string;
  createdAt: string;
  userId: string;
  projectId?: string;
  issueId?: string;
  organizationId?: string;
}

export interface ServerToClientEvents {
  'issue:updated': (payload: { issueId: string; projectId: string; updatedFields: Record<string, unknown>; updatedBy: string }) => void;
  'issue:created': (payload: { issue: Record<string, unknown>; projectId: string; createdBy: string }) => void;
  'issue:deleted': (payload: { issueId: string; projectId: string }) => void;
  'notification:new': (payload: NotificationPayload) => void;
  'activity:new': (payload: ActivityPayload) => void;
  'dashboard:refresh': (payload: { orgId: string; reason: string }) => void;
  'user:online': (payload: { userId: string; online: boolean; orgId: string }) => void;
  'user:offline': (payload: { userId: string; online: boolean; orgId: string }) => void;
  'online_users': (userIds: string[]) => void;
  error: (message: string) => void;
}

export interface ClientToServerEvents {
  'join:org': (orgId: string) => void;
  'leave:org': (orgId: string) => void;
  'join:project': (projectId: string) => void;
  'leave:project': (projectId: string) => void;
  ping: () => void;
}
