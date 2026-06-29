"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashToken = exports.generateHashedToken = exports.generateToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Generates a cryptographically secure random token.
 * Used for password resets, email invitations, and email verification.
 *
 * @param byteLength - Number of random bytes (default: 32, produces 64-char hex string)
 * @returns Hex-encoded random token string
 */
const generateToken = (byteLength = 32) => {
    return crypto_1.default.randomBytes(byteLength).toString('hex');
};
exports.generateToken = generateToken;
/**
 * Generates a secure token and its SHA-256 hash.
 * Store the hash in the database, send the raw token to the user.
 *
 * @returns { token, hashedToken }
 */
const generateHashedToken = (byteLength = 32) => {
    const token = crypto_1.default.randomBytes(byteLength).toString('hex');
    const hashedToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
    return { token, hashedToken };
};
exports.generateHashedToken = generateHashedToken;
/**
 * Hashes an existing token using SHA-256 (for lookups against stored hashed tokens).
 */
const hashToken = (token) => {
    return crypto_1.default.createHash('sha256').update(token).digest('hex');
};
exports.hashToken = hashToken;
