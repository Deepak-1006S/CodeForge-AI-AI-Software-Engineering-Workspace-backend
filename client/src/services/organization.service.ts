import apiClient from './api';
import type { Organization, OrgMember } from '@/types';
import { OrganizationMember } from "@/types/organization";

export interface CreateOrganizationPayload {
  name: string;
  description?: string;
}

export interface InviteMemberPayload {
  email: string;
  role: 'Admin' | 'Manager' | 'Developer';
}

export interface UpdateMemberRolePayload {
  role: 'Admin' | 'Manager' | 'Developer';
}

/**
 * Get all organizations for current user
 */
export const getOrganizations = async (): Promise<Organization[]> => {
  const response = await apiClient.get('/organizations');
  return response.data.data;
};

/**
 * Get organization by ID
 */
export const getOrganizationById = async (id: string): Promise<Organization> => {
  const response = await apiClient.get(`/organizations/${id}`);
  return response.data.data;
};

/**
 * Create new organization
 */
export const createOrganization = async (payload: CreateOrganizationPayload): Promise<Organization> => {
  const response = await apiClient.post('/organizations', payload);
  return response.data.data;
};

/**
 * Update organization
 */
export const updateOrganization = async (
  id: string,
  payload: Partial<CreateOrganizationPayload>
): Promise<Organization> => {
  const response = await apiClient.put(`/organizations/${id}`, payload);
  return response.data.data;
};

/**
 * Delete organization
 */
export const deleteOrganization = async (id: string): Promise<void> => {
  await apiClient.delete(`/organizations/${id}`);
};

/**
 * Invite member to organization
 */
export const inviteMember = async (
  organizationId: string,
  payload: InviteMemberPayload
): Promise<Organization> => {
  const response = await apiClient.post(`/organizations/${organizationId}/members`, payload);
  return response.data.data;
};

/**
 * Remove member from organization
 */
export const removeMember = async (organizationId: string, userId: string): Promise<Organization> => {
  const response = await apiClient.delete(`/organizations/${organizationId}/members/${userId}`);
  return response.data.data;
};

/**
 * Update member role
 */
export const updateMemberRole = async (
  organizationId: string,
  userId: string,
  payload: UpdateMemberRolePayload
): Promise<Organization> => {
  const response = await apiClient.put(`/organizations/${organizationId}/members/${userId}/role`, payload);
  return response.data.data;
};

/**
 * Get organization members
 */
export const getOrganizationMembers = async (organizationId: string): Promise<OrgMember[]> => {
  const response = await apiClient.get(`/organizations/${organizationId}/members`);
  return response.data.data;
};
