"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIssuesValidator = exports.updateIssueValidator = exports.createIssueValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createIssueValidator = [
    (0, express_validator_1.body)('title')
        .trim()
        .notEmpty().withMessage('Issue title is required')
        .isLength({ min: 2 }).withMessage('Title must be at least 2 characters')
        .isLength({ max: 500 }).withMessage('Title cannot exceed 500 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ max: 10000 }).withMessage('Description cannot exceed 10000 characters'),
    (0, express_validator_1.body)('project')
        .notEmpty().withMessage('Project ID is required')
        .isMongoId().withMessage('Invalid project ID format'),
    (0, express_validator_1.body)('priority')
        .optional()
        .isIn(['Low', 'Medium', 'High', 'Critical'])
        .withMessage('Priority must be one of: Low, Medium, High, Critical'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['Todo', 'In Progress', 'Review', 'Done'])
        .withMessage('Status must be one of: Todo, In Progress, Review, Done'),
    (0, express_validator_1.body)('assignedTo')
        .optional({ nullable: true })
        .isMongoId().withMessage('Invalid assignee ID format'),
    (0, express_validator_1.body)('labels')
        .optional()
        .isArray().withMessage('Labels must be an array')
        .custom((arr) => arr.every((l) => typeof l === 'string'))
        .withMessage('Each label must be a string'),
    (0, express_validator_1.body)('dueDate')
        .optional({ nullable: true })
        .isISO8601().withMessage('Due date must be a valid ISO 8601 date'),
];
exports.updateIssueValidator = [
    (0, express_validator_1.param)('id')
        .isMongoId().withMessage('Invalid issue ID format'),
    (0, express_validator_1.body)('title')
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage('Title must be at least 2 characters')
        .isLength({ max: 500 }).withMessage('Title cannot exceed 500 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ max: 10000 }).withMessage('Description cannot exceed 10000 characters'),
    (0, express_validator_1.body)('priority')
        .optional()
        .isIn(['Low', 'Medium', 'High', 'Critical'])
        .withMessage('Priority must be one of: Low, Medium, High, Critical'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['Todo', 'In Progress', 'Review', 'Done'])
        .withMessage('Status must be one of: Todo, In Progress, Review, Done'),
    (0, express_validator_1.body)('assignedTo')
        .optional({ nullable: true })
        .isMongoId().withMessage('Invalid assignee ID format'),
    (0, express_validator_1.body)('dueDate')
        .optional({ nullable: true })
        .isISO8601().withMessage('Due date must be a valid ISO 8601 date'),
];
exports.getIssuesValidator = [
    (0, express_validator_1.query)('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('priority')
        .optional()
        .isIn(['Low', 'Medium', 'High', 'Critical'])
        .withMessage('Invalid priority filter'),
    (0, express_validator_1.query)('status')
        .optional()
        .isIn(['Todo', 'In Progress', 'Review', 'Done'])
        .withMessage('Invalid status filter'),
];
