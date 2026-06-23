import { Router } from 'express';
import { body } from 'express-validator';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { aiLimiter } from '../middleware/rateLimiter.middleware';
import {
  generateSprintSummary,
  explainBug,
  generateReleaseNotes,
  generateTaskDescription,
  generateStandupReport,
} from '../controllers/ai.controller';

const router = Router();

// All AI routes require authentication + AI-specific rate limiting
router.use(authenticate, aiLimiter);

// POST /api/ai/sprint-summary
router.post(
  '/sprint-summary',
  [
    body('projectId').notEmpty().isMongoId().withMessage('Valid project ID is required'),
    body('startDate').optional().isISO8601().withMessage('Start date must be valid ISO 8601'),
    body('endDate').optional().isISO8601().withMessage('End date must be valid ISO 8601'),
  ],
  validate,
  asyncHandler(generateSprintSummary),
);

// POST /api/ai/explain-bug
router.post(
  '/explain-bug',
  [body('issueId').notEmpty().isMongoId().withMessage('Valid issue ID is required')],
  validate,
  asyncHandler(explainBug),
);

// POST /api/ai/release-notes
router.post(
  '/release-notes',
  [
    body('projectId').notEmpty().isMongoId().withMessage('Valid project ID is required'),
    body('version').optional().isString().withMessage('Version must be a string'),
  ],
  validate,
  asyncHandler(generateReleaseNotes),
);

// POST /api/ai/task-description
router.post(
  '/task-description',
  [
    body('title')
      .notEmpty()
      .isString()
      .isLength({ min: 3, max: 200 })
      .withMessage('Task title must be 3-200 characters'),
  ],
  validate,
  asyncHandler(generateTaskDescription),
);

// POST /api/ai/standup-report
router.post(
  '/standup-report',
  [body('projectId').notEmpty().isMongoId().withMessage('Valid project ID is required')],
  validate,
  asyncHandler(generateStandupReport),
);

export default router;
