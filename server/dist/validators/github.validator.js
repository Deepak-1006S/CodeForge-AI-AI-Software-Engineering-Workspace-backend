"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkRepositoryValidator = exports.getRepositoriesValidator = exports.connectGitHubValidator = void 0;
const express_validator_1 = require("express-validator");
// POST /github/connect
exports.connectGitHubValidator = [
    (0, express_validator_1.body)('code').notEmpty().withMessage('GitHub authorization code is required'),
];
// GET /github/repositories
exports.getRepositoriesValidator = [];
// POST /github/link-repository
exports.linkRepositoryValidator = [
    (0, express_validator_1.body)('repositoryId').notEmpty().withMessage('Repository ID is required'),
    (0, express_validator_1.body)('projectId').isMongoId().withMessage('Invalid project ID'),
];
