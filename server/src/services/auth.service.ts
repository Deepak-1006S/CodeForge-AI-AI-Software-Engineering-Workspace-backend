import jwt, { JwtPayload } from 'jsonwebtoken';
import { env } from '../config/env';
import { ApiError } from '../utils/ApiError';

interface TokenPayload {
  id: string;
  role: string;
}

/**
 * Generates a short-lived JWT access token.
 */
export const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign(
    { id: userId, role } as TokenPayload,
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn } as jwt.SignOptions,
  );
};

/**
 * Generates a long-lived JWT refresh token.
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { id: userId },
    env.jwtRefreshSecret,
    { expiresIn: env.jwtRefreshExpiresIn } as jwt.SignOptions,
  );
};

/**
 * Verifies an access token and returns its decoded payload.
 * Throws ApiError(401) if invalid or expired.
 */
export const verifyAccessToken = (token: string): JwtPayload & TokenPayload => {
  try {
    return jwt.verify(token, env.jwtSecret) as JwtPayload & TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, 'Access token has expired. Please refresh your session.');
    }
    throw new ApiError(401, 'Invalid access token.');
  }
};

/**
 * Verifies a refresh token and returns its decoded payload.
 * Throws ApiError(401) if invalid or expired.
 */
export const verifyRefreshToken = (token: string): JwtPayload & { id: string } => {
  try {
    return jwt.verify(token, env.jwtRefreshSecret) as JwtPayload & { id: string };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new ApiError(401, 'Refresh token has expired. Please log in again.');
    }
    throw new ApiError(401, 'Invalid refresh token.');
  }
};
