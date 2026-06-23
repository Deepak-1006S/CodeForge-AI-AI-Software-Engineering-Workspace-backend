import { body, query, param } from 'express-validator';

// GET /notifications - list notifications
export const listNotificationsValidator = [
  query('page').optional().isInt({ min: 1 }).toInt().withMessage('Page must be >= 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('Limit must be 1-100'),
  query('read').optional().isBoolean().withMessage('Read must be true/false'),
];

// PUT /notifications/:id/read - mark as read
export const markNotificationReadValidator = [
  param('id').isMongoId().withMessage('Invalid notification ID'),
];

// DELETE /notifications/:id - delete notification
export const deleteNotificationValidator = [
  param('id').isMongoId().withMessage('Invalid notification ID'),
];

// POST /notifications/mark-all-read - mark all as read
export const markAllNotificationsReadValidator = [];
