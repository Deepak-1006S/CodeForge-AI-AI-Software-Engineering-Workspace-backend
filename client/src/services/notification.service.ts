import apiClient from './api';
import type { Notification } from '@/types';

/**
 * Get all notifications for current user
 */
export const getNotifications = async (): Promise<Notification[]> => {
  const response = await apiClient.get('/notifications');
  return response.data.data;
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (): Promise<number> => {
  const response = await apiClient.get('/notifications/unread/count');
  return response.data.data.count;
};

/**
 * Mark notification as read
 */
export const markAsRead = async (id: string): Promise<Notification> => {
  const response = await apiClient.patch(`/notifications/${id}/read`);
  return response.data.data;
};

/**
 * Mark all notifications as read
 */
export const markAllAsRead = async (): Promise<void> => {
  await apiClient.patch('/notifications/read-all');
};

/**
 * Delete notification
 */
export const deleteNotification = async (id: string): Promise<void> => {
  await apiClient.delete(`/notifications/${id}`);
};

/**
 * Delete all notifications
 */
export const deleteAllNotifications = async (): Promise<void> => {
  await apiClient.delete('/notifications');
};
