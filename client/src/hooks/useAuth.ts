import { useAuthContext } from '../context/AuthContext';

/**
 * Hook to access authentication context
 * Must be used within AuthProvider
 */
export const useAuth = () => {
  return useAuthContext();
};
