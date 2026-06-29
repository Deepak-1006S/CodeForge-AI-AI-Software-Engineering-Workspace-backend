"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const ApiError_1 = require("../utils/ApiError");
/**
 * Generates a short-lived JWT access token.
 */
const generateAccessToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ id: userId, role }, env_1.env.jwtSecret, { expiresIn: env_1.env.jwtExpiresIn });
};
exports.generateAccessToken = generateAccessToken;
/**
 * Generates a long-lived JWT refresh token.
 */
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, env_1.env.jwtRefreshSecret, { expiresIn: env_1.env.jwtRefreshExpiresIn });
};
exports.generateRefreshToken = generateRefreshToken;
/**
 * Verifies an access token and returns its decoded payload.
 * Throws ApiError(401) if invalid or expired.
 */
const verifyAccessToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new ApiError_1.ApiError(401, 'Access token has expired. Please refresh your session.');
        }
        throw new ApiError_1.ApiError(401, 'Invalid access token.');
    }
};
exports.verifyAccessToken = verifyAccessToken;
/**
 * Verifies a refresh token and returns its decoded payload.
 * Throws ApiError(401) if invalid or expired.
 */
const verifyRefreshToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, env_1.env.jwtRefreshSecret);
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new ApiError_1.ApiError(401, 'Refresh token has expired. Please log in again.');
        }
        throw new ApiError_1.ApiError(401, 'Invalid refresh token.');
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
