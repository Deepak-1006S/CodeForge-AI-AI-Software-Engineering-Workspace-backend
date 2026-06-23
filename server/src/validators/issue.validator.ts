import { body, param, query } from 'express-validator';

export const createIssueValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Issue title is required')
    .isLength({ min: 2 }).withMessage('Title must be at least 2 characters')
    .isLength({ max: 500 }).withMessage('Title cannot exceed 500 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 10000 }).withMessage('Description cannot exceed 10000 characters'),

  body('project')
    .notEmpty().withMessage('Project ID is required')
    .isMongoId().withMessage('Invalid project ID format'),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Priority must be one of: Low, Medium, High, Critical'),

  body('status')
    .optional()
    .isIn(['Todo', 'In Progress', 'Review', 'Done'])
    .withMessage('Status must be one of: Todo, In Progress, Review, Done'),

  body('assignedTo')
    .optional({ nullable: true })
    .isMongoId().withMessage('Invalid assignee ID format'),

  body('labels')
    .optional()
    .isArray().withMessage('Labels must be an array')
    .custom((arr: unknown[]) => arr.every((l) => typeof l === 'string'))
    .withMessage('Each label must be a string'),

  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('Due date must be a valid ISO 8601 date'),
];

export const updateIssueValidator = [
  param('id')
    .isMongoId().withMessage('Invalid issue ID format'),

  body('title')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Title must be at least 2 characters')
    .isLength({ max: 500 }).withMessage('Title cannot exceed 500 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 10000 }).withMessage('Description cannot exceed 10000 characters'),

  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Priority must be one of: Low, Medium, High, Critical'),

  body('status')
    .optional()
    .isIn(['Todo', 'In Progress', 'Review', 'Done'])
    .withMessage('Status must be one of: Todo, In Progress, Review, Done'),

  body('assignedTo')
    .optional({ nullable: true })
    .isMongoId().withMessage('Invalid assignee ID format'),

  body('dueDate')
    .optional({ nullable: true })
    .isISO8601().withMessage('Due date must be a valid ISO 8601 date'),
];

export const getIssuesValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),

  query('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High', 'Critical'])
    .withMessage('Invalid priority filter'),

  query('status')
    .optional()
    .isIn(['Todo', 'In Progress', 'Review', 'Done'])
    .withMessage('Invalid status filter'),
];
