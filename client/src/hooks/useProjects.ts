import { useQuery, useMutation, useQueryClient, UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import apiClient from '../services/api';
import { Project } from '../types/project.types';

export const useProjects = (organizationId?: string, page: number = 1, limit: number = 10): UseQueryResult<Project[], Error> => {
  return useQuery<Project[], Error>({
    queryKey: ['projects', organizationId, page, limit],
    queryFn: async () => {
      if (!organizationId) return [];

      const response = await apiClient.get('/projects', {
        params: { page, limit, orgId: organizationId },
      });

      return response.data.data as Project[];
    },
    enabled: !!organizationId,
  });
};

export const useProjectDetail = (projectId: string): UseQueryResult<Project, Error> => {
  return useQuery<Project, Error>({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const response = await apiClient.get(`/projects/${projectId}`);
      return response.data.data as Project;
    },
    enabled: !!projectId,
  });
};

export const useCreateProject = (): UseMutationResult<Project, Error, Partial<Project>, unknown> => {
  const queryClient = useQueryClient();

  return useMutation<Project, Error, Partial<Project>, unknown>({
    mutationFn: async (data: Partial<Project>) => {
      const response = await apiClient.post('/projects', data);
      return response.data.data as Project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};
