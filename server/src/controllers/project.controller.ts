import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Project } from '../models/Project';
import { Issue } from '../models/Issue';
import { Organization } from '../models/Organization';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { parsePagination, buildPaginationMeta } from '../utils/pagination';

export const createProject = async (req: Request, res: Response): Promise<void> => {
  const { title, description, organization, status } = req.body;

  // Verify org exists and user is a member
  const org = await Organization.findById(organization);
  if (!org) {
    throw new ApiError(404, 'Organization not found.');
  }

  const isMember = org.members.some(
    (m) => m.user.toString() === req.user._id.toString(),
  );
  const isOwner = org.owner.toString() === req.user._id.toString();

  if (!isMember && !isOwner) {
    throw new ApiError(403, 'You must be a member of the organization to create projects.');
  }

  const project = await Project.create({
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

  res.status(201).json(new ApiResponse(201, { project }, 'Project created successfully'));
};

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, skip } = parsePagination(req);
  const { orgId, status, search } = req.query;

  if (!orgId) {
    throw new ApiError(400, 'Organization ID is required.');
  }

  const filter: Record<string, unknown> = {
    organization: new Types.ObjectId(orgId as string),
    deletedAt: null,
  };

  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .populate('owner', 'name email avatar')
      .populate('team', 'name email avatar')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean(),
    Project.countDocuments(filter),
  ]);

  const meta = buildPaginationMeta(total, page, limit);

  res.status(200).json(new ApiResponse(200, { projects }, 'Projects retrieved', meta));
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  const project = await Project.findById(req.params.id)
    .populate('owner', 'name email avatar')
    .populate('team', 'name email avatar')
    .populate('organization', 'name');

  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  res.status(200).json(new ApiResponse(200, { project }, 'Project retrieved'));
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  const isOwner = project.owner.toString() === req.user._id.toString();
  if (!isOwner && req.user.role === 'Developer') {
    throw new ApiError(403, 'Only project owners and managers can update projects.');
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

  res.status(200).json(new ApiResponse(200, { project }, 'Project updated successfully'));
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
    throw new ApiError(403, 'Only project owners or admins can delete projects.');
  }

  // Soft delete
  project.deletedAt = new Date();
  await project.save();

  res.status(200).json(new ApiResponse(200, {}, 'Project deleted successfully'));
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  const { status } = req.body;
  const validStatuses = ['Planning', 'Active', 'Testing', 'Completed'];

  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const project = await Project.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true },
  ).populate('owner', 'name email avatar');

  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  res.status(200).json(new ApiResponse(200, { project }, 'Project status updated'));
};

export const getProjectStats = async (req: Request, res: Response): Promise<void> => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  const [total, todo, inProgress, review, done, critical] = await Promise.all([
    Issue.countDocuments({ project: project._id }),
    Issue.countDocuments({ project: project._id, status: 'Todo' }),
    Issue.countDocuments({ project: project._id, status: 'In Progress' }),
    Issue.countDocuments({ project: project._id, status: 'Review' }),
    Issue.countDocuments({ project: project._id, status: 'Done' }),
    Issue.countDocuments({ project: project._id, priority: 'Critical', status: { $ne: 'Done' } }),
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

  res.status(200).json(new ApiResponse(200, { stats }, 'Project statistics retrieved'));
};

export const addTeamMember = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  const isOwner = project.owner.toString() === req.user._id.toString();
  if (!isOwner && !['Admin', 'Manager'].includes(req.user.role)) {
    throw new ApiError(403, 'Only project owners or managers can add team members.');
  }

  const isAlreadyMember = project.team.some((id) => id.toString() === userId);
  if (isAlreadyMember) {
    throw new ApiError(409, 'User is already a team member.');
  }

  project.team.push(new Types.ObjectId(userId));
  await project.save();
  await project.populate('team', 'name email avatar');

  res.status(200).json(new ApiResponse(200, { project }, 'Team member added successfully'));
};

export const removeTeamMember = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const project = await Project.findById(req.params.id);

  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  if (project.owner.toString() === userId) {
    throw new ApiError(400, 'Cannot remove the project owner from the team.');
  }

  const memberIndex = project.team.findIndex((id) => id.toString() === userId);
  if (memberIndex === -1) {
    throw new ApiError(404, 'User is not a team member.');
  }

  project.team.splice(memberIndex, 1);
  await project.save();

  res.status(200).json(new ApiResponse(200, {}, 'Team member removed successfully'));
};
