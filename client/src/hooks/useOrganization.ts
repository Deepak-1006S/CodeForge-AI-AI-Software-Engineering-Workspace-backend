import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/api';

export interface Organization {
  _id: string;
  name: string;
  slug: string;
  description: string;
  avatar: string;
  owner: string;
  members: Array<{ userId: string; role: string }>;
  createdAt: string;
  updatedAt: string;
}

export const useOrganizations = () => {
  return useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const response = await apiClient.get('/organizations');
      return response.data.data as Organization[];
    },
  });
};

export const useOrganizationDetail = (orgId: string) => {
  return useQuery({
    queryKey: ['organization', orgId],
    queryFn: async () => {
      const response = await apiClient.get(`/organizations/${orgId}`);
      return response.data.data as Organization;
    },
    enabled: !!orgId,
  });
};

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Organization>) => {
      const response = await apiClient.post('/organizations', data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
  });
};
