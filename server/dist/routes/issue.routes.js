"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const issue_validator_1 = require("../validators/issue.validator");
const issue_controller_1 = require("../controllers/issue.controller");
const router = (0, express_1.Router)();
// All issue routes require authentication
router.use(auth_middleware_1.authenticate);
// GET /api/issues
router.get('/', issue_validator_1.getIssuesValidator, validate_middleware_1.validate, (0, asyncHandler_1.asyncHandler)(issue_controller_1.getIssues));
// POST /api/issues
router.post('/', issue_validator_1.createIssueValidator, validate_middleware_1.validate, (0, asyncHandler_1.asyncHandler)(issue_controller_1.createIssue));
// GET /api/issues/project/:projectId — kanban board grouped
router.get('/project/:projectId', (0, asyncHandler_1.asyncHandler)(issue_controller_1.getIssuesByProject));
// GET /api/issues/:id
router.get('/:id', (0, asyncHandler_1.asyncHandler)(issue_controller_1.getIssueById));
// PATCH /api/issues/:id
router.patch('/:id', issue_validator_1.updateIssueValidator, validate_middleware_1.validate, (0, asyncHandler_1.asyncHandler)(issue_controller_1.updateIssue));
// DELETE /api/issues/:id
router.delete('/:id', (0, asyncHandler_1.asyncHandler)(issue_controller_1.deleteIssue));
// PATCH /api/issues/:id/assign
router.patch('/:id/assign', (0, asyncHandler_1.asyncHandler)(issue_controller_1.assignIssue));
// PATCH /api/issues/:id/status
router.patch('/:id/status', (0, asyncHandler_1.asyncHandler)(issue_controller_1.updateStatus));
// GET /api/issues/:id/activity
router.get('/:id/activity', (0, asyncHandler_1.asyncHandler)(issue_controller_1.getActivity));
exports.default = router;
