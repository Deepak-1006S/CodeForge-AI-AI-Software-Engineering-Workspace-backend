"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const ApiError_1 = require("../utils/ApiError");
const User_1 = require("../models/User");
const asyncHandler_1 = require("../utils/asyncHandler");
exports.authenticate = (0, asyncHandler_1.asyncHandler)(async (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ApiError_1.ApiError(401, 'Authentication token is missing. Please log in.'));
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return next(new ApiError_1.ApiError(401, 'Authentication token is missing. Please log in.'));
    }
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return next(new ApiError_1.ApiError(401, 'Your session has expired. Please log in again.'));
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return next(new ApiError_1.ApiError(401, 'Invalid authentication token. Please log in again.'));
        }
        return next(new ApiError_1.ApiError(401, 'Authentication failed.'));
    }
    const user = await User_1.User.findById(decoded.id).select('-password');
    if (!user) {
        return next(new ApiError_1.ApiError(401, 'User associated with this token no longer exists.'));
    }
    req.user = user;
    next();
});
