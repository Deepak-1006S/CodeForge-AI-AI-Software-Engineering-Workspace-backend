export type UserRole = 'Admin' | 'Manager' | 'Developer';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  organizationId?: string;
  createdAt: string;
  updatedAt: string;
}

export type AuthUser = User;

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface JwtPayload {
  id: string;
  role: UserRole;
  iat: number;
  exp: number;
}
