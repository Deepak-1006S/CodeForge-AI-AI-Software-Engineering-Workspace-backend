import { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import * as notificationService from '../services/notification.service';
import { parsePagination } from '../utils/pagination';

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  const { page, limit } = parsePagination(req);
  const unreadOnly = req.query.unread === 'true';
  const userId = req.user._id.toString();

  const { notifications, meta } = await notificationService.getNotifications(
    userId,
    page,
    limit,
    unreadOnly,
  );

  res.status(200).json(
    new ApiResponse(200, { notifications }, 'Notifications retrieved', meta),
  );
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user._id.toString();

  const notification = await notificationService.markAsRead(id, userId);

  res.status(200).json(new ApiResponse(200, { notification }, 'Notification marked as read'));
};

export const markAllRead = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user._id.toString();
  const count = await notificationService.markAllRead(userId);

  res.status(200).json(
    new ApiResponse(200, { updatedCount: count }, `${count} notifications marked as read`),
  );
};

export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user._id.toString();

  await notificationService.deleteNotification(id, userId);

  res.status(200).json(new ApiResponse(200, {}, 'Notification deleted successfully'));
};

export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user._id.toString();
  const count = await notificationService.getUnreadCount(userId);

  res.status(200).json(new ApiResponse(200, { count }, 'Unread notification count retrieved'));
};
