"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const organization_validator_1 = require("../validators/organization.validator");
const organization_controller_1 = require("../controllers/organization.controller");
const router = (0, express_1.Router)();
// All org routes require authentication
router.use(auth_middleware_1.authenticate);
// GET /api/organizations — list user's orgs
router.get('/', (0, asyncHandler_1.asyncHandler)(organization_controller_1.getUserOrganizations));
// POST /api/organizations — create org
router.post('/', organization_validator_1.createOrgValidator, validate_middleware_1.validate, (0, asyncHandler_1.asyncHandler)(organization_controller_1.createOrg));
// POST /api/organizations/accept-invitation
router.post('/accept-invitation', (0, asyncHandler_1.asyncHandler)(organization_controller_1.acceptInvitation));
// GET /api/organizations/:id
router.get('/:id', (0, asyncHandler_1.asyncHandler)(organization_controller_1.getOrg));
// PATCH /api/organizations/:id
router.patch('/:id', organization_validator_1.updateOrgValidator, validate_middleware_1.validate, (0, asyncHandler_1.asyncHandler)(organization_controller_1.updateOrg));
// DELETE /api/organizations/:id
router.delete('/:id', (0, asyncHandler_1.asyncHandler)(organization_controller_1.deleteOrg));
// GET /api/organizations/:id/members
router.get('/:id/members', (0, asyncHandler_1.asyncHandler)(organization_controller_1.getMembers));
// POST /api/organizations/:id/invite
router.post('/:id/invite', organization_validator_1.inviteMemberValidator, validate_middleware_1.validate, (0, asyncHandler_1.asyncHandler)(organization_controller_1.inviteMember));
// DELETE /api/organizations/:id/members/:userId
router.delete('/:id/members/:userId', (0, asyncHandler_1.asyncHandler)(organization_controller_1.removeMember));
// PATCH /api/organizations/:id/members/:userId/role
router.patch('/:id/members/:userId/role', organization_validator_1.updateMemberRoleValidator, validate_middleware_1.validate, (0, asyncHandler_1.asyncHandler)(organization_controller_1.updateMemberRole));
exports.default = router;
