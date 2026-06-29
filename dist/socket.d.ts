import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from './types/socket';
type TypedServer = SocketIOServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
export declare const initializeSocket: (server: HTTPServer) => TypedServer;
export declare const getIO: () => TypedServer;
export declare const getOnlineUsers: () => string[];
export declare const isOnline: (userId: string) => boolean;
export {};
//# sourceMappingURL=socket.d.ts.map