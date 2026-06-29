import type { IssuePriority, IssueStatus, ProjectStatus, UserRole } from '@/types';

export const ROLES: UserRole[] = ['Admin', 'Manager', 'Developer'];

export const PROJECT_STATUSES: ProjectStatus[] = ['Planning', 'Active', 'Testing', 'Completed'];

export const ISSUE_PRIORITIES: IssuePriority[] = ['Low', 'Medium', 'High', 'Critical'];

export const ISSUE_STATUSES: IssueStatus[] = ['Todo', 'In Progress', 'Review', 'Done'];

export const QUERY_KEYS = {
  auth: {
    me: ['auth', 'me'],
  },
  users: {
    list: (params?: object) => ['users', params],
    detail: (id: string) => ['users', id],
  },
  organizations: {
    list: ['organizations'],
    detail: (id: string) => ['organizations', id],
    members: (id: string) => ['organizations', id, 'members'],
  },
  projects: {
    list: (orgId: string, params?: object) => ['projects', orgId, params],
    detail: (id: string) => ['projects', id],
    stats: (id: string) => ['projects', id, 'stats'],
  },
  issues: {
    list: (params: object) => ['issues', params],
    detail: (id: string) => ['issues', id],
    activity: (id: string) => ['issues', id, 'activity'],
    kanban: (projectId: string) => ['issues', 'kanban', projectId],
  },
  dashboard: {
    overview: (orgId: string) => ['dashboard', 'overview', orgId],
    projectMetrics: (orgId: string) => ['dashboard', 'project-metrics', orgId],
    issueResolution: (orgId: string) => ['dashboard', 'issue-resolution', orgId],
    teamActivity: (orgId: string) => ['dashboard', 'team-activity', orgId],
    workload: (orgId: string) => ['dashboard', 'workload', orgId],
  },
  github: {
    repo: (projectId: string) => ['github', 'repo', projectId],
    commits: (projectId: string) => ['github', 'commits', projectId],
    pulls: (projectId: string) => ['github', 'pulls', projectId],
    contributors: (projectId: string) => ['github', 'contributors', projectId],
  },
  notifications: {
    list: (params?: object) => ['notifications', params],
    unreadCount: ['notifications', 'unread-count'],
  },
} as const;

export const PRIORITY_CONFIG = {
  Low: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', dot: 'bg-emerald-500' },
  Medium: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10', dot: 'bg-amber-500' },
  High: { color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-500/10', dot: 'bg-orange-500' },
  Critical: { color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/10', dot: 'bg-red-500' },
} as const;

export const STATUS_CONFIG = {
  'Todo': { color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-500/10', dot: 'bg-slate-400' },
  'In Progress': { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', dot: 'bg-blue-500' },
  'Review': { color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10', dot: 'bg-purple-500' },
  'Done': { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', dot: 'bg-emerald-500' },
} as const;

export const PROJECT_STATUS_CONFIG = {
  Planning: { color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-500/10' },
  Active: { color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
  Testing: { color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  Completed: { color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
} as const;
