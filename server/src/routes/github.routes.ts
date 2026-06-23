import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/auth.middleware';
import {
  connectRepository,
  getRepoDetails,
  getCommits,
  getPullRequestStats,
  getContributors,
} from '../controllers/github.controller';

const router = Router();

// All GitHub routes require authentication
router.use(authenticate);

// POST /api/github/connect — connect repo to a project
router.post('/connect', asyncHandler(connectRepository));

// GET /api/github/projects/:projectId/repo
router.get('/projects/:projectId/repo', asyncHandler(getRepoDetails));

// GET /api/github/projects/:projectId/commits
router.get('/projects/:projectId/commits', asyncHandler(getCommits));

// GET /api/github/projects/:projectId/pull-requests
router.get('/projects/:projectId/pull-requests', asyncHandler(getPullRequestStats));

// GET /api/github/projects/:projectId/contributors
router.get('/projects/:projectId/contributors', asyncHandler(getContributors));

export default router;
