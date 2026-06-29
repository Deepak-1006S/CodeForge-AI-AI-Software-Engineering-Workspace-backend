"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReleaseNotesValidator = exports.generateSummaryValidator = exports.analyzeCodeValidator = void 0;
const express_validator_1 = require("express-validator");
// POST /ai/analyze-code
exports.analyzeCodeValidator = [
    (0, express_validator_1.body)('code').notEmpty().withMessage('Code is required'),
    (0, express_validator_1.body)('context').optional().isString().withMessage('Context must be a string'),
];
// POST /ai/generate-summary
exports.generateSummaryValidator = [
    (0, express_validator_1.body)('items').isArray().withMessage('Items must be an array'),
    (0, express_validator_1.body)('type').isIn(['sprint', 'release', 'standup']).withMessage('Invalid summary type'),
];
// POST /ai/generate-release-notes
exports.generateReleaseNotesValidator = [
    (0, express_validator_1.body)('projectId').isMongoId().withMessage('Invalid project ID'),
    (0, express_validator_1.body)('version').notEmpty().withMessage('Version is required'),
];
