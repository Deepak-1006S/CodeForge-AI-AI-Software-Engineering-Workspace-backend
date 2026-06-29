"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIssuesByProject = exports.getActivity = exports.updateStatus = exports.assignIssue = exports.deleteIssue = exports.updateIssue = exports.getIssueById = exports.getIssues = exports.createIssue = void 0;
const mongoose_1 = require("mongoose");
const Issue_1 = require("../models/Issue");
const IssueActivity_1 = require("../models/IssueActivity");
const Project_1 = require("../models/Project");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const pagination_1 = require("../utils/pagination");
const notification_service_1 = require("../services/notification.service");
const socket_1 = require("../socket");
const logActivity = async (issueId, actorId, action, oldValue, newValue) => {
    try {
        const activity = await IssueActivity_1.IssueActivity.create({
            issue: issueId,
            actor: actorId,
            action,
            oldValue: oldValue || null,
            newValue: newValue || null,
        });
        // Emit activity event via socket
        try {
            const io = (0, socket_1.getIO)();
            if (io) {
                const populated = await IssueActivity_1.IssueActivity.findById(activity._id)
                    .populate('actor', 'name avatar email')
                    .populate({ path: 'issue', select: 'project' })
                    .lean();
                if (populated && populated.issue && populated.actor) {
                    const issueDoc = populated.issue;
                    const projectId = issueDoc.project
                        ? issueDoc.project.toString()
                        : issueDoc._id?.toString();
                    const payload = {
                        issueId: issueDoc._id.toString(),
                        projectId,
                        actor: populated.actor._id.toString(),
                        action: populated.action,
                        createdAt: populated.createdAt,
                    };
                    io.emit('activity:new', payload);
                }
            }
        }
        catch {
            // Socket emit failure should not break the request
        }
        return activity;
    }
    catch (err) {
        // Activity logging failure should not break the main operation
        return null;
    }
};
const createIssue = async (req, res) => {
    const { title, description, project, assignedTo, priority, status, labels, dueDate } = req.body;
    // Verify project exists
    const proj = await Project_1.Project.findById(project);
    if (!proj) {
        throw new ApiError_1.ApiError(404, 'Project not found.');
    }
    const issue = await Issue_1.Issue.create({
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
        await (0, notification_service_1.createNotification)({
            recipient: assignedTo,
            sender: req.user._id,
            type: 'issue_assigned',
            message: `${req.user.name} assigned you to issue: ${issue.title}`,
            link: `/issues/${issue._id}`,
        });
    }
    // Emit socket event
    try {
        const io = (0, socket_1.getIO)();
        if (io) {
            io.to(`project:${project}`).emit('issue:created', {
                issue: issue.toJSON(),
                projectId: project,
                createdBy: req.user._id.toString(),
            });
        }
    }
    catch {
        // Non-critical
    }
    res.status(201).json(new ApiResponse_1.ApiResponse(201, { issue }, 'Issue created successfully'));
};
exports.createIssue = createIssue;
const getIssues = async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
    const { projectId, priority, status, assignedTo, search, labels } = req.query;
    if (!projectId) {
        throw new ApiError_1.ApiError(400, 'Project ID is required.');
    }
    const filter = {
        project: new mongoose_1.Types.ObjectId(projectId),
        deletedAt: null,
    };
    if (priority)
        filter.priority = priority;
    if (status)
        filter.status = status;
    if (assignedTo)
        filter.assignedTo = new mongoose_1.Types.ObjectId(assignedTo);
    if (labels)
        filter.labels = { $in: labels.split(',') };
    if (search) {
        // Use regex search for reliable case-insensitive matching
        // (text index may not be built yet on new Atlas clusters)
        const searchRegex = { $regex: search, $options: 'i' };
        filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }
    const sortBy = { createdAt: -1 };
    const [issues, total] = await Promise.all([
        Issue_1.Issue.find(filter)
            .populate('assignedTo', 'name email avatar')
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .lean(),
        Issue_1.Issue.countDocuments(filter),
    ]);
    const meta = (0, pagination_1.buildPaginationMeta)(total, page, limit);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { issues }, 'Issues retrieved', meta));
};
exports.getIssues = getIssues;
const getIssueById = async (req, res) => {
    const issue = await Issue_1.Issue.findById(req.params.id)
        .populate('assignedTo', 'name email avatar')
        .populate('project', 'title organization status');
    if (!issue) {
        throw new ApiError_1.ApiError(404, 'Issue not found.');
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { issue }, 'Issue retrieved'));
};
exports.getIssueById = getIssueById;
const updateIssue = async (req, res) => {
    const issue = await Issue_1.Issue.findById(req.params.id);
    if (!issue) {
        throw new ApiError_1.ApiError(404, 'Issue not found.');
    }
    const changedFields = [];
    const allowedFields = ['title', 'description', 'priority', 'status', 'labels', 'dueDate', 'assignedTo'];
    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            const oldValue = String(issue.get(field) || '');
            const newValue = String(req.body[field] || '');
            if (oldValue !== newValue) {
                changedFields.push(field);
                await logActivity(issue._id, req.user._id, `updated ${field}`, oldValue, newValue);
            }
            issue.set(field, req.body[field]);
        }
    }
    if (changedFields.length === 0) {
        throw new ApiError_1.ApiError(400, 'No changes detected. Please provide fields to update.');
    }
    await issue.save();
    await issue.populate([
        { path: 'assignedTo', select: 'name email avatar' },
        { path: 'project', select: 'title organization' },
    ]);
    // Emit socket update
    try {
        const io = (0, socket_1.getIO)();
        if (io) {
            io.to(`project:${issue.project}`).emit('issue:updated', {
                issueId: issue._id.toString(),
                projectId: issue.project.toString(),
                updatedFields: Object.fromEntries(changedFields.map((f) => [f, issue.get(f)])),
                updatedBy: req.user._id.toString(),
            });
        }
    }
    catch {
        // Non-critical
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { issue }, 'Issue updated successfully'));
};
exports.updateIssue = updateIssue;
const deleteIssue = async (req, res) => {
    const issue = await Issue_1.Issue.findById(req.params.id);
    if (!issue) {
        throw new ApiError_1.ApiError(404, 'Issue not found.');
    }
    issue.deletedAt = new Date();
    await issue.save();
    await logActivity(issue._id, req.user._id, 'deleted issue');
    // Emit deletion socket event
    try {
        const io = (0, socket_1.getIO)();
        if (io) {
            io.to(`project:${issue.project}`).emit('issue:deleted', {
                issueId: issue._id.toString(),
                projectId: issue.project.toString(),
            });
        }
    }
    catch {
        // Non-critical
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, {}, 'Issue deleted successfully'));
};
exports.deleteIssue = deleteIssue;
const assignIssue = async (req, res) => {
    const { userId } = req.body;
    const issue = await Issue_1.Issue.findById(req.params.id);
    if (!issue) {
        throw new ApiError_1.ApiError(404, 'Issue not found.');
    }
    const oldAssignee = issue.assignedTo?.toString() || 'unassigned';
    const newAssignee = userId || 'unassigned';
    issue.assignedTo = userId ? new mongoose_1.Types.ObjectId(userId) : null;
    await issue.save();
    await issue.populate('assignedTo', 'name email avatar');
    await logActivity(issue._id, req.user._id, 'reassigned issue', oldAssignee, newAssignee);
    // Notify new assignee
    if (userId && userId !== req.user._id.toString()) {
        await (0, notification_service_1.createNotification)({
            recipient: userId,
            sender: req.user._id,
            type: 'issue_assigned',
            message: `${req.user.name} assigned you to issue: ${issue.title}`,
            link: `/issues/${issue._id}`,
        });
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { issue }, 'Issue assigned successfully'));
};
exports.assignIssue = assignIssue;
const updateStatus = async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Todo', 'In Progress', 'Review', 'Done'];
    if (!validStatuses.includes(status)) {
        throw new ApiError_1.ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
    const issue = await Issue_1.Issue.findById(req.params.id);
    if (!issue) {
        throw new ApiError_1.ApiError(404, 'Issue not found.');
    }
    const oldStatus = issue.status;
    issue.status = status;
    await issue.save();
    await logActivity(issue._id, req.user._id, 'changed status', oldStatus, status);
    // Emit socket event for kanban board updates
    try {
        const io = (0, socket_1.getIO)();
        if (io) {
            io.to(`project:${issue.project}`).emit('issue:updated', {
                issueId: issue._id.toString(),
                projectId: issue.project.toString(),
                updatedFields: { status },
                updatedBy: req.user._id.toString(),
            });
            io.to(`org:${req.query.orgId}`).emit('dashboard:refresh', {
                orgId: req.query.orgId,
                reason: 'issue_status_changed',
            });
        }
    }
    catch {
        // Non-critical
    }
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { issue }, 'Issue status updated'));
};
exports.updateStatus = updateStatus;
const getActivity = async (req, res) => {
    const { page, limit, skip } = (0, pagination_1.parsePagination)(req);
    const issueId = req.params.id;
    // Verify issue exists
    const issue = await Issue_1.Issue.findById(issueId);
    if (!issue) {
        throw new ApiError_1.ApiError(404, 'Issue not found.');
    }
    const [activities, total] = await Promise.all([
        IssueActivity_1.IssueActivity.find({ issue: new mongoose_1.Types.ObjectId(issueId) })
            .populate('actor', 'name email avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        IssueActivity_1.IssueActivity.countDocuments({ issue: new mongoose_1.Types.ObjectId(issueId) }),
    ]);
    const meta = (0, pagination_1.buildPaginationMeta)(total, page, limit);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { activities }, 'Activity log retrieved', meta));
};
exports.getActivity = getActivity;
const getIssuesByProject = async (req, res) => {
    const projectId = req.params.projectId || req.query.projectId;
    if (!projectId) {
        throw new ApiError_1.ApiError(400, 'Project ID is required.');
    }
    const issues = await Issue_1.Issue.find({
        project: new mongoose_1.Types.ObjectId(projectId),
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
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { issues, kanbanBoard }, 'Issues retrieved for project'));
};
exports.getIssuesByProject = getIssuesByProject;
