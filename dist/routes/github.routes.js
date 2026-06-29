"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_middleware_1 = require("../middleware/auth.middleware");
const github_controller_1 = require("../controllers/github.controller");
const router = (0, express_1.Router)();
// All GitHub routes require authentication
router.use(auth_middleware_1.authenticate);
// POST /api/github/connect — connect repo to a project
router.post('/connect', (0, asyncHandler_1.asyncHandler)(github_controller_1.connectRepository));
// GET /api/github/projects/:projectId/repo
router.get('/projects/:projectId/repo', (0, asyncHandler_1.asyncHandler)(github_controller_1.getRepoDetails));
// GET /api/github/projects/:projectId/commits
router.get('/projects/:projectId/commits', (0, asyncHandler_1.asyncHandler)(github_controller_1.getCommits));
// GET /api/github/projects/:projectId/pull-requests
router.get('/projects/:projectId/pull-requests', (0, asyncHandler_1.asyncHandler)(github_controller_1.getPullRequestStats));
// GET /api/github/projects/:projectId/contributors
router.get('/projects/:projectId/contributors', (0, asyncHandler_1.asyncHandler)(github_controller_1.getContributors));
exports.default = router;
