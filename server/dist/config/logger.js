"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganStream = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./env");
const { combine, timestamp, printf, colorize, json, errors } = winston_1.default.format;
const devFormat = combine(colorize({ all: true }), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), errors({ stack: true }), printf(({ level, message, timestamp: ts, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${ts}] ${level}: ${stack || message}${metaStr}`;
}));
const prodFormat = combine(timestamp(), errors({ stack: true }), json());
const transports = [
    new winston_1.default.transports.Console({
        format: env_1.env.nodeEnv === 'production' ? prodFormat : devFormat,
    }),
];
if (env_1.env.nodeEnv === 'production') {
    transports.push(new winston_1.default.transports.File({
        filename: path_1.default.join('logs', 'error.log'),
        level: 'error',
        format: prodFormat,
        maxsize: 10 * 1024 * 1024, // 10MB
        maxFiles: 5,
    }), new winston_1.default.transports.File({
        filename: path_1.default.join('logs', 'combined.log'),
        format: prodFormat,
        maxsize: 10 * 1024 * 1024,
        maxFiles: 10,
    }));
}
exports.logger = winston_1.default.createLogger({
    level: env_1.env.nodeEnv === 'production' ? 'info' : 'debug',
    transports,
    exitOnError: false,
});
// Stream for morgan
exports.morganStream = {
    write: (message) => {
        exports.logger.http(message.trim());
    },
};
