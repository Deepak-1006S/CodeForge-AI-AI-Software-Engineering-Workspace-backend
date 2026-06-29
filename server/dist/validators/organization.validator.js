"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMemberRoleValidator = exports.inviteMemberValidator = exports.updateOrgValidator = exports.createOrgValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createOrgValidator = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty().withMessage('Organization name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
        .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
];
exports.updateOrgValidator = [
    (0, express_validator_1.param)('id')
        .isMongoId().withMessage('Invalid organization ID format'),
    (0, express_validator_1.body)('name')
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
        .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
];
exports.inviteMemberValidator = [
    (0, express_validator_1.param)('id')
        .isMongoId().withMessage('Invalid organization ID format'),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('role')
        .optional()
        .isIn(['Admin', 'Manager', 'Developer'])
        .withMessage('Role must be one of: Admin, Manager, Developer'),
];
exports.updateMemberRoleValidator = [
    (0, express_validator_1.param)('id')
        .isMongoId().withMessage('Invalid organization ID format'),
    (0, express_validator_1.param)('userId')
        .isMongoId().withMessage('Invalid user ID format'),
    (0, express_validator_1.body)('role')
        .notEmpty().withMessage('Role is required')
        .isIn(['Admin', 'Manager', 'Developer'])
        .withMessage('Role must be one of: Admin, Manager, Developer'),
];
