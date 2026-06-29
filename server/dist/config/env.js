"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const parseNumber = (key, fallback) => {
    const rawValue = process.env[key];
    if (!rawValue)
        return fallback;
    const value = Number(rawValue);
    if (!Number.isFinite(value)) {
        throw new Error(`Environment variable ${key} must be a valid number.`);
    }
    return value;
};
const readString = (key, fallback = '') => {
    return process.env[key]?.trim() || fallback;
};
const readNodeEnv = () => {
    const value = readString('NODE_ENV', 'development');
    if (value === 'development' || value === 'test' || value === 'production') {
        return value;
    }
    throw new Error('NODE_ENV must be one of: development, test, production.');
};
const requireEnv = (keys) => {
    const missingVars = keys.filter((key) => !readString(key));
    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
};
requireEnv(['MONGODB_URI']);
if (process.env.NODE_ENV === 'production') {
    requireEnv(['JWT_SECRET', 'JWT_REFRESH_SECRET', 'CLIENT_URL']);
}
exports.env = {
    port: parseNumber('PORT', 5000),
    nodeEnv: readNodeEnv(),
    mongoUri: readString('MONGODB_URI'),
    jwtSecret: readString('JWT_SECRET', 'fallback-secret-change-in-development'),
    jwtExpiresIn: readString('JWT_EXPIRES_IN', '7d'),
    jwtRefreshSecret: readString('JWT_REFRESH_SECRET', 'fallback-refresh-secret-change-in-development'),
    jwtRefreshExpiresIn: readString('JWT_REFRESH_EXPIRES_IN', '30d'),
    clientUrl: readString('CLIENT_URL', 'https://code-forge-ai-ai-software-engineeri.vercel.app'),
    geminiApiKey: readString('GEMINI_API_KEY'),
    githubClientId: readString('GITHUB_CLIENT_ID'),
    githubClientSecret: readString('GITHUB_CLIENT_SECRET'),
    googleClientId: readString('GOOGLE_CLIENT_ID'),
    googleClientSecret: readString('GOOGLE_CLIENT_SECRET'),
    smtpHost: readString('SMTP_HOST', 'smtp.gmail.com'),
    smtpPort: parseNumber('SMTP_PORT', 587),
    smtpUser: readString('SMTP_USER'),
    smtpPass: readString('SMTP_PASS'),
    emailFrom: readString('EMAIL_FROM', 'noreply@codeforge.ai'),
    rateLimitWindowMs: parseNumber('RATE_LIMIT_WINDOW_MS', 900000),
    rateLimitMax: parseNumber('RATE_LIMIT_MAX', 100),
};
