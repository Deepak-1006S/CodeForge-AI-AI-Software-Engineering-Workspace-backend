"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_middleware_1 = require("../middleware/auth.middleware");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const router = (0, express_1.Router)();
// All dashboard routes require authentication
router.use(auth_middleware_1.authenticate);
// GET /api/dashboard/overview?orgId=xxx
router.get('/overview', (0, asyncHandler_1.asyncHandler)(dashboard_controller_1.getOverview));
// GET /api/dashboard/project-metrics?orgId=xxx
router.get('/project-metrics', (0, asyncHandler_1.asyncHandler)(dashboard_controller_1.getProjectMetrics));
// GET /api/dashboard/issue-resolution?orgId=xxx&weeks=8
router.get('/issue-resolution', (0, asyncHandler_1.asyncHandler)(dashboard_controller_1.getIssueResolution));
// GET /api/dashboard/team-activity?orgId=xxx&limit=20
router.get('/team-activity', (0, asyncHandler_1.asyncHandler)(dashboard_controller_1.getTeamActivity));
// GET /api/dashboard/workload?orgId=xxx
router.get('/workload', (0, asyncHandler_1.asyncHandler)(dashboard_controller_1.getWorkload));
exports.default = router;
