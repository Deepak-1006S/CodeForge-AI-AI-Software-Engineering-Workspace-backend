import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/rbac.middleware';
import { uploadAvatar as uploadAvatarMiddleware } from '../middleware/upload.middleware';
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  getUsers,
} from '../controllers/user.controller';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// GET /api/users — Admin only
router.get('/', authorize('Admin'), asyncHandler(getUsers));

// GET /api/users/me
router.get('/me', asyncHandler(getProfile));

// PATCH /api/users/me
router.patch('/me', asyncHandler(updateProfile));

// POST /api/users/me/avatar
router.post('/me/avatar', uploadAvatarMiddleware, asyncHandler(uploadAvatar));

export default router;
