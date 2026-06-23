import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { logger } from '../config/logger';
import { env } from '../config/env';

interface ErrorResponse {
  success: false;
  message: string;
  errors?: unknown[];
  stack?: string;
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';
  let errors: unknown[] | undefined;

  // ─── ApiError (our custom operational errors) ────────────────────────────
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;

    if (!err.isOperational) {
      logger.error('Non-operational ApiError:', { message: err.message, stack: err.stack });
    }
  }

  // ─── Mongoose Validation Error ───────────────────────────────────────────
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 422;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // ─── Mongoose Duplicate Key (11000) ──────────────────────────────────────
  else if (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    ((err as { code: unknown }).code === 11000 || (err as NodeJS.ErrnoException).code === '11000')
  ) {
    statusCode = 409;
    const keyValueMatch = err.message.match(/dup key: \{[^}]*\}/);
    const field = keyValueMatch
      ? keyValueMatch[0].replace('dup key: ', '')
      : 'field';
    message = `Duplicate value for ${field}. Please use a different value.`;
  }

  // ─── Mongoose CastError (invalid ObjectId) ───────────────────────────────
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid value for field '${err.path}': ${err.value}`;
  }

  // ─── JWT Errors ──────────────────────────────────────────────────────────
  else if (err instanceof TokenExpiredError) {
    statusCode = 401;
    message = 'Your session has expired. Please log in again.';
  } else if (err instanceof JsonWebTokenError) {
    statusCode = 401;
    message = 'Invalid authentication token.';
  }

  // ─── Unknown / Programmer Errors ─────────────────────────────────────────
  else {
    logger.error('Unexpected error:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
    message = env.nodeEnv === 'production' ? 'Internal Server Error' : err.message;
  }

  const responseBody: ErrorResponse = {
    success: false,
    message,
  };

  if (errors) {
    responseBody.errors = errors;
  }

  // Include stack trace in development only
  if (env.nodeEnv === 'development' && err.stack) {
    responseBody.stack = err.stack;
  }

  res.status(statusCode).json(responseBody);
};

// ─── 404 Not Found Handler ────────────────────────────────────────────────────

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};
