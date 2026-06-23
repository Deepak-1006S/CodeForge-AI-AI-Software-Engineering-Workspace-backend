import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createProjectValidator,
  updateProjectValidator,
  addTeamMemberValidator,
} from '../validators/project.validator';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  updateStatus,
  getProjectStats,
  addTeamMember,
  removeTeamMember,
} from '../controllers/project.controller';

const router = Router();

// All project routes require authentication
router.use(authenticate);

// GET /api/projects
router.get('/', asyncHandler(getProjects));

// POST /api/projects
router.post('/', createProjectValidator, validate, asyncHandler(createProject));

// GET /api/projects/:id
router.get('/:id', asyncHandler(getProjectById));

// PATCH /api/projects/:id
router.patch('/:id', updateProjectValidator, validate, asyncHandler(updateProject));

// DELETE /api/projects/:id
router.delete('/:id', asyncHandler(deleteProject));

// PATCH /api/projects/:id/status
router.patch('/:id/status', asyncHandler(updateStatus));

// GET /api/projects/:id/stats
router.get('/:id/stats', asyncHandler(getProjectStats));

// POST /api/projects/:id/team
router.post('/:id/team', addTeamMemberValidator, validate, asyncHandler(addTeamMember));

// DELETE /api/projects/:id/team/:userId
router.delete('/:id/team/:userId', asyncHandler(removeTeamMember));

export default router;
