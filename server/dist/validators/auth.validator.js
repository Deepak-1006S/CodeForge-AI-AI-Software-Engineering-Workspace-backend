"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordValidator = exports.resetPasswordValidator = exports.forgotPasswordValidator = exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
exports.registerValidator = [
    (0, express_validator_1.body)('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2 }).withMessage('Name must be at least 2 characters')
        .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters')
        .matches(/^[a-zA-Z0-9\s''-]+$/).withMessage('Name can only contain letters, numbers, spaces, hyphens, and apostrophes'),
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .isLength({ max: 128 }).withMessage('Password cannot exceed 128 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    (0, express_validator_1.body)('role')
        .optional()
        .isIn(['Admin', 'Manager', 'Developer'])
        .withMessage('Role must be one of: Admin, Manager, Developer'),
];
exports.loginValidator = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('Password is required'),
];
exports.forgotPasswordValidator = [
    (0, express_validator_1.body)('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
];
exports.resetPasswordValidator = [
    (0, express_validator_1.body)('token')
        .trim()
        .notEmpty().withMessage('Reset token is required'),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
];
exports.updatePasswordValidator = [
    (0, express_validator_1.body)('currentPassword')
        .notEmpty().withMessage('Current password is required'),
    (0, express_validator_1.body)('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
        .custom((value, { req }) => {
        if (value === req.body.currentPassword) {
            throw new Error('New password must be different from your current password');
        }
        return true;
    }),
];
