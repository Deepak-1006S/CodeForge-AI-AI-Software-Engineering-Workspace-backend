import rateLimit from 'express-rate-limit';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

/**
 * Global rate limiter: 100 requests per 15 minutes per IP.
 * Applied to all API routes.
 */
export const globalLimiter = rateLimit({
  windowMs: env.rateLimitWindowMs, // 15 minutes default
  max: env.rateLimitMax,           // 100 requests default
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP. Please try again later.',
  handler: (_req, _res, next) => {
    next(new ApiError(429, 'Too many requests from this IP. Please try again later.'));
  },
  skip: (req) => req.method === 'OPTIONS',
});

/**
 * Auth rate limiter: 10 requests per 15 minutes.
 * Applied to /api/auth routes to prevent brute force.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new ApiError(429, 'Too many authentication attempts. Please try again in 15 minutes.'));
  },
  skip: (req) => req.method === 'OPTIONS',
});

/**
 * AI rate limiter: 20 requests per 15 minutes.
 * Applied to /api/ai routes to manage Gemini API quota.
 */
export const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new ApiError(429, 'AI request limit reached. Please wait before making more AI requests.'));
  },
  skip: (req) => req.method === 'OPTIONS',
});
