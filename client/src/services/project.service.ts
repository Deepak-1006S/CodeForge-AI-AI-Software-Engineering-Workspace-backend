import apiClient from './api';
import type { Project, ProjectStatus } from '@/types';

export interface CreateProjectPayload {
  title: string;
  description: string;
  organizationId: string;
  status?: ProjectStatus;
}

export interface UpdateProjectPayload {
  title?: string;
  description?: string;
  status?: ProjectStatus;
}

export interface ProjectStats {
  totalIssues: number;
  completedIssues: number;
  openIssues: number;
  inProgressIssues: number;
  criticalIssues: number;
  completionRate: number;
}

/**
 * Get all projects
 */
export const getProjects = async (organizationId?: string, page: number = 1, limit: number = 20): Promise<Project[]> => {
  if (!organizationId) return [];

  const response = await apiClient.get('/projects', {
    params: { page, limit, orgId: organizationId },
  });

  return response.data.data;
};

/**
 * Get project by ID
 */
export const getProjectById = async (id: string): Promise<Project> => {
  const response = await apiClient.get(`/projects/${id}`);
  return response.data.data;
};

/**
 * Create new project
 */
export const createProject = async (payload: CreateProjectPayload): Promise<Project> => {
  const response = await apiClient.post('/projects', payload);
  return response.data.data;
};

/**
 * Update project
 */
export const updateProject = async (id: string, payload: UpdateProjectPayload): Promise<Project> => {
  const response = await apiClient.put(`/projects/${id}`, payload);
  return response.data.data;
};

/**
 * Delete project (soft delete)
 */
export const deleteProject = async (id: string): Promise<void> => {
  await apiClient.delete(`/projects/${id}`);
};

/**
 * Update project status
 */
export const updateProjectStatus = async (id: string, status: ProjectStatus): Promise<Project> => {
  const response = await apiClient.patch(`/projects/${id}/status`, { status });
  return response.data.data;
};

/**
 * Get project statistics
 */
export const getProjectStats = async (id: string): Promise<ProjectStats> => {
  const response = await apiClient.get(`/projects/${id}/stats`);
  return response.data.data;
};
