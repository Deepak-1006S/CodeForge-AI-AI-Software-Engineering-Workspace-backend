import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/auth.middleware';
import {
  getNotifications,
  markAsRead,
  markAllRead,
  deleteNotification,
  getUnreadCount,
} from '../controllers/notification.controller';

const router = Router();

// All notification routes require authentication
router.use(authenticate);

// GET /api/notifications?page=1&limit=20&unread=true
router.get('/', asyncHandler(getNotifications));

// GET /api/notifications/unread-count
router.get('/unread-count', asyncHandler(getUnreadCount));

// PATCH /api/notifications/mark-all-read
router.patch('/mark-all-read', asyncHandler(markAllRead));

// PATCH /api/notifications/:id/read
router.patch('/:id/read', asyncHandler(markAsRead));

// DELETE /api/notifications/:id
router.delete('/:id', asyncHandler(deleteNotification));

export default router;
