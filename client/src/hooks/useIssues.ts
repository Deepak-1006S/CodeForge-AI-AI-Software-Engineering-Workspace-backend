import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import apiClient from '../services/api';
import { Issue } from '../types/issue.types';

export const useIssues = (projectId?: string, status?: string, page: number = 1, limit: number = 20): UseQueryResult<Issue[], Error> => {
  const queryParams = new URLSearchParams();
  if (projectId) queryParams.append('projectId', projectId);
  if (status) queryParams.append('status', status);
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());

  return useQuery<Issue[], Error>({
    queryKey: ['issues', projectId, status, page, limit],
    queryFn: async () => {
      const response = await apiClient.get(`/issues?${queryParams}`);
      return response.data.data as Issue[];
    },
  });
};

export const useIssueDetail = (issueId: string) => {
  return useQuery<Issue, Error>({
    queryKey: ['issue', issueId],
    queryFn: async () => {
      const response = await apiClient.get(`/issues/${issueId}`);
      return response.data.data as Issue;
    },
    enabled: !!issueId,
  });
};

export const useCreateIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Issue>) => {
      const response = await apiClient.post('/issues', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
    },
  });
};
