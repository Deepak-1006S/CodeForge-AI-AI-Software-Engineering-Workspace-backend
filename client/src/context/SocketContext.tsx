import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from './NotificationContext';
import type { ActivityPayload, NotificationPayload } from '../types/socket';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Map<string, { userId: string; name: string }>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useNotifications();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Map<string, { userId: string; name: string }>>(new Map());

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const token = localStorage.getItem('accessToken');

    const newSocket = io(socketUrl, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      setIsConnected(true);
      if (user?.organizationId) {
        newSocket.emit('join:org', user.organizationId);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('online_users', (users: string[]) => {
      const userMap = new Map();
      users.forEach((userId) => {
        userMap.set(userId, { userId, name: 'Online user' });
      });
      setOnlineUsers(userMap);
    });

    newSocket.on('activity:new', (activity: ActivityPayload) => {
      console.log('Realtime activity:', activity);
    });

    newSocket.on('notification:new', (notification: NotificationPayload) => {
      addNotification({
        _id: notification.id || notification._id || '',
        userId: user._id,
        type: notification.type as any,
        title: notification.title,
        message: notification.message,
        read: false,
        createdAt: notification.createdAt,
        link: notification.link,
        data: notification.data,
      });
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user, addNotification]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};
