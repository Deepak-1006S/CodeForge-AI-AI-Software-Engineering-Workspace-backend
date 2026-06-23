import apiClient from './api';
import type { AuthUser } from '@/types';

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  avatar?: string;
}

/**
 * Get current user profile
 */
export const getUserProfile = async (): Promise<AuthUser> => {
  const response = await apiClient.get('/auth/me');
  return response.data.data.user;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (payload: UpdateProfilePayload): Promise<AuthUser> => {
  const response = await apiClient.put('/users/profile', payload);
  return response.data.data;
};

/**
 * Upload user avatar
 */
export const uploadAvatar = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await apiClient.post('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data;
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: string): Promise<AuthUser> => {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data.data;
};
