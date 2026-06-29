"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserValidator = exports.updateUserValidator = exports.getUserValidator = void 0;
const express_validator_1 = require("express-validator");
// GET /users/:id
exports.getUserValidator = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid user ID'),
];
// PUT /users/:id
exports.updateUserValidator = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid user ID'),
    (0, express_validator_1.body)('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    (0, express_validator_1.body)('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
];
// DELETE /users/:id
exports.deleteUserValidator = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid user ID'),
];
