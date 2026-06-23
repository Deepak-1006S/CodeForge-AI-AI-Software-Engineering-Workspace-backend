import { body, param } from 'express-validator';

export const createOrgValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Organization name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
];

export const updateOrgValidator = [
  param('id')
    .isMongoId().withMessage('Invalid organization ID format'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
];

export const inviteMemberValidator = [
  param('id')
    .isMongoId().withMessage('Invalid organization ID format'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('role')
    .optional()
    .isIn(['Admin', 'Manager', 'Developer'])
    .withMessage('Role must be one of: Admin, Manager, Developer'),
];

export const updateMemberRoleValidator = [
  param('id')
    .isMongoId().withMessage('Invalid organization ID format'),

  param('userId')
    .isMongoId().withMessage('Invalid user ID format'),

  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['Admin', 'Manager', 'Developer'])
    .withMessage('Role must be one of: Admin, Manager, Developer'),
];
