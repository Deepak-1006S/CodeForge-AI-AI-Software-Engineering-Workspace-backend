import { useTheme as useThemeContext } from '../context/ThemeContext';

/**
 * Hook to access theme context
 */
export const useTheme = () => {
  return useThemeContext();
};
