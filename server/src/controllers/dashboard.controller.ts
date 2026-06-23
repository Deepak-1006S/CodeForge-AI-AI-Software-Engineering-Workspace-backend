import { Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import * as analyticsService from '../services/analytics.service';

export const getOverview = async (req: Request, res: Response): Promise<void> => {
  const { orgId } = req.query;
  if (!orgId) {
    throw new ApiError(400, 'Organization ID is required.');
  }

  const stats = await analyticsService.getOverviewStats(orgId as string);

  res.status(200).json(new ApiResponse(200, { stats }, 'Dashboard overview retrieved'));
};

export const getProjectMetrics = async (req: Request, res: Response): Promise<void> => {
  const { orgId } = req.query;
  if (!orgId) {
    throw new ApiError(400, 'Organization ID is required.');
  }

  const projectProgress = await analyticsService.getProjectProgress(orgId as string);
  const productivityScore = await analyticsService.getProductivityScore(orgId as string);

  res.status(200).json(
    new ApiResponse(
      200,
      { projectProgress, productivityScore },
      'Project metrics retrieved',
    ),
  );
};

export const getIssueResolution = async (req: Request, res: Response): Promise<void> => {
  const { orgId, weeks } = req.query;
  if (!orgId) {
    throw new ApiError(400, 'Organization ID is required.');
  }

  const weeksNum = weeks ? parseInt(weeks as string, 10) : 8;
  const timeSeries = await analyticsService.getIssueResolutionTimeSeries(
    orgId as string,
    weeksNum,
  );

  res.status(200).json(
    new ApiResponse(200, { timeSeries }, 'Issue resolution time series retrieved'),
  );
};

export const getTeamActivity = async (req: Request, res: Response): Promise<void> => {
  const { orgId, limit } = req.query;
  if (!orgId) {
    throw new ApiError(400, 'Organization ID is required.');
  }

  const limitNum = limit ? Math.min(parseInt(limit as string, 10), 50) : 20;
  const activities = await analyticsService.getTeamActivityFeed(orgId as string, limitNum);

  res.status(200).json(new ApiResponse(200, { activities }, 'Team activity retrieved'));
};

export const getWorkload = async (req: Request, res: Response): Promise<void> => {
  const { orgId } = req.query;
  if (!orgId) {
    throw new ApiError(400, 'Organization ID is required.');
  }

  const workload = await analyticsService.getWorkloadDistribution(orgId as string);

  res.status(200).json(new ApiResponse(200, { workload }, 'Workload distribution retrieved'));
};
