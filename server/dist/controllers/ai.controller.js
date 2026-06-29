"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateStandupReport = exports.generateTaskDescription = exports.generateReleaseNotes = exports.explainBug = exports.generateSprintSummary = void 0;
const Issue_1 = require("../models/Issue");
const Project_1 = require("../models/Project");
const User_1 = require("../models/User");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const geminiService = __importStar(require("../services/gemini.service"));
const generateSprintSummary = async (req, res) => {
    const { projectId, startDate, endDate } = req.body;
    const project = await Project_1.Project.findById(projectId).select('title');
    if (!project) {
        throw new ApiError_1.ApiError(404, 'Project not found.');
    }
    const dateFilter = { project: projectId, deletedAt: null };
    if (startDate || endDate) {
        const dateRange = {};
        if (startDate)
            dateRange.$gte = new Date(startDate);
        if (endDate)
            dateRange.$lte = new Date(endDate);
        dateFilter.createdAt = dateRange;
    }
    const issues = await Issue_1.Issue.find(dateFilter)
        .populate('assignedTo', 'name')
        .select('title status priority assignedTo')
        .lean();
    const issueSummaries = issues.map((i) => ({
        title: i.title,
        status: i.status,
        priority: i.priority,
        assignedTo: i.assignedTo?.name,
    }));
    const summary = await geminiService.generateSprintSummary(issueSummaries, project.title, startDate || 'Not specified', endDate || 'Not specified');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { summary }, 'Sprint summary generated'));
};
exports.generateSprintSummary = generateSprintSummary;
const explainBug = async (req, res) => {
    const { issueId } = req.body;
    const issue = await Issue_1.Issue.findById(issueId).select('title description priority labels');
    if (!issue) {
        throw new ApiError_1.ApiError(404, 'Issue not found.');
    }
    const explanation = await geminiService.explainBug({
        title: issue.title,
        description: issue.description,
        priority: issue.priority,
        labels: issue.labels,
    });
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { explanation }, 'Bug explanation generated'));
};
exports.explainBug = explainBug;
const generateReleaseNotes = async (req, res) => {
    const { projectId, version, includeAll = false } = req.body;
    const project = await Project_1.Project.findById(projectId);
    if (!project) {
        throw new ApiError_1.ApiError(404, 'Project not found.');
    }
    const filter = {
        project: projectId,
        deletedAt: null,
    };
    if (!includeAll) {
        filter.status = 'Done';
    }
    const issues = await Issue_1.Issue.find(filter)
        .select('title status priority')
        .lean();
    const issueSummaries = issues.map((i) => ({
        title: i.title,
        status: i.status,
        priority: i.priority,
    }));
    const releaseNotes = await geminiService.generateReleaseNotes(issueSummaries, version || '1.0.0');
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { releaseNotes }, 'Release notes generated'));
};
exports.generateReleaseNotes = generateReleaseNotes;
const generateTaskDescription = async (req, res) => {
    const { title } = req.body;
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
        throw new ApiError_1.ApiError(400, 'A descriptive task title (at least 3 characters) is required.');
    }
    const description = await geminiService.generateTaskDescription(title.trim());
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { description }, 'Task description generated'));
};
exports.generateTaskDescription = generateTaskDescription;
const generateStandupReport = async (req, res) => {
    const { projectId } = req.body;
    const userId = req.user._id;
    const user = await User_1.User.findById(userId).select('name');
    if (!user) {
        throw new ApiError_1.ApiError(404, 'User not found.');
    }
    const issues = await Issue_1.Issue.find({
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
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { report }, 'Standup report generated'));
};
exports.generateStandupReport = generateStandupReport;
