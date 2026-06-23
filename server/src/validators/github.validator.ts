import { body, param } from 'express-validator';

// POST /github/connect
export const connectGitHubValidator = [
  body('code').notEmpty().withMessage('GitHub authorization code is required'),
];

// GET /github/repositories
export const getRepositoriesValidator = [];

// POST /github/link-repository
export const linkRepositoryValidator = [
  body('repositoryId').notEmpty().withMessage('Repository ID is required'),
  body('projectId').isMongoId().withMessage('Invalid project ID'),
];
