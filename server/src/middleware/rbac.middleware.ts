import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

/**
 * Role-Based Access Control middleware.
 * Restricts route access to users with one of the specified roles.
 *
 * @param roles - One or more allowed roles
 * @example router.delete('/org/:id', authenticate, authorize('Admin'), deleteOrg)
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}`,
        ),
      );
    }

    next();
  };
};
