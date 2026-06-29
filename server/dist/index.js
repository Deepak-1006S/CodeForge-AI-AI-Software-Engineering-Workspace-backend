"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const logger_1 = require("./config/logger");
const database_1 = require("./config/database");
const socket_1 = require("./socket");
const server = (0, http_1.createServer)(app_1.default);
const PORT = process.env.PORT || 5001;
// ─── Initialize Socket.IO ─────────────────────────────────────────────────────
(0, socket_1.initializeSocket)(server);
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        logger_1.logger.error(`Port ${env_1.env.port} is already in use. Please stop any other server using this port.`);
        process.exit(1);
    }
    logger_1.logger.error('Server error:', error);
});
// ─── Start Server ─────────────────────────────────────────────────────────────
const startServer = async () => {
    try {
        // Connect to MongoDB first
        await (0, database_1.connectDatabase)();
        // Start HTTP server
        server.listen(env_1.env.port, () => {
            logger_1.logger.info(`Server running in ${env_1.env.nodeEnv} mode on port ${env_1.env.port}`);
            logger_1.logger.info(`API: http://localhost:${env_1.env.port}/api`);
            logger_1.logger.info(`Health: http://localhost:${env_1.env.port}/api/health`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
// ─── Graceful Shutdown ────────────────────────────────────────────────────────
const gracefulShutdown = async (signal) => {
    logger_1.logger.info(`${signal} received. Shutting down gracefully...`);
    if (!server.listening) {
        logger_1.logger.info('Server is not currently listening. Exiting immediately.');
        process.exit(0);
    }
    server.close(async (err) => {
        if (err) {
            logger_1.logger.error('Error during server close:', err);
            process.exit(1);
        }
        try {
            await (0, database_1.disconnectDatabase)();
            logger_1.logger.info('Server shut down successfully');
            process.exit(0);
        }
        catch (dbError) {
            logger_1.logger.error('Error disconnecting database during shutdown:', dbError);
            process.exit(1);
        }
    });
    // Force shutdown after 30 seconds if graceful shutdown hangs
    setTimeout(() => {
        logger_1.logger.error('Forced shutdown after timeout');
        process.exit(1);
    }, 30000).unref();
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
// ─── Unhandled Rejection / Exception Handlers ────────────────────────────────
process.on('unhandledRejection', (reason) => {
    logger_1.logger.error('Unhandled Promise Rejection:', reason);
    if (env_1.env.nodeEnv === 'production') {
        gracefulShutdown('UNHANDLED_REJECTION');
    }
});
process.on('uncaughtException', (error) => {
    logger_1.logger.error('Uncaught Exception:', error);
    gracefulShutdown('UNCAUGHT_EXCEPTION');
});
// ─── Bootstrap ────────────────────────────────────────────────────────────────
startServer();
