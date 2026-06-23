import crypto from 'crypto';

/**
 * Generates a cryptographically secure random token.
 * Used for password resets, email invitations, and email verification.
 *
 * @param byteLength - Number of random bytes (default: 32, produces 64-char hex string)
 * @returns Hex-encoded random token string
 */
export const generateToken = (byteLength = 32): string => {
  return crypto.randomBytes(byteLength).toString('hex');
};

/**
 * Generates a secure token and its SHA-256 hash.
 * Store the hash in the database, send the raw token to the user.
 *
 * @returns { token, hashedToken }
 */
export const generateHashedToken = (byteLength = 32): { token: string; hashedToken: string } => {
  const token = crypto.randomBytes(byteLength).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  return { token, hashedToken };
};

/**
 * Hashes an existing token using SHA-256 (for lookups against stored hashed tokens).
 */
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
