import { query } from 'express-validator';

// GET /dashboard/stats
export const getDashboardStatsValidator = [
  query('organizationId').optional().isMongoId().withMessage('Invalid organization ID'),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date'),
];

// GET /dashboard/activity
export const getDashboardActivityValidator = [
  query('organizationId').optional().isMongoId().withMessage('Invalid organization ID'),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('Limit must be 1-100'),
];
