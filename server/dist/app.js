"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const env_1 = require("./config/env");
const cors_2 = require("./config/cors");
const logger_1 = require("./config/logger");
const rateLimiter_middleware_1 = require("./middleware/rateLimiter.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
const index_1 = __importDefault(require("./routes/index"));
const app = (0, express_1.default)();
// ─── Security Headers ─────────────────────────────────────────────────────────
app.use((0, helmet_1.default)({
    contentSecurityPolicy: env_1.env.nodeEnv === 'production',
    crossOriginEmbedderPolicy: false, // Required for some API clients
}));
// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use((0, cors_1.default)(cors_2.corsOptions));
app.options('*', (0, cors_1.default)(cors_2.corsOptions)); // Pre-flight for all routes
// ─── Request Logging ─────────────────────────────────────────────────────────
if (env_1.env.nodeEnv === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined', { stream: logger_1.morganStream }));
}
// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
// ─── MongoDB Query Injection Prevention ──────────────────────────────────────
app.use((0, express_mongo_sanitize_1.default)({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        console.warn(`Sanitized field '${key}' in request from ${req.ip}`);
    },
}));
// ─── Response Compression ────────────────────────────────────────────────────
app.use((0, compression_1.default)({
    level: 6,
    threshold: 1024, // Only compress responses > 1KB
    filter: (req, res) => {
        if (req.headers['x-no-compression'])
            return false;
        return compression_1.default.filter(req, res);
    },
}));
// ─── Global Rate Limiter ─────────────────────────────────────────────────────
app.use('/api', rateLimiter_middleware_1.globalLimiter);
// ─── Auth-specific Rate Limiter ───────────────────────────────────────────────
app.use('/api/auth', rateLimiter_middleware_1.authLimiter);
// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', index_1.default);
// ─── Root Route ───────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
    res.status(200).json({
        name: 'CodeForge AI API',
        version: '1.0.0',
        status: 'running',
        docs: '/api/health',
    });
});
// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use(error_middleware_1.notFoundHandler);
// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(error_middleware_1.errorHandler);
exports.default = app;
