"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeamActivityFeed = exports.getWorkloadDistribution = exports.getProductivityScore = exports.getIssueResolutionTimeSeries = exports.getProjectProgress = exports.getOverviewStats = void 0;
const mongoose_1 = require("mongoose");
const Project_1 = require("../models/Project");
const Issue_1 = require("../models/Issue");
const Organization_1 = require("../models/Organization");
const IssueActivity_1 = require("../models/IssueActivity");
const logger_1 = require("../config/logger");
const toObjectId = (id) => new mongoose_1.Types.ObjectId(id);
const getOverviewStats = async (orgId) => {
    try {
        const orgObjectId = toObjectId(orgId);
        // Fetch all projects in org
        const projects = await Project_1.Project.find({ organization: orgObjectId }).select('_id status').lean();
        const projectIds = projects.map((p) => p._id);
        const [activeIssues, completedIssues, criticalIssues, org,] = await Promise.all([
            Issue_1.Issue.countDocuments({ project: { $in: projectIds }, status: { $ne: 'Done' } }),
            Issue_1.Issue.countDocuments({ project: { $in: projectIds }, status: 'Done' }),
            Issue_1.Issue.countDocuments({ project: { $in: projectIds }, priority: 'Critical', status: { $ne: 'Done' } }),
            Organization_1.Organization.findById(orgObjectId).select('members').lean(),
        ]);
        return {
            totalProjects: projects.length,
            activeProjects: projects.filter((p) => p.status === 'Active').length,
            activeIssues,
            completedIssues,
            teamMembers: org?.members?.length || 0,
            criticalIssues,
        };
    }
    catch (error) {
        logger_1.logger.error('Analytics getOverviewStats error:', error);
        throw error;
    }
};
exports.getOverviewStats = getOverviewStats;
const getProjectProgress = async (orgId) => {
    try {
        const projects = await Project_1.Project.find({ organization: toObjectId(orgId) })
            .select('_id title status')
            .lean();
        const results = await Promise.all(projects.map(async (project) => {
            const [total, todo, inProgress, review, done] = await Promise.all([
                Issue_1.Issue.countDocuments({ project: project._id }),
                Issue_1.Issue.countDocuments({ project: project._id, status: 'Todo' }),
                Issue_1.Issue.countDocuments({ project: project._id, status: 'In Progress' }),
                Issue_1.Issue.countDocuments({ project: project._id, status: 'Review' }),
                Issue_1.Issue.countDocuments({ project: project._id, status: 'Done' }),
            ]);
            const completionPercentage = total > 0 ? Math.round((done / total) * 100) : 0;
            return {
                projectId: project._id.toString(),
                title: project.title,
                status: project.status,
                issueCounts: { total, todo, inProgress, review, done },
                completionPercentage,
            };
        }));
        return results;
    }
    catch (error) {
        logger_1.logger.error('Analytics getProjectProgress error:', error);
        throw error;
    }
};
exports.getProjectProgress = getProjectProgress;
const getIssueResolutionTimeSeries = async (orgId, weeks = 8) => {
    try {
        const projects = await Project_1.Project.find({ organization: toObjectId(orgId) }).select('_id').lean();
        const projectIds = projects.map((p) => p._id);
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - weeks * 7);
        const pipeline = [
            {
                $match: {
                    project: { $in: projectIds },
                    status: 'Done',
                    updatedAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $isoWeekYear: '$updatedAt' },
                        week: { $isoWeek: '$updatedAt' },
                    },
                    count: { $sum: 1 },
                    date: { $min: '$updatedAt' },
                },
            },
            { $sort: { '_id.year': 1, '_id.week': 1 } },
        ];
        const result = await Issue_1.Issue.aggregate(pipeline);
        return result.map((r) => ({
            week: `W${r._id.week}`,
            date: new Date(r.date).toISOString().split('T')[0],
            count: r.count,
        }));
    }
    catch (error) {
        logger_1.logger.error('Analytics getIssueResolutionTimeSeries error:', error);
        throw error;
    }
};
exports.getIssueResolutionTimeSeries = getIssueResolutionTimeSeries;
const getProductivityScore = async (orgId) => {
    try {
        const projects = await Project_1.Project.find({ organization: toObjectId(orgId) }).select('_id').lean();
        const projectIds = projects.map((p) => p._id);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const [total, done] = await Promise.all([
            Issue_1.Issue.countDocuments({
                project: { $in: projectIds },
                createdAt: { $gte: thirtyDaysAgo },
            }),
            Issue_1.Issue.countDocuments({
                project: { $in: projectIds },
                status: 'Done',
                updatedAt: { $gte: thirtyDaysAgo },
            }),
        ]);
        if (total === 0)
            return 0;
        return Math.round((done / total) * 100);
    }
    catch (error) {
        logger_1.logger.error('Analytics getProductivityScore error:', error);
        throw error;
    }
};
exports.getProductivityScore = getProductivityScore;
const getWorkloadDistribution = async (orgId) => {
    try {
        const projects = await Project_1.Project.find({ organization: toObjectId(orgId) }).select('_id').lean();
        const projectIds = projects.map((p) => p._id);
        const pipeline = [
            {
                $match: {
                    project: { $in: projectIds },
                    assignedTo: { $ne: null },
                    status: { $ne: 'Done' },
                },
            },
            {
                $group: {
                    _id: '$assignedTo',
                    issueCount: { $sum: 1 },
                    criticalCount: {
                        $sum: { $cond: [{ $eq: ['$priority', 'Critical'] }, 1, 0] },
                    },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            { $unwind: '$user' },
            { $sort: { issueCount: -1 } },
            { $limit: 20 },
        ];
        const result = await Issue_1.Issue.aggregate(pipeline);
        return result.map((r) => ({
            userId: r._id.toString(),
            name: r.user.name,
            email: r.user.email,
            avatar: r.user.avatar,
            issueCount: r.issueCount,
            criticalCount: r.criticalCount,
        }));
    }
    catch (error) {
        logger_1.logger.error('Analytics getWorkloadDistribution error:', error);
        throw error;
    }
};
exports.getWorkloadDistribution = getWorkloadDistribution;
const getTeamActivityFeed = async (orgId, limit = 20) => {
    try {
        const projects = await Project_1.Project.find({ organization: toObjectId(orgId) }).select('_id').lean();
        const projectIds = projects.map((p) => p._id);
        // Get recent issues related to the org's projects
        const issues = await Issue_1.Issue.find({ project: { $in: projectIds } })
            .select('_id')
            .lean();
        const issueIds = issues.map((i) => i._id);
        const activities = await IssueActivity_1.IssueActivity.find({ issue: { $in: issueIds } })
            .populate('actor', 'name avatar email')
            .populate('issue', 'title project')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();
        return activities;
    }
    catch (error) {
        logger_1.logger.error('Analytics getTeamActivityFeed error:', error);
        throw error;
    }
};
exports.getTeamActivityFeed = getTeamActivityFeed;
