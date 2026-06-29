import apiClient from './api';
import {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  UpdatePasswordPayload,
  AuthUser,
} from '../types/auth.types';

/**
 * Login with email and password
 */
export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/login', payload);
  return response.data.data;
};

/**
 * Register a new user account
 */
export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/register', payload);
  return response.data.data;
};

/**
 * Get current authenticated user profile
 */
export const getMe = async (): Promise<{ user: AuthUser }> => {
  const response = await apiClient.get('/auth/me');
  return response.data.data;
};

/**
 * Request password reset email
 */
export const forgotPassword = async (payload: ForgotPasswordPayload): Promise<void> => {
  await apiClient.post('/auth/forgot-password', payload);
};

/**
 * Reset password with reset token
 */
export const resetPassword = async (payload: ResetPasswordPayload): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/reset-password', payload);
  return response.data.data;
};

/**
 * Update current user password
 */
export const updatePassword = async (payload: UpdatePasswordPayload): Promise<AuthResponse> => {
  const response = await apiClient.put('/auth/password', payload);
  return response.data.data;
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async (token: string): Promise<AuthResponse> => {
  const response = await apiClient.post('/auth/refresh-token', { refreshToken: token });
  return response.data.data;
};

/**
 * Logout user (client-side only - clears tokens)
 */
export const logout = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};
