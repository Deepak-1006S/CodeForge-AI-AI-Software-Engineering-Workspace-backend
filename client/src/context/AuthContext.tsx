import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser, LoginPayload, RegisterPayload } from '../types/auth.types';
import * as authService from '../services/auth.service';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  register: (payload: RegisterPayload) => Promise<void>;
  setAuthSession: (accessToken: string, refreshToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearAuthSession = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const restoreSessionFromStorage = (storedUser: string | null, storedToken: string | null) => {
    if (!storedToken) {
      clearAuthSession();
      return false;
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as AuthUser;
        setUser(parsedUser);
      } catch {
        localStorage.removeItem('user');
      }
    }

    setIsAuthenticated(true);
    return true;
  };

  const persistAuthSession = (userData: AuthUser, accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setError(null);
  };

  // Initialize auth state from localStorage and verify token
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      const storedUser = localStorage.getItem('user');

      if (!storedToken) {
        clearAuthSession();
        setIsLoading(false);
        return;
      }

      const restored = restoreSessionFromStorage(storedUser, storedToken);

      try {
        const { user: userData } = await authService.getMe();
        persistAuthSession(userData, storedToken, storedRefreshToken || '');
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (!restored) {
          clearAuthSession();
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (payload: LoginPayload) => {
    try {
      setError(null);
      const { user: userData, accessToken, refreshToken } = await authService.login(payload);

      persistAuthSession(userData, accessToken, refreshToken);
      toast.success('Logged in successfully');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Login failed';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    }
  };

  const setAuthSession = async (accessToken: string, refreshToken: string) => {
    try {
      const { user: userData } = await authService.getMe();
      persistAuthSession(userData, accessToken, refreshToken);
    } catch (err) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setIsAuthenticated(true);
      setError('Session restored locally. The profile check will retry in the background.');
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      setError(null);
      const { user: userData, accessToken, refreshToken } = await authService.register(payload);

      persistAuthSession(userData, accessToken, refreshToken);
      toast.success('Account created successfully');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      setError(errorMsg);
      toast.error(errorMsg);
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    clearAuthSession();
    toast.success('Logged out successfully');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    setAuthSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
