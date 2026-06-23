import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/auth.middleware';
import {
  getOverview,
  getProjectMetrics,
  getIssueResolution,
  getTeamActivity,
  getWorkload,
} from '../controllers/dashboard.controller';

const router = Router();

// All dashboard routes require authentication
router.use(authenticate);

// GET /api/dashboard/overview?orgId=xxx
router.get('/overview', asyncHandler(getOverview));

// GET /api/dashboard/project-metrics?orgId=xxx
router.get('/project-metrics', asyncHandler(getProjectMetrics));

// GET /api/dashboard/issue-resolution?orgId=xxx&weeks=8
router.get('/issue-resolution', asyncHandler(getIssueResolution));

// GET /api/dashboard/team-activity?orgId=xxx&limit=20
router.get('/team-activity', asyncHandler(getTeamActivity));

// GET /api/dashboard/workload?orgId=xxx
router.get('/workload', asyncHandler(getWorkload));

export default router;
