"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardActivityValidator = exports.getDashboardStatsValidator = void 0;
const express_validator_1 = require("express-validator");
// GET /dashboard/stats
exports.getDashboardStatsValidator = [
    (0, express_validator_1.query)('organizationId').optional().isMongoId().withMessage('Invalid organization ID'),
    (0, express_validator_1.query)('startDate').optional().isISO8601().withMessage('Invalid start date'),
    (0, express_validator_1.query)('endDate').optional().isISO8601().withMessage('Invalid end date'),
];
// GET /dashboard/activity
exports.getDashboardActivityValidator = [
    (0, express_validator_1.query)('organizationId').optional().isMongoId().withMessage('Invalid organization ID'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).toInt().withMessage('Limit must be 1-100'),
];
