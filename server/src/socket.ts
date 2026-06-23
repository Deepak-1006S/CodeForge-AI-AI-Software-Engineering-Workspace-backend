import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from './config/env';
import { logger } from './config/logger';
import { socketCorsOptions } from './config/cors';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from './types/socket';

type TypedServer = SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

type TypedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

// ─── Singleton ────────────────────────────────────────────────────────────────

let io: TypedServer | null = null;

// In-memory tracking of online users: userId → Set of socketIds
const onlineUsers = new Map<string, Set<string>>();

// ─── Helpers ──────────────────────────────────────────────────────────────────

const addOnlineUser = (userId: string, socketId: string): void => {
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }
  onlineUsers.get(userId)!.add(socketId);
};

const removeOnlineUser = (userId: string, socketId: string): void => {
  const sockets = onlineUsers.get(userId);
  if (sockets) {
    sockets.delete(socketId);
    if (sockets.size === 0) {
      onlineUsers.delete(userId);
    }
  }
};

const isUserOnline = (userId: string): boolean => {
  return onlineUsers.has(userId) && onlineUsers.get(userId)!.size > 0;
};

// ─── JWT Auth Middleware ──────────────────────────────────────────────────────

const socketAuthMiddleware = (socket: TypedSocket, next: (err?: Error) => void): void => {
  try {
    const token =
      (socket.handshake.auth?.token as string) ||
      (socket.handshake.headers?.authorization?.replace('Bearer ', '') as string);

    if (!token) {
      return next(new Error('Authentication token is required'));
    }

    const decoded = jwt.verify(token, env.jwtSecret) as { id: string; role: string };

    socket.data.userId = decoded.id;
    socket.data.role = decoded.role;
    socket.data.orgIds = [];

    // Join personal room for targeted notifications
    socket.join(`user:${decoded.id}`);

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new Error('Authentication token has expired'));
    }
    return next(new Error('Invalid authentication token'));
  }
};

// ─── Socket Event Handlers ────────────────────────────────────────────────────

const registerSocketHandlers = (socket: TypedSocket): void => {
  const userId = socket.data.userId;

  logger.debug(`Socket connected: ${socket.id} (user: ${userId})`);

  // Track online status
  addOnlineUser(userId, socket.id);

  // ─── Join/Leave Rooms ────────────────────────────────────────────────────

  socket.on('join:org', (orgId: string) => {
    if (!orgId) return;
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
    logger.debug(`Socket ${socket.id} joined org room: ${orgId}`);
  });

  socket.on('leave:org', (orgId: string) => {
    socket.leave(`org:${orgId}`);
    socket.data.orgIds = socket.data.orgIds.filter((id) => id !== orgId);
    logger.debug(`Socket ${socket.id} left org room: ${orgId}`);
  });

  socket.on('join:project', (projectId: string) => {
    if (!projectId) return;
    socket.join(`project:${projectId}`);
    logger.debug(`Socket ${socket.id} joined project room: ${projectId}`);
  });

  socket.on('leave:project', (projectId: string) => {
    socket.leave(`project:${projectId}`);
    logger.debug(`Socket ${socket.id} left project room: ${projectId}`);
  });

  // ─── Ping/Pong ───────────────────────────────────────────────────────────

  socket.on('ping', () => {
    // Client-side keepalive
  });

  // ─── Disconnect ──────────────────────────────────────────────────────────

  socket.on('disconnect', (reason) => {
    removeOnlineUser(userId, socket.id);
    logger.debug(`Socket disconnected: ${socket.id} (user: ${userId}) — ${reason}`);

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
    logger.error(`Socket error for user ${userId}:`, error);
  });
};

// ─── Initialization ───────────────────────────────────────────────────────────

export const initializeSocket = (server: HTTPServer): TypedServer => {
  io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(
    server,
    {
      cors: socketCorsOptions,
      pingTimeout: 60000,
      pingInterval: 25000,
      transports: ['websocket', 'polling'],
      allowEIO3: true,
    },
  );

  io.use(socketAuthMiddleware);

  io.on('connection', (socket: TypedSocket) => {
    registerSocketHandlers(socket);
  });

  logger.info('Socket.IO initialized');
  return io;
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const getIO = (): TypedServer => {
  if (!io) {
    // In case socket hasn't been initialized yet (e.g., during testing)
    // Return a no-op proxy rather than throwing
    throw new Error('Socket.IO has not been initialized. Call initializeSocket() first.');
  }
  return io;
};

export const getOnlineUsers = (): string[] => {
  return Array.from(onlineUsers.keys());
};

export const isOnline = (userId: string): boolean => {
  return isUserOnline(userId);
};
