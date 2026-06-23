import { Request, Response } from 'express';
import { Issue } from '../models/Issue';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import * as geminiService from '../services/gemini.service';

export const generateSprintSummary = async (req: Request, res: Response): Promise<void> => {
  const { projectId, startDate, endDate } = req.body;

  const project = await Project.findById(projectId).select('title');
  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  const dateFilter: Record<string, unknown> = { project: projectId, deletedAt: null };
  if (startDate || endDate) {
    const dateRange: Record<string, Date> = {};
    if (startDate) dateRange.$gte = new Date(startDate);
    if (endDate) dateRange.$lte = new Date(endDate);
    dateFilter.createdAt = dateRange;
  }

  const issues = await Issue.find(dateFilter)
    .populate('assignedTo', 'name')
    .select('title status priority assignedTo')
    .lean();

  const issueSummaries = issues.map((i) => ({
    title: i.title,
    status: i.status,
    priority: i.priority,
    assignedTo: (i.assignedTo as { name: string } | null)?.name,
  }));

  const summary = await geminiService.generateSprintSummary(
    issueSummaries,
    project.title,
    startDate || 'Not specified',
    endDate || 'Not specified',
  );

  res.status(200).json(new ApiResponse(200, { summary }, 'Sprint summary generated'));
};

export const explainBug = async (req: Request, res: Response): Promise<void> => {
  const { issueId } = req.body;

  const issue = await Issue.findById(issueId).select('title description priority labels');
  if (!issue) {
    throw new ApiError(404, 'Issue not found.');
  }

  const explanation = await geminiService.explainBug({
    title: issue.title,
    description: issue.description,
    priority: issue.priority,
    labels: issue.labels,
  });

  res.status(200).json(new ApiResponse(200, { explanation }, 'Bug explanation generated'));
};

export const generateReleaseNotes = async (req: Request, res: Response): Promise<void> => {
  const { projectId, version, includeAll = false } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  const filter: Record<string, unknown> = {
    project: projectId,
    deletedAt: null,
  };
  if (!includeAll) {
    filter.status = 'Done';
  }

  const issues = await Issue.find(filter)
    .select('title status priority')
    .lean();

  const issueSummaries = issues.map((i) => ({
    title: i.title,
    status: i.status,
    priority: i.priority,
  }));

  const releaseNotes = await geminiService.generateReleaseNotes(
    issueSummaries,
    version || '1.0.0',
  );

  res.status(200).json(new ApiResponse(200, { releaseNotes }, 'Release notes generated'));
};

export const generateTaskDescription = async (req: Request, res: Response): Promise<void> => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    throw new ApiError(400, 'A descriptive task title (at least 3 characters) is required.');
  }

  const description = await geminiService.generateTaskDescription(title.trim());

  res.status(200).json(new ApiResponse(200, { description }, 'Task description generated'));
};

export const generateStandupReport = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId).select('name');
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  const issues = await Issue.find({
    project: projectId,
    $or: [
      { assignedTo: userId },
      { status: 'In Progress' },
    ],
    deletedAt: null,
  })
    .select('title status priority')
    .lean();

  const issueSummaries = issues.map((i) => ({
    title: i.title,
    status: i.status,
    priority: i.priority,
  }));

  const report = await geminiService.generateStandupReport(issueSummaries, user.name);

  res.status(200).json(new ApiResponse(200, { report }, 'Standup report generated'));
};
