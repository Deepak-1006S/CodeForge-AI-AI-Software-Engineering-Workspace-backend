import { Request, Response } from 'express';
import { Types } from 'mongoose';
import type { ActivityPayload } from '../types/socket';
import { Issue } from '../models/Issue';
import { IssueActivity } from '../models/IssueActivity';
import { Project } from '../models/Project';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { parsePagination, buildPaginationMeta } from '../utils/pagination';
import { createNotification } from '../services/notification.service';
import { getIO } from '../socket';

const logActivity = async (
  issueId: Types.ObjectId,
  actorId: Types.ObjectId,
  action: string,
  oldValue?: string,
  newValue?: string,
) => {
  try {
    const activity = await IssueActivity.create({
      issue: issueId,
      actor: actorId,
      action,
      oldValue: oldValue || null,
      newValue: newValue || null,
    });

    // Emit activity event via socket
    try {
      const io = getIO();
      if (io) {
        const populated = await IssueActivity.findById(activity._id)
          .populate('actor', 'name avatar email')
          .populate({ path: 'issue', select: 'project' })
          .lean();

        if (populated && populated.issue && populated.actor) {
          const issueDoc = populated.issue as any;
          const projectId = issueDoc.project
            ? issueDoc.project.toString()
            : issueDoc._id?.toString();

          const payload: ActivityPayload = {
            issueId: issueDoc._id.toString(),
            projectId,
            actor: (populated.actor as any)._id.toString(),
            action: populated.action,
            createdAt: populated.createdAt,
          };
          io.emit('activity:new', payload);
        }
      }
    } catch {
      // Socket emit failure should not break the request
    }

    return activity;
  } catch (err) {
    // Activity logging failure should not break the main operation
    return null;
  }
};

export const createIssue = async (req: Request, res: Response): Promise<void> => {
  const { title, description, project, assignedTo, priority, status, labels, dueDate } = req.body;

  // Verify project exists
  const proj = await Project.findById(project);
  if (!proj) {
    throw new ApiError(404, 'Project not found.');
  }

  const issue = await Issue.create({
    title,
    description: description || '',
    project,
    assignedTo: assignedTo || null,
    priority: priority || 'Medium',
    status: status || 'Todo',
    labels: labels || [],
    dueDate: dueDate || null,
  });

  await issue.populate([
    { path: 'assignedTo', select: 'name email avatar' },
    { path: 'project', select: 'title organization' },
  ]);

  // Log creation activity
  await logActivity(issue._id, req.user._id, 'created issue', undefined, issue.title);

  // Notify assignee
  if (assignedTo && assignedTo !== req.user._id.toString()) {
    await createNotification({
      recipient: assignedTo,
      sender: req.user._id,
      type: 'issue_assigned',
      message: `${req.user.name} assigned you to issue: ${issue.title}`,
      link: `/issues/${issue._id}`,
    });
  }

  // Emit socket event
  try {
    const io = getIO();
    if (io) {
      io.to(`project:${project}`).emit('issue:created', {
        issue: issue.toJSON(),
        projectId: project,
        createdBy: req.user._id.toString(),
      });
    }
  } catch {
    // Non-critical
  }

  res.status(201).json(new ApiResponse(201, { issue }, 'Issue created successfully'));
};

export const getIssues = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, skip } = parsePagination(req);
  const { projectId, priority, status, assignedTo, search, labels } = req.query;

  if (!projectId) {
    throw new ApiError(400, 'Project ID is required.');
  }

  const filter: Record<string, unknown> = {
    project: new Types.ObjectId(projectId as string),
    deletedAt: null,
  };

  if (priority) filter.priority = priority;
  if (status) filter.status = status;
  if (assignedTo) filter.assignedTo = new Types.ObjectId(assignedTo as string);
  if (labels) filter.labels = { $in: (labels as string).split(',') };

  if (search) {
    // Use regex search for reliable case-insensitive matching
    // (text index may not be built yet on new Atlas clusters)
    const searchRegex = { $regex: search as string, $options: 'i' };
    filter.$or = [{ title: searchRegex }, { description: searchRegex }];
  }

  const sortBy = { createdAt: -1 };

  const [issues, total] = await Promise.all([
    Issue.find(filter)
      .populate('assignedTo', 'name email avatar')
      .sort(sortBy as any)
      .skip(skip)
      .limit(limit)
      .lean(),
    Issue.countDocuments(filter),
  ]);

  const meta = buildPaginationMeta(total, page, limit);

  res.status(200).json(new ApiResponse(200, { issues }, 'Issues retrieved', meta));
};

export const getIssueById = async (req: Request, res: Response): Promise<void> => {
  const issue = await Issue.findById(req.params.id)
    .populate('assignedTo', 'name email avatar')
    .populate('project', 'title organization status');

  if (!issue) {
    throw new ApiError(404, 'Issue not found.');
  }

  res.status(200).json(new ApiResponse(200, { issue }, 'Issue retrieved'));
};

export const updateIssue = async (req: Request, res: Response): Promise<void> => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) {
    throw new ApiError(404, 'Issue not found.');
  }

  const changedFields: string[] = [];
  const allowedFields = ['title', 'description', 'priority', 'status', 'labels', 'dueDate', 'assignedTo'];

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      const oldValue = String(issue.get(field) || '');
      const newValue = String(req.body[field] || '');
      if (oldValue !== newValue) {
        changedFields.push(field);
        await logActivity(
          issue._id,
          req.user._id,
          `updated ${field}`,
          oldValue,
          newValue,
        );
      }
      issue.set(field, req.body[field]);
    }
  }

  if (changedFields.length === 0) {
    throw new ApiError(400, 'No changes detected. Please provide fields to update.');
  }

  await issue.save();
  await issue.populate([
    { path: 'assignedTo', select: 'name email avatar' },
    { path: 'project', select: 'title organization' },
  ]);

  // Emit socket update
  try {
    const io = getIO();
    if (io) {
      io.to(`project:${issue.project}`).emit('issue:updated', {
        issueId: issue._id.toString(),
        projectId: issue.project.toString(),
        updatedFields: Object.fromEntries(
          changedFields.map((f) => [f, issue.get(f)]),
        ),
        updatedBy: req.user._id.toString(),
      });
    }
  } catch {
    // Non-critical
  }

  res.status(200).json(new ApiResponse(200, { issue }, 'Issue updated successfully'));
};

export const deleteIssue = async (req: Request, res: Response): Promise<void> => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) {
    throw new ApiError(404, 'Issue not found.');
  }

  issue.deletedAt = new Date();
  await issue.save();

  await logActivity(issue._id, req.user._id, 'deleted issue');

  // Emit deletion socket event
  try {
    const io = getIO();
    if (io) {
      io.to(`project:${issue.project}`).emit('issue:deleted', {
        issueId: issue._id.toString(),
        projectId: issue.project.toString(),
      });
    }
  } catch {
    // Non-critical
  }

  res.status(200).json(new ApiResponse(200, {}, 'Issue deleted successfully'));
};

export const assignIssue = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.body;
  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    throw new ApiError(404, 'Issue not found.');
  }

  const oldAssignee = issue.assignedTo?.toString() || 'unassigned';
  const newAssignee = userId || 'unassigned';

  issue.assignedTo = userId ? new Types.ObjectId(userId) : null;
  await issue.save();
  await issue.populate('assignedTo', 'name email avatar');

  await logActivity(issue._id, req.user._id, 'reassigned issue', oldAssignee, newAssignee);

  // Notify new assignee
  if (userId && userId !== req.user._id.toString()) {
    await createNotification({
      recipient: userId,
      sender: req.user._id,
      type: 'issue_assigned',
      message: `${req.user.name} assigned you to issue: ${issue.title}`,
      link: `/issues/${issue._id}`,
    });
  }

  res.status(200).json(new ApiResponse(200, { issue }, 'Issue assigned successfully'));
};

export const updateStatus = async (req: Request, res: Response): Promise<void> => {
  const { status } = req.body;
  const validStatuses = ['Todo', 'In Progress', 'Review', 'Done'];

  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const issue = await Issue.findById(req.params.id);
  if (!issue) {
    throw new ApiError(404, 'Issue not found.');
  }

  const oldStatus = issue.status;
  issue.status = status as 'Todo' | 'In Progress' | 'Review' | 'Done';
  await issue.save();

  await logActivity(issue._id, req.user._id, 'changed status', oldStatus, status);

  // Emit socket event for kanban board updates
  try {
    const io = getIO();
    if (io) {
      io.to(`project:${issue.project}`).emit('issue:updated', {
        issueId: issue._id.toString(),
        projectId: issue.project.toString(),
        updatedFields: { status },
        updatedBy: req.user._id.toString(),
      });
      io.to(`org:${req.query.orgId}`).emit('dashboard:refresh', {
        orgId: req.query.orgId as string,
        reason: 'issue_status_changed',
      });
    }
  } catch {
    // Non-critical
  }

  res.status(200).json(new ApiResponse(200, { issue }, 'Issue status updated'));
};

export const getActivity = async (req: Request, res: Response): Promise<void> => {
  const { page, limit, skip } = parsePagination(req);
  const issueId = req.params.id;

  // Verify issue exists
  const issue = await Issue.findById(issueId);
  if (!issue) {
    throw new ApiError(404, 'Issue not found.');
  }

  const [activities, total] = await Promise.all([
    IssueActivity.find({ issue: new Types.ObjectId(issueId) })
      .populate('actor', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    IssueActivity.countDocuments({ issue: new Types.ObjectId(issueId) }),
  ]);

  const meta = buildPaginationMeta(total, page, limit);

  res.status(200).json(new ApiResponse(200, { activities }, 'Activity log retrieved', meta));
};

export const getIssuesByProject = async (req: Request, res: Response): Promise<void> => {
  const projectId = req.params.projectId || req.query.projectId as string;

  if (!projectId) {
    throw new ApiError(400, 'Project ID is required.');
  }

  const issues = await Issue.find({
    project: new Types.ObjectId(projectId),
    deletedAt: null,
  })
    .populate('assignedTo', 'name email avatar')
    .sort({ createdAt: -1 })
    .lean();

  // Group by status for kanban view
  const kanbanBoard = {
    'Todo': issues.filter((i) => i.status === 'Todo'),
    'In Progress': issues.filter((i) => i.status === 'In Progress'),
    'Review': issues.filter((i) => i.status === 'Review'),
    'Done': issues.filter((i) => i.status === 'Done'),
  };

  res.status(200).json(
    new ApiResponse(200, { issues, kanbanBoard }, 'Issues retrieved for project'),
  );
};
