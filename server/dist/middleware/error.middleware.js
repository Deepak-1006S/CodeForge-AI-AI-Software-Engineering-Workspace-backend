"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = require("jsonwebtoken");
const ApiError_1 = require("../utils/ApiError");
const logger_1 = require("../config/logger");
const env_1 = require("../config/env");
const errorHandler = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errors;
    // ─── ApiError (our custom operational errors) ────────────────────────────
    if (err instanceof ApiError_1.ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors;
        if (!err.isOperational) {
            logger_1.logger.error('Non-operational ApiError:', { message: err.message, stack: err.stack });
        }
    }
    // ─── Mongoose Validation Error ───────────────────────────────────────────
    else if (err instanceof mongoose_1.default.Error.ValidationError) {
        statusCode = 422;
        message = 'Validation failed';
        errors = Object.values(err.errors).map((e) => ({
            field: e.path,
            message: e.message,
        }));
    }
    // ─── Mongoose Duplicate Key (11000) ──────────────────────────────────────
    else if (typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err.code === 11000 || err.code === '11000')) {
        statusCode = 409;
        const keyValueMatch = err.message.match(/dup key: \{[^}]*\}/);
        const field = keyValueMatch
            ? keyValueMatch[0].replace('dup key: ', '')
            : 'field';
        message = `Duplicate value for ${field}. Please use a different value.`;
    }
    // ─── Mongoose CastError (invalid ObjectId) ───────────────────────────────
    else if (err instanceof mongoose_1.default.Error.CastError) {
        statusCode = 400;
        message = `Invalid value for field '${err.path}': ${err.value}`;
    }
    // ─── JWT Errors ──────────────────────────────────────────────────────────
    else if (err instanceof jsonwebtoken_1.TokenExpiredError) {
        statusCode = 401;
        message = 'Your session has expired. Please log in again.';
    }
    else if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
        statusCode = 401;
        message = 'Invalid authentication token.';
    }
    // ─── Unknown / Programmer Errors ─────────────────────────────────────────
    else {
        logger_1.logger.error('Unexpected error:', {
            message: err.message,
            stack: err.stack,
            url: req.originalUrl,
            method: req.method,
            ip: req.ip,
        });
        message = env_1.env.nodeEnv === 'production' ? 'Internal Server Error' : err.message;
    }
    const responseBody = {
        success: false,
        message,
    };
    if (errors) {
        responseBody.errors = errors;
    }
    // Include stack trace in development only
    if (env_1.env.nodeEnv === 'development' && err.stack) {
        responseBody.stack = err.stack;
    }
    res.status(statusCode).json(responseBody);
};
exports.errorHandler = errorHandler;
// ─── 404 Not Found Handler ────────────────────────────────────────────────────
const notFoundHandler = (req, _res, next) => {
    next(new ApiError_1.ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
exports.notFoundHandler = notFoundHandler;
