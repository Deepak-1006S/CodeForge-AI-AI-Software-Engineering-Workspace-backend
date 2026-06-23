import { useNotifications as useNotificationContext } from '../context/NotificationContext';

/**
 * Hook to access notifications context
 */
export const useNotifications = () => {
  return useNotificationContext();
};
