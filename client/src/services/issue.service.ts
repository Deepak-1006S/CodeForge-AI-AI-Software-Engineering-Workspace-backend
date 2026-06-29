import apiClient from './api';
import type { Issue, IssueStatus, IssuePriority, IssueActivity } from '@/types';

export interface CreateIssuePayload {
  title: string;
  description: string;
  projectId: string;
  priority: IssuePriority;
  status?: IssueStatus;
  assignedTo?: string;
  labels?: string[];
  dueDate?: string;
}

export interface UpdateIssuePayload {
  title?: string;
  description?: string;
  priority?: IssuePriority;
  status?: IssueStatus;
  assignedTo?: string;
  labels?: string[];
  dueDate?: string;
}

export interface IssueFilters {
  status?: IssueStatus;
  priority?: IssuePriority;
  assignedTo?: string;
  labels?: string[];
  search?: string;
}

export interface KanbanBoard {
  Todo: Issue[];
  InProgress: Issue[];
  Review: Issue[];
  Done: Issue[];
}

/**
 * Get all issues for a project
 */
export const getIssues = async (projectId: string, filters?: IssueFilters): Promise<Issue[]> => {
  const params = { projectId, ...filters };
  const response = await apiClient.get('/issues', { params });
  return response.data.data;
};

/**
 * Get issue by ID
 */
export const getIssueById = async (id: string): Promise<Issue> => {
  const response = await apiClient.get(`/issues/${id}`);
  return response.data.data;
};

/**
 * Create new issue
 */
export const createIssue = async (payload: CreateIssuePayload): Promise<Issue> => {
  const response = await apiClient.post('/issues', payload);
  return response.data.data;
};

/**
 * Update issue
 */
export const updateIssue = async (id: string, payload: UpdateIssuePayload): Promise<Issue> => {
  const response = await apiClient.put(`/issues/${id}`, payload);
  return response.data.data;
};

/**
 * Delete issue (soft delete)
 */
export const deleteIssue = async (id: string): Promise<void> => {
  await apiClient.delete(`/issues/${id}`);
};

/**
 * Assign issue to user
 */
export const assignIssue = async (id: string, userId: string): Promise<Issue> => {
  const response = await apiClient.patch(`/issues/${id}/assign`, { assignedTo: userId });
  return response.data.data;
};

/**
 * Update issue status
 */
export const updateIssueStatus = async (id: string, status: IssueStatus): Promise<Issue> => {
  const response = await apiClient.patch(`/issues/${id}/status`, { status });
  return response.data.data;
};

/**
 * Get issue activity log
 */
export const getIssueActivity = async (id: string): Promise<IssueActivity[]> => {
  const response = await apiClient.get(`/issues/${id}/activity`);
  return response.data.data;
};

/**
 * Search issues
 */
export const searchIssues = async (projectId: string, query: string): Promise<Issue[]> => {
  const response = await apiClient.get(`/issues/search`, {
    params: { projectId, q: query },
  });
  return response.data.data;
};

/**
 * Get Kanban board view
 */
export const getKanbanBoard = async (projectId: string): Promise<KanbanBoard> => {
  const response = await apiClient.get(`/issues/kanban`, {
    params: { projectId },
  });
  return response.data.data;
};
