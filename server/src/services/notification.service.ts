import { Types } from 'mongoose';
import { Notification } from '../models/Notification';
import { NotificationType } from '../types/models';
import { parsePagination, buildPaginationMeta } from '../utils/pagination';
import { ApiError } from '../utils/ApiError';
import { logger } from '../config/logger';
import { getIO as getSocketIO } from '../socket';

const getIO = () => {
  try {
    return getSocketIO();
  } catch {
    return null;
  }
};

export interface CreateNotificationData {
  recipient: string | Types.ObjectId;
  sender?: string | Types.ObjectId;
  type: NotificationType;
  message: string;
  link?: string;
}

export const createNotification = async (data: CreateNotificationData) => {
  try {
    const notification = await Notification.create({
      recipient: data.recipient,
      sender: data.sender || null,
      type: data.type,
      message: data.message,
      link: data.link || null,
    });

    // Emit real-time socket event to recipient
    const io = getIO();
    if (io) {
      io.to(`user:${data.recipient.toString()}`).emit('notification:new', {
        _id: notification._id.toString(),
        message: notification.message,
        type: notification.type,
        link: notification.link,
        sender: data.sender?.toString(),
        createdAt: notification.createdAt,
      });
    }

    return notification;
  } catch (error) {
    logger.error('Failed to create notification:', error);
    // Don't throw — notifications are non-critical side effects
    return null;
  }
};

export const getNotifications = async (
  userId: string,
  page = 1,
  limit = 20,
  unreadOnly = false,
) => {
  const skip = (page - 1) * limit;
  const filter: Record<string, unknown> = { recipient: new Types.ObjectId(userId) };
  if (unreadOnly) filter.read = false;

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .populate('sender', 'name avatar email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments(filter),
  ]);

  const meta = buildPaginationMeta(total, page, limit);
  return { notifications, meta };
};

export const markAsRead = async (notificationId: string, userId: string) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: new Types.ObjectId(notificationId),
      recipient: new Types.ObjectId(userId),
    },
    { read: true },
    { new: true },
  );

  if (!notification) {
    throw new ApiError(404, 'Notification not found or access denied.');
  }

  return notification;
};

export const markAllRead = async (userId: string): Promise<number> => {
  const result = await Notification.updateMany(
    { recipient: new Types.ObjectId(userId), read: false },
    { read: true },
  );
  return result.modifiedCount;
};

export const deleteNotification = async (
  notificationId: string,
  userId: string,
): Promise<void> => {
  const result = await Notification.deleteOne({
    _id: new Types.ObjectId(notificationId),
    recipient: new Types.ObjectId(userId),
  });

  if (result.deletedCount === 0) {
    throw new ApiError(404, 'Notification not found or access denied.');
  }
};

export const getUnreadCount = async (userId: string): Promise<number> => {
  return Notification.countDocuments({
    recipient: new Types.ObjectId(userId),
    read: false,
  });
};
