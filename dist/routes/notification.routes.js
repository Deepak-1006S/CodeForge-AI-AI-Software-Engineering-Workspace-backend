"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_middleware_1 = require("../middleware/auth.middleware");
const notification_controller_1 = require("../controllers/notification.controller");
const router = (0, express_1.Router)();
// All notification routes require authentication
router.use(auth_middleware_1.authenticate);
// GET /api/notifications?page=1&limit=20&unread=true
router.get('/', (0, asyncHandler_1.asyncHandler)(notification_controller_1.getNotifications));
// GET /api/notifications/unread-count
router.get('/unread-count', (0, asyncHandler_1.asyncHandler)(notification_controller_1.getUnreadCount));
// PATCH /api/notifications/mark-all-read
router.patch('/mark-all-read', (0, asyncHandler_1.asyncHandler)(notification_controller_1.markAllRead));
// PATCH /api/notifications/:id/read
router.patch('/:id/read', (0, asyncHandler_1.asyncHandler)(notification_controller_1.markAsRead));
// DELETE /api/notifications/:id
router.delete('/:id', (0, asyncHandler_1.asyncHandler)(notification_controller_1.deleteNotification));
exports.default = router;
