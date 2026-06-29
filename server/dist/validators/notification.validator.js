"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllNotificationsReadValidator = exports.deleteNotificationValidator = exports.markNotificationReadValidator = exports.listNotificationsValidator = void 0;
const express_validator_1 = require("express-validator");
// GET /notifications - list notifications
exports.listNotificationsValidator = [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).toInt().withMessage('Page must be >= 1'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('Limit must be 1-100'),
    (0, express_validator_1.query)('read').optional().isBoolean().withMessage('Read must be true/false'),
];
// PUT /notifications/:id/read - mark as read
exports.markNotificationReadValidator = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid notification ID'),
];
// DELETE /notifications/:id - delete notification
exports.deleteNotificationValidator = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid notification ID'),
];
// POST /notifications/mark-all-read - mark all as read
exports.markAllNotificationsReadValidator = [];
