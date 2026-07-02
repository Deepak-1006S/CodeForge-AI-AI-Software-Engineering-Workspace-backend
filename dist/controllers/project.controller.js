"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTeamMember = exports.addTeamMember = exports.getProjectStats = exports.updateStatus = exports.deleteProject = exports.duplicateProject = exports.updateArchive = exports.updatePin = exports.updateFavorite = exports.updateProject = exports.getProjectById = exports.getProjects = exports.createProject = void 0;
const mongoose_1 = require("mongoose");
const Project_1 = require("../models/Project");
const Issue_1 = require("../models/Issue");
const Organization_1 = require("../models/Organization");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const pagination_1 = require("../utils/pagination");
const createProject = async (req, res) => {
    const { title, description, organization, status } = req.body;
    // Verify org exists and user is a member
    const org = await Organization_1.Organization.findById(organization);
    if (!org) {
        throw new ApiError_1.ApiError(404, 'Organization not found.');
    }
    const isMember = org.members.some((m) => m.user.toString() === req.user._id.toString());
    const isOwner = org.owner.toString() === req.user._id.toString();
    if (!isMember && !isOwner) {
        throw new ApiError_1.ApiError(403, 'You must be a member of the organization to create projects.');
    }
    const project = await Project_1.Project.create({
        title,
        description: description || '',
        organization,
        owner: req.user._id,
        status: status || 'Planning',
        team: [req.user._id],
    });
    await project.populate([
        { path: 'owner', select: 'name email avatar' },
        { path: 'team', select: 'name email avatar' },
    ]);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, { project }, 'Project created successfully'));
};
exports.createProject = createProject;
const getProjects = async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
    const { orgId, status, search, sortBy, sortOrder } = req.query;
    if (!orgId) {
        throw new ApiError_1.ApiError(400, 'Organization ID is required.');
    }
    const filter = {
        organization: new mongoose_1.Types.ObjectId(orgId),
        deletedAt: null,
        archivedAt: null,
    };
    if (status)
        filter.status = status;
    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
        ];
    }
    const allowedSortFields = ['createdAt', 'title', 'favorite', 'pinned'];
    const sortField = typeof sortBy === 'string' && allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const sort = {
        [sortField]: sortDirection,
    };
    if (sortField !== 'createdAt') {
        sort.createdAt = -1;
    }
    const [projects, total] = await Promise.all([
        Project_1.Project.find(filter)
            .populate('owner', 'name email avatar')
            .populate('team', 'name email avatar')
            .skip(skip)
            .limit(limit)
            .sort(sort)
            .lean(),
        Project_1.Project.countDocuments(filter),
    ]);
    const meta = (0, pagination_1.buildPaginationMeta)(total, page, limit);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { projects }, 'Projects retrieved', meta));
};
exports.getProjects = getProjects;
const getProjectById = async (req, res) => {
    const project = await Project_1.Project.findById(req.params.id)
        .populate('owner', 'name email avatar')
        .populate('team', 'name email avatar')
        .populate('organization', 'name');
    if (!project) {
        throw new ApiError_1.ApiError(404, 'Project not found.');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { project }, 'Project retrieved'));
};
exports.getProjectById = getProjectById;
const updateProject = async (req, res) => {
    const project = await Project_1.Project.findById(req.params.id);
    if (!project) {
        throw new ApiError_1.ApiError(404, 'Project not found.');
    }
    const isOwner = project.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role === 'Developer') {
        throw new ApiError_1.ApiError(403, 'Only project owners and managers can update projects.');
    }
    const allowedFields = ['title', 'description', 'status'];
    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            project.set(field, req.body[field]);
        }
    });
    await project.save();
    await project.populate([
        { path: 'owner', select: 'name email avatar' },
        { path: 'team', select: 'name email avatar' },
    ]);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { project }, 'Project updated successfully'));
};
exports.updateProject = updateProject;
const updateFavorite = async (req, res) => {
    const { favorite } = req.body;
    if (typeof favorite !== 'boolean') {
        throw new ApiError_1.ApiError(400, 'Favorite flag is required and must be a boolean.');
    }
    const project = await Project_1.Project.findById(req.params.id);
    if (!project) {
        throw new ApiError_1.ApiError(404, 'Project not found.');
    }
    const isOwner = project.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role === 'Developer') {
        throw new ApiError_1.ApiError(403, 'Only project owners and managers can update favorites.');
    }
    project.favorite = favorite;
    await project.save();
    await project.populate([
        { path: 'owner', select: 'name email avatar' },
        { path: 'team', select: 'name email avatar' },
    ]);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { project }, 'Project favorite status updated'));
};
exports.updateFavorite = updateFavorite;
const updatePin = async (req, res) => {
    const { pinned } = req.body;
    if (typeof pinned !== 'boolean') {
        throw new ApiError_1.ApiError(400, 'Pinned flag is required and must be a boolean.');
    }
    const project = await Project_1.Project.findById(req.params.id);
    if (!project) {
        throw new ApiError_1.ApiError(404, 'Project not found.');
    }
    const isOwner = project.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role === 'Developer') {
        throw new ApiError_1.ApiError(403, 'Only project owners and managers can update pin status.');
    }
    project.pinned = pinned;
    await project.save();
    await project.populate([
        { path: 'owner', select: 'name email avatar' },
        { path: 'team', select: 'name email avatar' },
    ]);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { project }, 'Project pin status updated'));
};
exports.updatePin = updatePin;
const updateArchive = async (req, res) => {
    const { archived } = req.body;
    if (typeof archived !== 'boolean') {
        throw new ApiError_1.ApiError(400, 'Archive flag is required and must be a boolean.');
    }
    const project = await Project_1.Project.findById(req.params.id);
    if (!project) {
        throw new ApiError_1.ApiError(404, 'Project not found.');
    }
    if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
        throw new ApiError_1.ApiError(403, 'Only project owners or admins can archive projects.');
    }
    project.archivedAt = archived ? new Date() : null;
    await project.save();
    await project.populate([
        { path: 'owner', select: 'name email avatar' },
        { path: 'team', select: 'name email avatar' },
    ]);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { project }, archived ? 'Project archived' : 'Project restored'));
};
exports.updateArchive = updateArchive;
const duplicateProject = async (req, res) => {
    const project = await Project_1.Project.findById(req.params.id);
    if (!project) {
        throw new ApiError_1.ApiError(404, 'Project not found.');
    }
    const duplicated = await Project_1.Project.create({
        title: `${project.title} Copy`,
        description: project.description,
        organization: project.organization,
        owner: req.user._id,
        status: project.status,
        team: [req.user._id],
        githubOwner: project.githubOwner,
        githubRepo: project.githubRepo,
    });
    await duplicated.populate([
        { path: 'owner', select: 'name email avatar' },
        { path: 'team', select: 'name email avatar' },
    ]);
    res.status(201).json(new ApiResponse_1.ApiResponse(201, { project: duplicated }, 'Project duplicated successfully'));
};
exports.duplicateProject = duplicateProject;
const deleteProject = async (req, res) => {
    const project = await Project_1.Project.findById(req.params.id);
    if (!project) {
        throw new ApiError_1.ApiError(404, 'Project not found.');
    }
    if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
        throw new ApiError_1.ApiError(403, 'Only project owners or admins can delete projects.');
    }
    // Soft delete
    project.deletedAt = new Date();
    await project.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, 'Project deleted successfully'));
};
exports.deleteProject = deleteProject;
const updateStatus = async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Planning', 'Active', 'Testing', 'Completed'];
    if (!validStatuses.includes(status)) {
        throw new ApiError_1.ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    const project = await Project_1.Project.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true }).populate('owner', 'name email avatar');
    if (!project) {
        throw new ApiError_1.ApiError(404, 'Project not found.');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { project }, 'Project status updated'));
};
exports.updateStatus = updateStatus;
const getProjectStats = async (req, res) => {
    const project = await Project_1.Project.findById(req.params.id);
    if (!project) {
        throw new ApiError_1.ApiError(404, 'Project not found.');
    }
    const [total, todo, inProgress, review, done, critical] = await Promise.all([
        Issue_1.Issue.countDocuments({ project: project._id }),
        Issue_1.Issue.countDocuments({ project: project._id, status: 'Todo' }),
        Issue_1.Issue.countDocuments({ project: project._id, status: 'In Progress' }),
        Issue_1.Issue.countDocuments({ project: project._id, status: 'Review' }),
        Issue_1.Issue.countDocuments({ project: project._id, status: 'Done' }),
        Issue_1.Issue.countDocuments({ project: project._id, priority: 'Critical', status: { $ne: 'Done' } }),
    ]);
    const completionPercentage = total > 0 ? Math.round((done / total) * 100) : 0;
    const stats = {
        total,
        todo,
        inProgress,
        review,
        done,
        critical,
        completionPercentage,
    };
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { stats }, 'Project statistics retrieved'));
};
exports.getProjectStats = getProjectStats;
const addTeamMember = async (req, res) => {
    const { userId } = req.body;
    const project = await Project_1.Project.findById(req.params.id);
    if (!project) {
        throw new ApiError_1.ApiError(404, 'Project not found.');
    }
    const isOwner = project.owner.toString() === req.user._id.toString();
    if (!isOwner && !['Admin', 'Manager'].includes(req.user.role)) {
        throw new ApiError_1.ApiError(403, 'Only project owners or managers can add team members.');
    }
    const isAlreadyMember = project.team.some((id) => id.toString() === userId);
    if (isAlreadyMember) {
        throw new ApiError_1.ApiError(409, 'User is already a team member.');
    }
    project.team.push(new mongoose_1.Types.ObjectId(userId));
    await project.save();
    await project.populate('team', 'name email avatar');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { project }, 'Team member added successfully'));
};
exports.addTeamMember = addTeamMember;
const removeTeamMember = async (req, res) => {
    const { userId } = req.params;
    const project = await Project_1.Project.findById(req.params.id);
    if (!project) {
        throw new ApiError_1.ApiError(404, 'Project not found.');
    }
    if (project.owner.toString() === userId) {
        throw new ApiError_1.ApiError(400, 'Cannot remove the project owner from the team.');
    }
    const memberIndex = project.team.findIndex((id) => id.toString() === userId);
    if (memberIndex === -1) {
        throw new ApiError_1.ApiError(404, 'User is not a team member.');
    }
    project.team.splice(memberIndex, 1);
    await project.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, 'Team member removed successfully'));
};
exports.removeTeamMember = removeTeamMember;
