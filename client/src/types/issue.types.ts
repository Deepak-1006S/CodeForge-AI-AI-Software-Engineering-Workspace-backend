import { User } from './auth.types';

export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type IssueStatus = 'Todo' | 'In Progress' | 'Review' | 'Done';

export interface Issue {
  _id: string;
  title: string;
  description?: string;
  project: string | { _id: string; title: string };
  assignedTo?: User | null;
  priority: IssuePriority;
  status: IssueStatus;
  labels: string[];
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IssueActivity {
  _id: string;
  issue: string;
  actor: User;
  action: string;
  oldValue?: string | null;
  newValue?: string | null;
  createdAt: string;
}

export interface CreateIssuePayload {
  title: string;
  description?: string;
  project: string;
  assignedTo?: string | null;
  priority?: IssuePriority;
  status?: IssueStatus;
  labels?: string[];
  dueDate?: string | null;
}

export interface UpdateIssuePayload {
  title?: string;
  description?: string;
  priority?: IssuePriority;
  status?: IssueStatus;
  assignedTo?: string | null;
  labels?: string[];
  dueDate?: string | null;
}

export interface IssueFilters {
  projectId?: string;
  priority?: IssuePriority | '';
  status?: IssueStatus | '';
  assignedTo?: string;
  search?: string;
  labels?: string;
  page?: number;
  limit?: number;
}

export interface KanbanBoard {
  'Todo': Issue[];
  'In Progress': Issue[];
  'Review': Issue[];
  'Done': Issue[];
}
