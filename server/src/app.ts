import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import { env } from './config/env';
import { corsOptions } from './config/cors';
import { morganStream } from './config/logger';
import { globalLimiter, authLimiter } from './middleware/rateLimiter.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import apiRoutes from './routes/index';

const app: Application = express();

// ─── Security Headers ─────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: env.nodeEnv === 'production',
    crossOriginEmbedderPolicy: false, // Required for some API clients
  }),
);

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Pre-flight for all routes

// ─── Request Logging ─────────────────────────────────────────────────────────
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: morganStream }));
}

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ─── MongoDB Query Injection Prevention ──────────────────────────────────────
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized field '${key}' in request from ${req.ip}`);
  },
}));

// ─── Response Compression ────────────────────────────────────────────────────
app.use(
  compression({
    level: 6,
    threshold: 1024, // Only compress responses > 1KB
    filter: (req, res) => {
      if (req.headers['x-no-compression']) return false;
      return compression.filter(req, res);
    },
  }),
);

// ─── Global Rate Limiter ─────────────────────────────────────────────────────
app.use('/api', globalLimiter);

// ─── Auth-specific Rate Limiter ───────────────────────────────────────────────
app.use('/api/auth', authLimiter);

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api', apiRoutes);

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
app.use(notFoundHandler);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
