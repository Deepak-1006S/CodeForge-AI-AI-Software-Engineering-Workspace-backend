"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOnline = exports.getOnlineUsers = exports.getIO = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const cors_1 = require("./config/cors");
// ─── Singleton ────────────────────────────────────────────────────────────────
let io = null;
// In-memory tracking of online users: userId → Set of socketIds
const onlineUsers = new Map();
// ─── Helpers ──────────────────────────────────────────────────────────────────
const addOnlineUser = (userId, socketId) => {
    if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socketId);
};
const removeOnlineUser = (userId, socketId) => {
    const sockets = onlineUsers.get(userId);
    if (sockets) {
        sockets.delete(socketId);
        if (sockets.size === 0) {
            onlineUsers.delete(userId);
        }
    }
};
const isUserOnline = (userId) => {
    return onlineUsers.has(userId) && onlineUsers.get(userId).size > 0;
};
// ─── JWT Auth Middleware ──────────────────────────────────────────────────────
const socketAuthMiddleware = (socket, next) => {
    try {
        const token = socket.handshake.auth?.token ||
            socket.handshake.headers?.authorization?.replace('Bearer ', '');
        if (!token) {
            return next(new Error('Authentication token is required'));
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        socket.data.userId = decoded.id;
        socket.data.role = decoded.role;
        socket.data.orgIds = [];
        // Join personal room for targeted notifications
        socket.join(`user:${decoded.id}`);
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return next(new Error('Authentication token has expired'));
        }
        return next(new Error('Invalid authentication token'));
    }
};
// ─── Socket Event Handlers ────────────────────────────────────────────────────
const registerSocketHandlers = (socket) => {
    const userId = socket.data.userId;
    logger_1.logger.debug(`Socket connected: ${socket.id} (user: ${userId})`);
    // Track online status
    addOnlineUser(userId, socket.id);
    // ─── Join/Leave Rooms ────────────────────────────────────────────────────
    socket.on('join:org', (orgId) => {
        if (!orgId)
            return;
        socket.join(`org:${orgId}`);
        if (!socket.data.orgIds.includes(orgId)) {
            socket.data.orgIds.push(orgId);
        }
        // Broadcast online status to org members
        socket.to(`org:${orgId}`).emit('user:online', {
            userId,
            online: true,
            orgId,
        });
        // Send current online users list
        const onlineInOrg = Array.from(onlineUsers.keys());
        socket.emit('online_users', onlineInOrg);
        logger_1.logger.debug(`Socket ${socket.id} joined org room: ${orgId}`);
    });
    socket.on('leave:org', (orgId) => {
        socket.leave(`org:${orgId}`);
        socket.data.orgIds = socket.data.orgIds.filter((id) => id !== orgId);
        logger_1.logger.debug(`Socket ${socket.id} left org room: ${orgId}`);
    });
    socket.on('join:project', (projectId) => {
        if (!projectId)
            return;
        socket.join(`project:${projectId}`);
        logger_1.logger.debug(`Socket ${socket.id} joined project room: ${projectId}`);
    });
    socket.on('leave:project', (projectId) => {
        socket.leave(`project:${projectId}`);
        logger_1.logger.debug(`Socket ${socket.id} left project room: ${projectId}`);
    });
    // ─── Ping/Pong ───────────────────────────────────────────────────────────
    socket.on('ping', () => {
        // Client-side keepalive
    });
    // ─── Disconnect ──────────────────────────────────────────────────────────
    socket.on('disconnect', (reason) => {
        removeOnlineUser(userId, socket.id);
        logger_1.logger.debug(`Socket disconnected: ${socket.id} (user: ${userId}) — ${reason}`);
        // If user has no more active sockets, broadcast offline
        if (!isUserOnline(userId)) {
            socket.data.orgIds.forEach((orgId) => {
                socket.to(`org:${orgId}`).emit('user:offline', {
                    userId,
                    online: false,
                    orgId,
                });
            });
        }
    });
    // ─── Error Handler ───────────────────────────────────────────────────────
    socket.on('error', (error) => {
        logger_1.logger.error(`Socket error for user ${userId}:`, error);
    });
};
// ─── Initialization ───────────────────────────────────────────────────────────
const initializeSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: cors_1.socketCorsOptions,
        pingTimeout: 60000,
        pingInterval: 25000,
        transports: ['websocket', 'polling'],
        allowEIO3: true,
    });
    io.use(socketAuthMiddleware);
    io.on('connection', (socket) => {
        registerSocketHandlers(socket);
    });
    logger_1.logger.info('Socket.IO initialized');
    return io;
};
exports.initializeSocket = initializeSocket;
// ─── Exports ──────────────────────────────────────────────────────────────────
const getIO = () => {
    if (!io) {
        // In case socket hasn't been initialized yet (e.g., during testing)
        // Return a no-op proxy rather than throwing
        throw new Error('Socket.IO has not been initialized. Call initializeSocket() first.');
    }
    return io;
};
exports.getIO = getIO;
const getOnlineUsers = () => {
    return Array.from(onlineUsers.keys());
};
exports.getOnlineUsers = getOnlineUsers;
const isOnline = (userId) => {
    return isUserOnline(userId);
};
exports.isOnline = isOnline;
