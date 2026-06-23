import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  updatePasswordValidator,
} from '../validators/auth.validator';
import {
  register,
  login,
  getMe,
  updatePassword,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  githubLogin,
  githubCallback,
  googleLogin,
  googleCallback,
} from '../controllers/auth.controller';

const router = Router();

// POST /api/auth/register
router.post('/register', registerValidator, validate, asyncHandler(register));

// POST /api/auth/login
router.post('/login', loginValidator, validate, asyncHandler(login));

// GET /api/auth/github/login
router.get('/github/login', asyncHandler(githubLogin));

// GET /api/auth/github/callback
router.get('/github/callback', asyncHandler(githubCallback));

// GET /api/auth/google/login
router.get('/google/login', asyncHandler(googleLogin));

// GET /api/auth/google/callback
router.get('/google/callback', asyncHandler(googleCallback));

// GET /api/auth/me
router.get('/me', authenticate, asyncHandler(getMe));

// PUT /api/auth/password
router.put('/password', authenticate, updatePasswordValidator, validate, asyncHandler(updatePassword));

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPasswordValidator, validate, asyncHandler(forgotPassword));

// POST /api/auth/reset-password
router.post('/reset-password', resetPasswordValidator, validate, asyncHandler(resetPassword));

// POST /api/auth/refresh-token
router.post('/refresh-token', asyncHandler(refreshAccessToken));

export default router;
