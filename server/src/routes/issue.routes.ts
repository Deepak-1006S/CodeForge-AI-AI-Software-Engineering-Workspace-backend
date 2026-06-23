import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createIssueValidator,
  updateIssueValidator,
  getIssuesValidator,
} from '../validators/issue.validator';
import {
  createIssue,
  getIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  assignIssue,
  updateStatus,
  getActivity,
  getIssuesByProject,
} from '../controllers/issue.controller';

const router = Router();

// All issue routes require authentication
router.use(authenticate);

// GET /api/issues
router.get('/', getIssuesValidator, validate, asyncHandler(getIssues));

// POST /api/issues
router.post('/', createIssueValidator, validate, asyncHandler(createIssue));

// GET /api/issues/project/:projectId — kanban board grouped
router.get('/project/:projectId', asyncHandler(getIssuesByProject));

// GET /api/issues/:id
router.get('/:id', asyncHandler(getIssueById));

// PATCH /api/issues/:id
router.patch('/:id', updateIssueValidator, validate, asyncHandler(updateIssue));

// DELETE /api/issues/:id
router.delete('/:id', asyncHandler(deleteIssue));

// PATCH /api/issues/:id/assign
router.patch('/:id/assign', asyncHandler(assignIssue));

// PATCH /api/issues/:id/status
router.patch('/:id/status', asyncHandler(updateStatus));

// GET /api/issues/:id/activity
router.get('/:id/activity', asyncHandler(getActivity));

export default router;
