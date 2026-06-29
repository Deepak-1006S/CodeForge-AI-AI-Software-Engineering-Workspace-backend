"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const project_validator_1 = require("../validators/project.validator");
const project_controller_1 = require("../controllers/project.controller");
const router = (0, express_1.Router)();
// All project routes require authentication
router.use(auth_middleware_1.authenticate);
// GET /api/projects
router.get('/', (0, asyncHandler_1.asyncHandler)(project_controller_1.getProjects));
// POST /api/projects
router.post('/', project_validator_1.createProjectValidator, validate_middleware_1.validate, (0, asyncHandler_1.asyncHandler)(project_controller_1.createProject));
// GET /api/projects/:id
router.get('/:id', (0, asyncHandler_1.asyncHandler)(project_controller_1.getProjectById));
// PATCH /api/projects/:id
router.patch('/:id', project_validator_1.updateProjectValidator, validate_middleware_1.validate, (0, asyncHandler_1.asyncHandler)(project_controller_1.updateProject));
// DELETE /api/projects/:id
router.delete('/:id', (0, asyncHandler_1.asyncHandler)(project_controller_1.deleteProject));
// PATCH /api/projects/:id/status
router.patch('/:id/status', (0, asyncHandler_1.asyncHandler)(project_controller_1.updateStatus));
// GET /api/projects/:id/stats
router.get('/:id/stats', (0, asyncHandler_1.asyncHandler)(project_controller_1.getProjectStats));
// POST /api/projects/:id/team
router.post('/:id/team', project_validator_1.addTeamMemberValidator, validate_middleware_1.validate, (0, asyncHandler_1.asyncHandler)(project_controller_1.addTeamMember));
// DELETE /api/projects/:id/team/:userId
router.delete('/:id/team/:userId', (0, asyncHandler_1.asyncHandler)(project_controller_1.removeTeamMember));
exports.default = router;
