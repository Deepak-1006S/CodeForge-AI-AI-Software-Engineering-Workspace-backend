"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnreadCount = exports.deleteNotification = exports.markAllRead = exports.markAsRead = exports.getNotifications = exports.createNotification = void 0;
const mongoose_1 = require("mongoose");
const Notification_1 = require("../models/Notification");
const pagination_1 = require("../utils/pagination");
const ApiError_1 = require("../utils/ApiError");
const logger_1 = require("../config/logger");
const socket_1 = require("../socket");
const getIO = () => {
    try {
        return (0, socket_1.getIO)();
    }
    catch {
        return null;
    }
};
const createNotification = async (data) => {
    try {
        const notification = await Notification_1.Notification.create({
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
    }
    catch (error) {
        logger_1.logger.error('Failed to create notification:', error);
        // Don't throw — notifications are non-critical side effects
        return null;
    }
};
exports.createNotification = createNotification;
const getNotifications = async (userId, page = 1, limit = 20, unreadOnly = false) => {
    const skip = (page - 1) * limit;
    const filter = { recipient: new mongoose_1.Types.ObjectId(userId) };
    if (unreadOnly)
        filter.read = false;
    const [notifications, total] = await Promise.all([
        Notification_1.Notification.find(filter)
            .populate('sender', 'name avatar email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Notification_1.Notification.countDocuments(filter),
    ]);
    const meta = (0, pagination_1.buildPaginationMeta)(total, page, limit);
    return { notifications, meta };
};
exports.getNotifications = getNotifications;
const markAsRead = async (notificationId, userId) => {
    const notification = await Notification_1.Notification.findOneAndUpdate({
        _id: new mongoose_1.Types.ObjectId(notificationId),
        recipient: new mongoose_1.Types.ObjectId(userId),
    }, { read: true }, { new: true });
    if (!notification) {
        throw new ApiError_1.ApiError(404, 'Notification not found or access denied.');
    }
    return notification;
};
exports.markAsRead = markAsRead;
const markAllRead = async (userId) => {
    const result = await Notification_1.Notification.updateMany({ recipient: new mongoose_1.Types.ObjectId(userId), read: false }, { read: true });
    return result.modifiedCount;
};
exports.markAllRead = markAllRead;
const deleteNotification = async (notificationId, userId) => {
    const result = await Notification_1.Notification.deleteOne({
        _id: new mongoose_1.Types.ObjectId(notificationId),
        recipient: new mongoose_1.Types.ObjectId(userId),
    });
    if (result.deletedCount === 0) {
        throw new ApiError_1.ApiError(404, 'Notification not found or access denied.');
    }
};
exports.deleteNotification = deleteNotification;
const getUnreadCount = async (userId) => {
    return Notification_1.Notification.countDocuments({
        recipient: new mongoose_1.Types.ObjectId(userId),
        read: false,
    });
};
exports.getUnreadCount = getUnreadCount;
