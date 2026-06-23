import apiClient from './api';

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalIssues: number;
  completedIssues: number;
  openIssues: number;
  criticalIssues: number;
  teamMembers: number;
  completionRate: number;
}

export interface ProjectMetrics {
  projectId: string;
  projectName: string;
  totalIssues: number;
  completedIssues: number;
  openIssues: number;
  criticalIssues: number;
  progress: number;
  status: string;
}

export interface IssueResolutionData {
  date: string;
  opened: number;
  resolved: number;
  total: number;
}

export interface TeamProductivity {
  userId: string;
  userName: string;
  avatar?: string;
  issuesCompleted: number;
  issuesInProgress: number;
  totalIssues: number;
  completionRate: number;
}

export interface WorkloadDistribution {
  userId: string;
  userName: string;
  avatar?: string;
  assignedIssues: number;
  completedIssues: number;
  workload: 'Light' | 'Medium' | 'Heavy' | 'Overloaded';
}

/**
 * Get dashboard overview statistics
 */
export const getDashboardStats = async (organizationId?: string): Promise<DashboardStats> => {
  const params = organizationId ? { orgId: organizationId } : {};
  const response = await apiClient.get('/dashboard/overview', { params });
  return response.data.data.stats as DashboardStats;
};

/**
 * Get project metrics for all projects
 */
export const getProjectMetrics = async (organizationId?: string): Promise<ProjectMetrics[]> => {
  const params = organizationId ? { orgId: organizationId } : {};
  const response = await apiClient.get('/dashboard/project-metrics', { params });
  return response.data.data;
};

/**
 * Get issue resolution trend data
 */
export const getIssueResolutionData = async (
  organizationId?: string,
  weeks: number = 8
): Promise<IssueResolutionData[]> => {
  const params = { ...(organizationId && { orgId: organizationId }), weeks };
  const response = await apiClient.get('/dashboard/issue-resolution', { params });
  return response.data.data;
};

/**
 * Get team productivity metrics
 */
export const getTeamProductivity = async (organizationId?: string, limit: number = 20): Promise<TeamProductivity[]> => {
  const params = { ...(organizationId && { orgId: organizationId }), limit };
  const response = await apiClient.get('/dashboard/team-activity', { params });
  return response.data.data;
};

/**
 * Get workload distribution
 */
export const getWorkloadDistribution = async (organizationId?: string): Promise<WorkloadDistribution[]> => {
  const params = organizationId ? { orgId: organizationId } : {};
  const response = await apiClient.get('/dashboard/workload', { params });
  return response.data.data;
};
