import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  createOrgValidator,
  updateOrgValidator,
  inviteMemberValidator,
  updateMemberRoleValidator,
} from '../validators/organization.validator';
import {
  createOrg,
  getOrg,
  updateOrg,
  deleteOrg,
  inviteMember,
  removeMember,
  updateMemberRole,
  getMembers,
  acceptInvitation,
  getUserOrganizations,
} from '../controllers/organization.controller';

const router = Router();

// All org routes require authentication
router.use(authenticate);

// GET /api/organizations — list user's orgs
router.get('/', asyncHandler(getUserOrganizations));

// POST /api/organizations — create org
router.post('/', createOrgValidator, validate, asyncHandler(createOrg));

// POST /api/organizations/accept-invitation
router.post('/accept-invitation', asyncHandler(acceptInvitation));

// GET /api/organizations/:id
router.get('/:id', asyncHandler(getOrg));

// PATCH /api/organizations/:id
router.patch('/:id', updateOrgValidator, validate, asyncHandler(updateOrg));

// DELETE /api/organizations/:id
router.delete('/:id', asyncHandler(deleteOrg));

// GET /api/organizations/:id/members
router.get('/:id/members', asyncHandler(getMembers));

// POST /api/organizations/:id/invite
router.post('/:id/invite', inviteMemberValidator, validate, asyncHandler(inviteMember));

// DELETE /api/organizations/:id/members/:userId
router.delete('/:id/members/:userId', asyncHandler(removeMember));

// PATCH /api/organizations/:id/members/:userId/role
router.patch(
  '/:id/members/:userId/role',
  updateMemberRoleValidator,
  validate,
  asyncHandler(updateMemberRole),
);

export default router;
