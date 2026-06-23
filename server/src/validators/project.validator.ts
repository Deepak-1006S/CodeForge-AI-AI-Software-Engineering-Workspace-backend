import { body, param } from 'express-validator';

export const createProjectValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Project title is required')
    .isLength({ min: 2 }).withMessage('Title must be at least 2 characters')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),

  body('organization')
    .notEmpty().withMessage('Organization ID is required')
    .isMongoId().withMessage('Invalid organization ID format'),

  body('status')
    .optional()
    .isIn(['Planning', 'Active', 'Testing', 'Completed'])
    .withMessage('Status must be one of: Planning, Active, Testing, Completed'),
];

export const updateProjectValidator = [
  param('id')
    .isMongoId().withMessage('Invalid project ID format'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Title must be at least 2 characters')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),

  body('status')
    .optional()
    .isIn(['Planning', 'Active', 'Testing', 'Completed'])
    .withMessage('Status must be one of: Planning, Active, Testing, Completed'),
];

export const addTeamMemberValidator = [
  param('id')
    .isMongoId().withMessage('Invalid project ID format'),

  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isMongoId().withMessage('Invalid user ID format'),
];
