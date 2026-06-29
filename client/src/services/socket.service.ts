import { io, Socket } from 'socket.io-client';

const isProduction = import.meta.env.PROD;
const defaultSocketUrl = isProduction
  ? 'https://codeforge-ai-ai-software-engineering.onrender.com'
  : 'http://localhost:5000';

const socketUrl = import.meta.env.VITE_SOCKET_URL || defaultSocketUrl;

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (socket && socket.connected) return socket;

  socket = io(socketUrl, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

