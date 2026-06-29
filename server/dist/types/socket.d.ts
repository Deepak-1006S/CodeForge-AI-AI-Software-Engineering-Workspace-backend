export interface IssueUpdatePayload {
    issueId: string;
    projectId: string;
    updatedFields: Record<string, unknown>;
    updatedBy: string;
}
export interface IssueCreatePayload {
    issue: Record<string, unknown>;
    projectId: string;
    createdBy: string;
}
export interface NotificationPayload {
    _id: string;
    message: string;
    type: string;
    link?: string;
    sender?: string;
    createdAt: Date;
}
export interface ActivityPayload {
    issueId: string;
    projectId: string;
    actor: string;
    action: string;
    createdAt: Date;
}
export interface OnlineStatusPayload {
    userId: string;
    online: boolean;
    orgId?: string;
}
export interface DashboardRefreshPayload {
    orgId: string;
    reason: string;
}
export interface ServerToClientEvents {
    'issue:updated': (payload: IssueUpdatePayload) => void;
    'issue:created': (payload: IssueCreatePayload) => void;
    'issue:deleted': (payload: {
        issueId: string;
        projectId: string;
    }) => void;
    'notification:new': (payload: NotificationPayload) => void;
    'activity:new': (payload: ActivityPayload) => void;
    'dashboard:refresh': (payload: DashboardRefreshPayload) => void;
    'user:online': (payload: OnlineStatusPayload) => void;
    'user:offline': (payload: OnlineStatusPayload) => void;
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
export interface InterServerEvents {
    ping: () => void;
}
export interface SocketData {
    userId: string;
    role: string;
    orgIds: string[];
}
//# sourceMappingURL=socket.d.ts.map