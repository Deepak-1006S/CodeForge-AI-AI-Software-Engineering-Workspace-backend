"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const rateLimiter_middleware_1 = require("../middleware/rateLimiter.middleware");
const ai_controller_1 = require("../controllers/ai.controller");
const router = (0, express_1.Router)();
// All AI routes require authentication + AI-specific rate limiting
router.use(auth_middleware_1.authenticate, rateLimiter_middleware_1.aiLimiter);
// POST /api/ai/sprint-summary
router.post('/sprint-summary', [
    (0, express_validator_1.body)('projectId').notEmpty().isMongoId().withMessage('Valid project ID is required'),
    (0, express_validator_1.body)('startDate').optional().isISO8601().withMessage('Start date must be valid ISO 8601'),
    (0, express_validator_1.body)('endDate').optional().isISO8601().withMessage('End date must be valid ISO 8601'),
], validate_middleware_1.validate, (0, asyncHandler_1.asyncHandler)(ai_controller_1.generateSprintSummary));
// POST /api/ai/explain-bug
router.post('/explain-bug', [(0, express_validator_1.body)('issueId').notEmpty().isMongoId().withMessage('Valid issue ID is required')], validate_middleware_1.validate, (0, asyncHandler_1.asyncHandler)(ai_controller_1.explainBug));
// POST /api/ai/release-notes
router.post('/release-notes', [
    (0, express_validator_1.body)('projectId').notEmpty().isMongoId().withMessage('Valid project ID is required'),
    (0, express_validator_1.body)('version').optional().isString().withMessage('Version must be a string'),
], validate_middleware_1.validate, (0, asyncHandler_1.asyncHandler)(ai_controller_1.generateReleaseNotes));
// POST /api/ai/task-description
router.post('/task-description', [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .isString()
        .isLength({ min: 3, max: 200 })
        .withMessage('Task title must be 3-200 characters'),
], validate_middleware_1.validate, (0, asyncHandler_1.asyncHandler)(ai_controller_1.generateTaskDescription));
// POST /api/ai/standup-report
router.post('/standup-report', [(0, express_validator_1.body)('projectId').notEmpty().isMongoId().withMessage('Valid project ID is required')], validate_middleware_1.validate, (0, asyncHandler_1.asyncHandler)(ai_controller_1.generateStandupReport));
exports.default = router;
