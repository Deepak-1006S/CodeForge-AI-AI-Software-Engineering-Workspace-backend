import { body, query, param } from 'express-validator';

// GET /users/:id
export const getUserValidator = [
  param('id').isMongoId().withMessage('Invalid user ID'),
];

// PUT /users/:id
export const updateUserValidator = [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
];

// DELETE /users/:id
export const deleteUserValidator = [
  param('id').isMongoId().withMessage('Invalid user ID'),
];
