"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiLimiter = exports.authLimiter = exports.globalLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("../config/env");
const ApiError_1 = require("../utils/ApiError");
/**
 * Global rate limiter: 100 requests per 15 minutes per IP.
 * Applied to all API routes.
 */
exports.globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: env_1.env.rateLimitWindowMs, // 15 minutes default
    max: env_1.env.rateLimitMax, // 100 requests default
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP. Please try again later.',
    handler: (_req, _res, next) => {
        next(new ApiError_1.ApiError(429, 'Too many requests from this IP. Please try again later.'));
    },
    skip: (req) => req.method === 'OPTIONS',
});
/**
 * Auth rate limiter: 10 requests per 15 minutes.
 * Applied to /api/auth routes to prevent brute force.
 */
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) => {
        next(new ApiError_1.ApiError(429, 'Too many authentication attempts. Please try again in 15 minutes.'));
    },
    skip: (req) => req.method === 'OPTIONS',
});
/**
 * AI rate limiter: 20 requests per 15 minutes.
 * Applied to /api/ai routes to manage Gemini API quota.
 */
exports.aiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, _res, next) => {
        next(new ApiError_1.ApiError(429, 'AI request limit reached. Please wait before making more AI requests.'));
    },
    skip: (req) => req.method === 'OPTIONS',
});
