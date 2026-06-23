import { createServer } from 'http';
import app from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { connectDatabase, disconnectDatabase } from './config/database';
import { initializeSocket } from './socket';

const server = createServer(app);
const PORT = process.env.PORT || 5001;
// ─── Initialize Socket.IO ─────────────────────────────────────────────────────
initializeSocket(server);

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    logger.error(`Port ${env.port} is already in use. Please stop any other server using this port.`);
    process.exit(1);
  }

  logger.error('Server error:', error);
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB first
    await connectDatabase();

    // Start HTTP server
    server.listen(env.port, () => {
      logger.info(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
      logger.info(`API: http://localhost:${env.port}/api`);
      logger.info(`Health: http://localhost:${env.port}/api/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received. Shutting down gracefully...`);

  if (!server.listening) {
    logger.info('Server is not currently listening. Exiting immediately.');
    process.exit(0);
  }

  server.close(async (err) => {
    if (err) {
      logger.error('Error during server close:', err);
      process.exit(1);
    }

    try {
      await disconnectDatabase();
      logger.info('Server shut down successfully');
      process.exit(0);
    } catch (dbError) {
      logger.error('Error disconnecting database during shutdown:', dbError);
      process.exit(1);
    }
  });

  // Force shutdown after 30 seconds if graceful shutdown hangs
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000).unref();
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ─── Unhandled Rejection / Exception Handlers ────────────────────────────────
process.on('unhandledRejection', (reason: unknown) => {
  logger.error('Unhandled Promise Rejection:', reason);
  if (env.nodeEnv === 'production') {
    gracefulShutdown('UNHANDLED_REJECTION');
  }
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception:', error);
  gracefulShutdown('UNCAUGHT_EXCEPTION');
});

// ─── Bootstrap ────────────────────────────────────────────────────────────────
startServer();
