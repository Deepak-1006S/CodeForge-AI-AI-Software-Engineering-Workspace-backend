"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const ApiError_1 = require("../utils/ApiError");
/**
 * Role-Based Access Control middleware.
 * Restricts route access to users with one of the specified roles.
 *
 * @param roles - One or more allowed roles
 * @example router.delete('/org/:id', authenticate, authorize('Admin'), deleteOrg)
 */
const authorize = (...roles) => {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new ApiError_1.ApiError(401, 'Authentication required.'));
        }
        if (!roles.includes(req.user.role)) {
            return next(new ApiError_1.ApiError(403, `Access denied. Required role(s): ${roles.join(', ')}. Your role: ${req.user.role}`));
        }
        next();
    };
};
exports.authorize = authorize;
