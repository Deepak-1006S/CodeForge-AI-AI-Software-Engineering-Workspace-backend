"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketCorsOptions = exports.corsOptions = void 0;
const env_1 = require("./env");
const allowedOrigins = [
    env_1.env.clientUrl,
    'https://code-forge-ai-ai-software-engineeri.vercel.app',
    'https://codeforge-ai-ai-software-engineering.onrender.com',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
];
const isAllowedOrigin = (origin) => {
    if (!origin) {
        return true;
    }
    if (allowedOrigins.includes(origin)) {
        return true;
    }
    if (/^https:\/\/.*\.vercel\.app$/i.test(origin)) {
        return true;
    }
    return /^(https?:\/\/)(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
};
exports.corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) {
            return callback(null, true);
        }
        if (isAllowedOrigin(origin)) {
            callback(null, true);
        }
        else if (env_1.env.nodeEnv === 'development') {
            // Be more permissive in development
            callback(null, true);
        }
        else {
            callback(new Error(`CORS: Origin '${origin}' not allowed`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Cache-Control',
    ],
    exposedHeaders: ['X-Total-Count', 'X-Page', 'X-Limit'],
    maxAge: 86400, // 24 hours preflight cache
};
// Socket.IO CORS config (matches corsOptions)
exports.socketCorsOptions = {
    origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
            return callback(null, true);
        }
        callback(new Error(`Socket CORS: Origin '${origin}' not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST'],
};
