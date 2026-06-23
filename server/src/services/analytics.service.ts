import { Types, PipelineStage } from 'mongoose';
import { Project } from '../models/Project';
import { Issue } from '../models/Issue';
import { Organization } from '../models/Organization';
import { IssueActivity } from '../models/IssueActivity';
import { logger } from '../config/logger';

const toObjectId = (id: string) => new Types.ObjectId(id);

export interface OverviewStats {
  totalProjects: number;
  activeProjects: number;
  activeIssues: number;
  completedIssues: number;
  teamMembers: number;
  criticalIssues: number;
}

export interface ProjectProgress {
  projectId: string;
  title: string;
  status: string;
  issueCounts: {
    total: number;
    todo: number;
    inProgress: number;
    review: number;
    done: number;
  };
  completionPercentage: number;
}

export interface TimeSeriesPoint {
  week: string;
  date: string;
  count: number;
}

export interface WorkloadItem {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  issueCount: number;
  criticalCount: number;
}

export const getOverviewStats = async (orgId: string): Promise<OverviewStats> => {
  try {
    const orgObjectId = toObjectId(orgId);

    // Fetch all projects in org
    const projects = await Project.find({ organization: orgObjectId }).select('_id status').lean();
    const projectIds = projects.map((p) => p._id);

    const [
      activeIssues,
      completedIssues,
      criticalIssues,
      org,
    ] = await Promise.all([
      Issue.countDocuments({ project: { $in: projectIds }, status: { $ne: 'Done' } }),
      Issue.countDocuments({ project: { $in: projectIds }, status: 'Done' }),
      Issue.countDocuments({ project: { $in: projectIds }, priority: 'Critical', status: { $ne: 'Done' } }),
      Organization.findById(orgObjectId).select('members').lean(),
    ]);

    return {
      totalProjects: projects.length,
      activeProjects: projects.filter((p) => p.status === 'Active').length,
      activeIssues,
      completedIssues,
      teamMembers: org?.members?.length || 0,
      criticalIssues,
    };
  } catch (error) {
    logger.error('Analytics getOverviewStats error:', error);
    throw error;
  }
};

export const getProjectProgress = async (orgId: string): Promise<ProjectProgress[]> => {
  try {
    const projects = await Project.find({ organization: toObjectId(orgId) })
      .select('_id title status')
      .lean();

    const results = await Promise.all(
      projects.map(async (project) => {
        const [total, todo, inProgress, review, done] = await Promise.all([
          Issue.countDocuments({ project: project._id }),
          Issue.countDocuments({ project: project._id, status: 'Todo' }),
          Issue.countDocuments({ project: project._id, status: 'In Progress' }),
          Issue.countDocuments({ project: project._id, status: 'Review' }),
          Issue.countDocuments({ project: project._id, status: 'Done' }),
        ]);

        const completionPercentage = total > 0 ? Math.round((done / total) * 100) : 0;

        return {
          projectId: project._id.toString(),
          title: project.title,
          status: project.status,
          issueCounts: { total, todo, inProgress, review, done },
          completionPercentage,
        };
      }),
    );

    return results;
  } catch (error) {
    logger.error('Analytics getProjectProgress error:', error);
    throw error;
  }
};

export const getIssueResolutionTimeSeries = async (
  orgId: string,
  weeks = 8,
): Promise<TimeSeriesPoint[]> => {
  try {
    const projects = await Project.find({ organization: toObjectId(orgId) }).select('_id').lean();
    const projectIds = projects.map((p) => p._id);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - weeks * 7);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          project: { $in: projectIds },
          status: 'Done',
          updatedAt: { $gte: startDate },
        },
      } as PipelineStage,
      {
        $group: {
          _id: {
            year: { $isoWeekYear: '$updatedAt' },
            week: { $isoWeek: '$updatedAt' },
          },
          count: { $sum: 1 },
          date: { $min: '$updatedAt' },
        },
      } as PipelineStage,
      { $sort: { '_id.year': 1 as const, '_id.week': 1 as const } } as PipelineStage,
    ];

    const result = await Issue.aggregate(pipeline);

    return result.map((r) => ({
      week: `W${r._id.week}`,
      date: new Date(r.date).toISOString().split('T')[0],
      count: r.count,
    }));
  } catch (error) {
    logger.error('Analytics getIssueResolutionTimeSeries error:', error);
    throw error;
  }
};

export const getProductivityScore = async (orgId: string): Promise<number> => {
  try {
    const projects = await Project.find({ organization: toObjectId(orgId) }).select('_id').lean();
    const projectIds = projects.map((p) => p._id);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [total, done] = await Promise.all([
      Issue.countDocuments({
        project: { $in: projectIds },
        createdAt: { $gte: thirtyDaysAgo },
      }),
      Issue.countDocuments({
        project: { $in: projectIds },
        status: 'Done',
        updatedAt: { $gte: thirtyDaysAgo },
      }),
    ]);

    if (total === 0) return 0;
    return Math.round((done / total) * 100);
  } catch (error) {
    logger.error('Analytics getProductivityScore error:', error);
    throw error;
  }
};

export const getWorkloadDistribution = async (orgId: string): Promise<WorkloadItem[]> => {
  try {
    const projects = await Project.find({ organization: toObjectId(orgId) }).select('_id').lean();
    const projectIds = projects.map((p) => p._id);

    const pipeline: PipelineStage[] = [
      {
        $match: {
          project: { $in: projectIds },
          assignedTo: { $ne: null },
          status: { $ne: 'Done' },
        },
      } as PipelineStage,
      {
        $group: {
          _id: '$assignedTo',
          issueCount: { $sum: 1 },
          criticalCount: {
            $sum: { $cond: [{ $eq: ['$priority', 'Critical'] }, 1, 0] },
          },
        },
      } as PipelineStage,
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      } as PipelineStage,
      { $unwind: '$user' } as PipelineStage,
      { $sort: { issueCount: -1 as const } } as PipelineStage,
      { $limit: 20 as const } as PipelineStage,
    ];

    const result = await Issue.aggregate(pipeline);

    return result.map((r) => ({
      userId: r._id.toString(),
      name: r.user.name,
      email: r.user.email,
      avatar: r.user.avatar,
      issueCount: r.issueCount,
      criticalCount: r.criticalCount,
    }));
  } catch (error) {
    logger.error('Analytics getWorkloadDistribution error:', error);
    throw error;
  }
};

export const getTeamActivityFeed = async (orgId: string, limit = 20) => {
  try {
    const projects = await Project.find({ organization: toObjectId(orgId) }).select('_id').lean();
    const projectIds = projects.map((p) => p._id);

    // Get recent issues related to the org's projects
    const issues = await Issue.find({ project: { $in: projectIds } })
      .select('_id')
      .lean();
    const issueIds = issues.map((i) => i._id);

    const activities = await IssueActivity.find({ issue: { $in: issueIds } })
      .populate('actor', 'name avatar email')
      .populate('issue', 'title project')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return activities;
  } catch (error) {
    logger.error('Analytics getTeamActivityFeed error:', error);
    throw error;
  }
};
