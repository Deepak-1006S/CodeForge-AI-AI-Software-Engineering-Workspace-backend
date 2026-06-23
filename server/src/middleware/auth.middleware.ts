import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';
import { User } from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';

interface JwtPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new ApiError(401, 'Authentication token is missing. Please log in.'));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return next(new ApiError(401, 'Authentication token is missing. Please log in.'));
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, env.jwtSecret) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return next(new ApiError(401, 'Your session has expired. Please log in again.'));
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return next(new ApiError(401, 'Invalid authentication token. Please log in again.'));
      }
      return next(new ApiError(401, 'Authentication failed.'));
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return next(new ApiError(401, 'User associated with this token no longer exists.'));
    }

    req.user = user as typeof req.user;
    next();
  },
);
