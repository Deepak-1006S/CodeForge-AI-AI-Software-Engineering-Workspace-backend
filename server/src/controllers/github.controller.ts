import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import * as githubService from '../services/github.service';

export const connectRepository = async (req: Request, res: Response): Promise<void> => {
  const { projectId, owner, repo, token } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  const isOwner = project.owner.toString() === req.user._id.toString();
  if (!isOwner && !['Admin', 'Manager'].includes(req.user.role)) {
    throw new ApiError(403, 'Only project owners or managers can connect repositories.');
  }

  // Verify the repo is accessible
  const repoDetails = await githubService.getRepoDetails(owner, repo, token);

  project.githubOwner = owner;
  project.githubRepo = repo;
  await project.save();

  res.status(200).json(
    new ApiResponse(
      200,
      { project, repoDetails },
      `Repository '${owner}/${repo}' connected successfully`,
    ),
  );
};

export const getRepoDetails = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId).select('githubOwner githubRepo');
  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  if (!project.githubOwner || !project.githubRepo) {
    throw new ApiError(400, 'No GitHub repository connected to this project.');
  }

  const token = req.headers['x-github-token'] as string | undefined;
  const repoDetails = await githubService.getRepoDetails(
    project.githubOwner,
    project.githubRepo,
    token,
  );

  res.status(200).json(new ApiResponse(200, { repoDetails }, 'Repository details retrieved'));
};

export const getCommits = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params;
  const { perPage } = req.query;

  const project = await Project.findById(projectId).select('githubOwner githubRepo');
  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  if (!project.githubOwner || !project.githubRepo) {
    throw new ApiError(400, 'No GitHub repository connected to this project.');
  }

  const token = req.headers['x-github-token'] as string | undefined;
  const commits = await githubService.getCommits(
    project.githubOwner,
    project.githubRepo,
    token,
    perPage ? parseInt(perPage as string, 10) : 20,
  );

  res.status(200).json(new ApiResponse(200, { commits }, 'Commits retrieved'));
};

export const getPullRequestStats = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId).select('githubOwner githubRepo');
  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  if (!project.githubOwner || !project.githubRepo) {
    throw new ApiError(400, 'No GitHub repository connected to this project.');
  }

  const token = req.headers['x-github-token'] as string | undefined;
  const stats = await githubService.getPullRequestStats(
    project.githubOwner,
    project.githubRepo,
    token,
  );

  res.status(200).json(new ApiResponse(200, { stats }, 'Pull request statistics retrieved'));
};

export const getContributors = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId).select('githubOwner githubRepo');
  if (!project) {
    throw new ApiError(404, 'Project not found.');
  }

  if (!project.githubOwner || !project.githubRepo) {
    throw new ApiError(400, 'No GitHub repository connected to this project.');
  }

  const token = req.headers['x-github-token'] as string | undefined;
  const contributors = await githubService.getContributors(
    project.githubOwner,
    project.githubRepo,
    token,
  );

  res.status(200).json(new ApiResponse(200, { contributors }, 'Contributors retrieved'));
};
