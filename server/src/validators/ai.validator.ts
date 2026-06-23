import { body, param } from 'express-validator';

// POST /ai/analyze-code
export const analyzeCodeValidator = [
  body('code').notEmpty().withMessage('Code is required'),
  body('context').optional().isString().withMessage('Context must be a string'),
];

// POST /ai/generate-summary
export const generateSummaryValidator = [
  body('items').isArray().withMessage('Items must be an array'),
  body('type').isIn(['sprint', 'release', 'standup']).withMessage('Invalid summary type'),
];

// POST /ai/generate-release-notes
export const generateReleaseNotesValidator = [
  body('projectId').isMongoId().withMessage('Invalid project ID'),
  body('version').notEmpty().withMessage('Version is required'),
];
