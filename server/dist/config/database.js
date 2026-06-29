"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectDatabase = exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const logger_1 = require("./logger");
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const connectDatabase = async (retries = MAX_RETRIES) => {
    try {
        mongoose_1.default.set('strictQuery', true);
        const conn = await mongoose_1.default.connect(env_1.env.mongoUri, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 2,
        });
        logger_1.logger.info(`MongoDB connected: ${conn.connection.host}`);
        mongoose_1.default.connection.on('error', (error) => {
            logger_1.logger.error('MongoDB connection error:', error);
        });
        mongoose_1.default.connection.on('disconnected', () => {
            logger_1.logger.warn('MongoDB disconnected. Attempting to reconnect...');
        });
        mongoose_1.default.connection.on('reconnected', () => {
            logger_1.logger.info('MongoDB reconnected');
        });
    }
    catch (error) {
        if (retries > 0) {
            logger_1.logger.warn(`MongoDB connection failed. Retrying in ${RETRY_DELAY_MS / 1000}s... (${retries} retries left)`);
            await sleep(RETRY_DELAY_MS);
            return (0, exports.connectDatabase)(retries - 1);
        }
        logger_1.logger.error('MongoDB connection failed after all retries:', error);
        process.exit(1);
    }
};
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async () => {
    try {
        await mongoose_1.default.connection.close();
        logger_1.logger.info('MongoDB disconnected gracefully');
    }
    catch (error) {
        logger_1.logger.error('Error disconnecting MongoDB:', error);
    }
};
exports.disconnectDatabase = disconnectDatabase;
