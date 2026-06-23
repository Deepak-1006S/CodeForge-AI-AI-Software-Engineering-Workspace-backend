import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Organization } from '../models/Organization';
import { Invitation } from '../models/Invitation';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { generateToken } from '../utils/generateToken';
import { sendInvitation } from '../services/email.service';
import { parsePagination, buildPaginationMeta } from '../utils/pagination';
import { logger } from '../config/logger';

const INVITATION_EXPIRY_DAYS = 7;

export const createOrg = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.body;
  const ownerId = req.user._id;

  const org = await Organization.create({
    name,
    owner: ownerId,
    members: [{ user: ownerId, role: req.user.role === 'Admin' ? 'Admin' : 'Admin' }],
  });

  await org.populate('owner', 'name email avatar');

  res.status(201).json(new ApiResponse(201, { organization: org }, 'Organization created successfully'));
};

export const getOrg = async (req: Request, res: Response): Promise<void> => {
  const org = await Organization.findById(req.params.id)
    .populate('owner', 'name email avatar')
    .populate('members.user', 'name email avatar role');

  if (!org) {
    throw new ApiError(404, 'Organization not found.');
  }

  // Check user is a member
  const isMember = org.members.some((m) => m.user._id.toString() === req.user._id.toString());
  if (!isMember && org.owner._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You are not a member of this organization.');
  }

  res.status(200).json(new ApiResponse(200, { organization: org }, 'Organization retrieved'));
};

export const updateOrg = async (req: Request, res: Response): Promise<void> => {
  const org = await Organization.findById(req.params.id);
  if (!org) {
    throw new ApiError(404, 'Organization not found.');
  }

  if (org.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Only the organization owner can update organization details.');
  }

  const { name } = req.body;
  if (name) org.name = name;

  await org.save();
  await org.populate('owner', 'name email avatar');

  res.status(200).json(new ApiResponse(200, { organization: org }, 'Organization updated successfully'));
};

export const deleteOrg = async (req: Request, res: Response): Promise<void> => {
  const org = await Organization.findById(req.params.id);
  if (!org) {
    throw new ApiError(404, 'Organization not found.');
  }

  if (org.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Only the organization owner can delete this organization.');
  }

  await Organization.deleteOne({ _id: org._id });

  res.status(200).json(new ApiResponse(200, {}, 'Organization deleted successfully'));
};

export const inviteMember = async (req: Request, res: Response): Promise<void> => {
  const { email, role = 'Developer' } = req.body;
  const orgId = req.params.id;

  const org = await Organization.findById(orgId);
  if (!org) {
    throw new ApiError(404, 'Organization not found.');
  }

  // Check requester has permission (owner or Admin member)
  const requesterMember = org.members.find(
    (m) => m.user.toString() === req.user._id.toString(),
  );
  const isOwner = org.owner.toString() === req.user._id.toString();
  if (!isOwner && (!requesterMember || requesterMember.role !== 'Admin')) {
    throw new ApiError(403, 'Only organization admins can invite members.');
  }

  // Check if user is already a member
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const isAlreadyMember = org.members.some(
      (m) => m.user.toString() === existingUser._id.toString(),
    );
    if (isAlreadyMember) {
      throw new ApiError(409, 'This user is already a member of the organization.');
    }
  }

  // Invalidate any existing pending invitations for this email+org
  await Invitation.updateMany(
    { organization: orgId, email: email.toLowerCase(), status: 'pending' },
    { status: 'expired' },
  );

  const token = generateToken(32);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);

  const invitation = await Invitation.create({
    organization: orgId,
    email: email.toLowerCase(),
    role,
    token,
    expiresAt,
  });

  // Send invitation email (non-blocking)
  sendInvitation(email, org.name, token, req.user.name).catch((err) =>
    logger.error('Failed to send invitation email:', err),
  );

  res.status(201).json(
    new ApiResponse(
      201,
      { invitation: { id: invitation._id, email, role, expiresAt } },
      'Invitation sent successfully',
    ),
  );
};

export const removeMember = async (req: Request, res: Response): Promise<void> => {
  const { id: orgId, userId } = req.params;

  const org = await Organization.findById(orgId);
  if (!org) {
    throw new ApiError(404, 'Organization not found.');
  }

  const isOwner = org.owner.toString() === req.user._id.toString();
  if (!isOwner) {
    throw new ApiError(403, 'Only the organization owner can remove members.');
  }

  if (userId === org.owner.toString()) {
    throw new ApiError(400, 'Cannot remove the organization owner.');
  }

  const memberIndex = org.members.findIndex((m) => m.user.toString() === userId);
  if (memberIndex === -1) {
    throw new ApiError(404, 'User is not a member of this organization.');
  }

  org.members.splice(memberIndex, 1);
  await org.save();

  res.status(200).json(new ApiResponse(200, {}, 'Member removed successfully'));
};

export const updateMemberRole = async (req: Request, res: Response): Promise<void> => {
  const { id: orgId, userId } = req.params;
  const { role } = req.body;

  const org = await Organization.findById(orgId);
  if (!org) {
    throw new ApiError(404, 'Organization not found.');
  }

  const isOwner = org.owner.toString() === req.user._id.toString();
  if (!isOwner) {
    throw new ApiError(403, 'Only the organization owner can update member roles.');
  }

  const member = org.members.find((m) => m.user.toString() === userId);
  if (!member) {
    throw new ApiError(404, 'User is not a member of this organization.');
  }

  member.role = role;
  await org.save();

  res.status(200).json(new ApiResponse(200, { member }, 'Member role updated successfully'));
};

export const getMembers = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, skip } = parsePagination(req);
  const org = await Organization.findById(req.params.id)
    .populate('members.user', 'name email avatar role createdAt')
    .populate('owner', 'name email avatar role')
    .lean();

  if (!org) {
    throw new ApiError(404, 'Organization not found.');
  }

  const isMember = org.members.some((m) => {
    const userId = (m.user as { _id: Types.ObjectId })._id;
    return userId.toString() === req.user._id.toString();
  });
  const isOwner = org.owner.toString() === req.user._id.toString();

  if (!isMember && !isOwner) {
    throw new ApiError(403, 'You are not a member of this organization.');
  }

  const paginatedMembers = org.members.slice(skip, skip + limit);
  const meta = buildPaginationMeta(org.members.length, page, limit);

  res.status(200).json(
    new ApiResponse(200, { members: paginatedMembers, owner: org.owner }, 'Members retrieved', meta),
  );
};

export const acceptInvitation = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  const invitation = await Invitation.findOne({
    token,
    status: 'pending',
    expiresAt: { $gt: new Date() },
  }).populate('organization');

  if (!invitation) {
    throw new ApiError(400, 'Invitation is invalid, expired, or has already been used.');
  }

  const org = await Organization.findById(invitation.organization);
  if (!org) {
    throw new ApiError(404, 'Organization no longer exists.');
  }

  // Find or validate the accepting user
  const user = await User.findOne({ email: invitation.email });
  if (!user) {
    // If no account, they need to register first
    throw new ApiError(
      400,
      'No account found for this invitation email. Please register first.',
    );
  }

  // Check not already a member
  const isAlreadyMember = org.members.some(
    (m) => m.user.toString() === user._id.toString(),
  );
  if (!isAlreadyMember) {
    org.members.push({ user: user._id, role: invitation.role });
    await org.save();
  }

  invitation.status = 'accepted';
  await invitation.save();

  res.status(200).json(
    new ApiResponse(200, { organization: { id: org._id, name: org.name } }, 'Invitation accepted successfully'),
  );
};

export const getUserOrganizations = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user._id;

  const orgs = await Organization.find({
    $or: [{ owner: userId }, { 'members.user': userId }],
  })
    .populate('owner', 'name email avatar')
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json(new ApiResponse(200, { organizations: orgs }, 'Organizations retrieved'));
};
