import { User } from './auth.types';

export type ProjectStatus = 'Planning' | 'Active' | 'Testing' | 'Completed';

export interface Project {
  _id: string;
  title: string;
  description?: string;
  organization: string | { _id: string; name: string };
  owner: User;
  status: ProjectStatus;
  team: User[];
  githubOwner?: string | null;
  githubRepo?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  title: string;
  description?: string;
  organization: string;
  status?: ProjectStatus;
}

export interface UpdateProjectPayload {
  title?: string;
  description?: string;
  status?: ProjectStatus;
}

export interface ProjectStats {
  total: number;
  todo: number;
  inProgress: number;
  review: number;
  done: number;
  critical: number;
  completionPercentage: number;
}
