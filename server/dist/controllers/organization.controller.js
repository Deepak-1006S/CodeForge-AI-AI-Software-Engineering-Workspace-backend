"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOrganizations = exports.acceptInvitation = exports.getMembers = exports.updateMemberRole = exports.removeMember = exports.inviteMember = exports.deleteOrg = exports.updateOrg = exports.getOrg = exports.createOrg = void 0;
const Organization_1 = require("../models/Organization");
const Invitation_1 = require("../models/Invitation");
const User_1 = require("../models/User");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const generateToken_1 = require("../utils/generateToken");
const email_service_1 = require("../services/email.service");
const pagination_1 = require("../utils/pagination");
const logger_1 = require("../config/logger");
const INVITATION_EXPIRY_DAYS = 7;
const createOrg = async (req, res) => {
    const { name } = req.body;
    const ownerId = req.user._id;
    const org = await Organization_1.Organization.create({
        name,
        owner: ownerId,
        members: [{ user: ownerId, role: req.user.role === 'Admin' ? 'Admin' : 'Admin' }],
    });
    await org.populate('owner', 'name email avatar');
    res.status(201).json(new ApiResponse_1.ApiResponse(201, { organization: org }, 'Organization created successfully'));
};
exports.createOrg = createOrg;
const getOrg = async (req, res) => {
    const org = await Organization_1.Organization.findById(req.params.id)
        .populate('owner', 'name email avatar')
        .populate('members.user', 'name email avatar role');
    if (!org) {
        throw new ApiError_1.ApiError(404, 'Organization not found.');
    }
    // Check user is a member
    const isMember = org.members.some((m) => m.user._id.toString() === req.user._id.toString());
    if (!isMember && org.owner._id.toString() !== req.user._id.toString()) {
        throw new ApiError_1.ApiError(403, 'You are not a member of this organization.');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { organization: org }, 'Organization retrieved'));
};
exports.getOrg = getOrg;
const updateOrg = async (req, res) => {
    const org = await Organization_1.Organization.findById(req.params.id);
    if (!org) {
        throw new ApiError_1.ApiError(404, 'Organization not found.');
    }
    if (org.owner.toString() !== req.user._id.toString()) {
        throw new ApiError_1.ApiError(403, 'Only the organization owner can update organization details.');
    }
    const { name } = req.body;
    if (name)
        org.name = name;
    await org.save();
    await org.populate('owner', 'name email avatar');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { organization: org }, 'Organization updated successfully'));
};
exports.updateOrg = updateOrg;
const deleteOrg = async (req, res) => {
    const org = await Organization_1.Organization.findById(req.params.id);
    if (!org) {
        throw new ApiError_1.ApiError(404, 'Organization not found.');
    }
    if (org.owner.toString() !== req.user._id.toString()) {
        throw new ApiError_1.ApiError(403, 'Only the organization owner can delete this organization.');
    }
    await Organization_1.Organization.deleteOne({ _id: org._id });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, 'Organization deleted successfully'));
};
exports.deleteOrg = deleteOrg;
const inviteMember = async (req, res) => {
    const { email, role = 'Developer' } = req.body;
    const orgId = req.params.id;
    const org = await Organization_1.Organization.findById(orgId);
    if (!org) {
        throw new ApiError_1.ApiError(404, 'Organization not found.');
    }
    // Check requester has permission (owner or Admin member)
    const requesterMember = org.members.find((m) => m.user.toString() === req.user._id.toString());
    const isOwner = org.owner.toString() === req.user._id.toString();
    if (!isOwner && (!requesterMember || requesterMember.role !== 'Admin')) {
        throw new ApiError_1.ApiError(403, 'Only organization admins can invite members.');
    }
    // Check if user is already a member
    const existingUser = await User_1.User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        const isAlreadyMember = org.members.some((m) => m.user.toString() === existingUser._id.toString());
        if (isAlreadyMember) {
            throw new ApiError_1.ApiError(409, 'This user is already a member of the organization.');
        }
    }
    // Invalidate any existing pending invitations for this email+org
    await Invitation_1.Invitation.updateMany({ organization: orgId, email: email.toLowerCase(), status: 'pending' }, { status: 'expired' });
    const token = (0, generateToken_1.generateToken)(32);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);
    const invitation = await Invitation_1.Invitation.create({
        organization: orgId,
        email: email.toLowerCase(),
        role,
        token,
        expiresAt,
    });
    // Send invitation email (non-blocking)
    (0, email_service_1.sendInvitation)(email, org.name, token, req.user.name).catch((err) => logger_1.logger.error('Failed to send invitation email:', err));
    res.status(201).json(new ApiResponse_1.ApiResponse(201, { invitation: { id: invitation._id, email, role, expiresAt } }, 'Invitation sent successfully'));
};
exports.inviteMember = inviteMember;
const removeMember = async (req, res) => {
    const { id: orgId, userId } = req.params;
    const org = await Organization_1.Organization.findById(orgId);
    if (!org) {
        throw new ApiError_1.ApiError(404, 'Organization not found.');
    }
    const isOwner = org.owner.toString() === req.user._id.toString();
    if (!isOwner) {
        throw new ApiError_1.ApiError(403, 'Only the organization owner can remove members.');
    }
    if (userId === org.owner.toString()) {
        throw new ApiError_1.ApiError(400, 'Cannot remove the organization owner.');
    }
    const memberIndex = org.members.findIndex((m) => m.user.toString() === userId);
    if (memberIndex === -1) {
        throw new ApiError_1.ApiError(404, 'User is not a member of this organization.');
    }
    org.members.splice(memberIndex, 1);
    await org.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, 'Member removed successfully'));
};
exports.removeMember = removeMember;
const updateMemberRole = async (req, res) => {
    const { id: orgId, userId } = req.params;
    const { role } = req.body;
    const org = await Organization_1.Organization.findById(orgId);
    if (!org) {
        throw new ApiError_1.ApiError(404, 'Organization not found.');
    }
    const isOwner = org.owner.toString() === req.user._id.toString();
    if (!isOwner) {
        throw new ApiError_1.ApiError(403, 'Only the organization owner can update member roles.');
    }
    const member = org.members.find((m) => m.user.toString() === userId);
    if (!member) {
        throw new ApiError_1.ApiError(404, 'User is not a member of this organization.');
    }
    member.role = role;
    await org.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { member }, 'Member role updated successfully'));
};
exports.updateMemberRole = updateMemberRole;
const getMembers = async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
    const org = await Organization_1.Organization.findById(req.params.id)
        .populate('members.user', 'name email avatar role createdAt')
        .populate('owner', 'name email avatar role')
        .lean();
    if (!org) {
        throw new ApiError_1.ApiError(404, 'Organization not found.');
    }
    const isMember = org.members.some((m) => {
        const userId = m.user._id;
        return userId.toString() === req.user._id.toString();
    });
    const isOwner = org.owner.toString() === req.user._id.toString();
    if (!isMember && !isOwner) {
        throw new ApiError_1.ApiError(403, 'You are not a member of this organization.');
    }
    const paginatedMembers = org.members.slice(skip, skip + limit);
    const meta = (0, pagination_1.buildPaginationMeta)(org.members.length, page, limit);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { members: paginatedMembers, owner: org.owner }, 'Members retrieved', meta));
};
exports.getMembers = getMembers;
const acceptInvitation = async (req, res) => {
    const { token } = req.body;
    const invitation = await Invitation_1.Invitation.findOne({
        token,
        status: 'pending',
        expiresAt: { $gt: new Date() },
    }).populate('organization');
    if (!invitation) {
        throw new ApiError_1.ApiError(400, 'Invitation is invalid, expired, or has already been used.');
    }
    const org = await Organization_1.Organization.findById(invitation.organization);
    if (!org) {
        throw new ApiError_1.ApiError(404, 'Organization no longer exists.');
    }
    // Find or validate the accepting user
    const user = await User_1.User.findOne({ email: invitation.email });
    if (!user) {
        // If no account, they need to register first
        throw new ApiError_1.ApiError(400, 'No account found for this invitation email. Please register first.');
    }
    // Check not already a member
    const isAlreadyMember = org.members.some((m) => m.user.toString() === user._id.toString());
    if (!isAlreadyMember) {
        org.members.push({ user: user._id, role: invitation.role });
        await org.save();
    }
    invitation.status = 'accepted';
    await invitation.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { organization: { id: org._id, name: org.name } }, 'Invitation accepted successfully'));
};
exports.acceptInvitation = acceptInvitation;
const getUserOrganizations = async (req, res) => {
    const userId = req.user._id;
    const orgs = await Organization_1.Organization.find({
        $or: [{ owner: userId }, { 'members.user': userId }],
    })
        .populate('owner', 'name email avatar')
        .sort({ createdAt: -1 })
        .lean();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { organizations: orgs }, 'Organizations retrieved'));
};
exports.getUserOrganizations = getUserOrganizations;
