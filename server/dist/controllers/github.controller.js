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
exports.getContributors = exports.getPullRequestStats = exports.getCommits = exports.getRepoDetails = exports.connectRepository = void 0;
const Project_1 = require("../models/Project");
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const githubService = __importStar(require("../services/github.service"));
const connectRepository = async (req, res) => {
    const { projectId, owner, repo, token } = req.body;
    const project = await Project_1.Project.findById(projectId);
    if (!project) {
        throw new ApiError_1.ApiError(404, 'Project not found.');
    }
    const isOwner = project.owner.toString() === req.user._id.toString();
    if (!isOwner && !['Admin', 'Manager'].includes(req.user.role)) {
        throw new ApiError_1.ApiError(403, 'Only project owners or managers can connect repositories.');
    }
    // Verify the repo is accessible
    const repoDetails = await githubService.getRepoDetails(owner, repo, token);
    project.githubOwner = owner;
    project.githubRepo = repo;
    await project.save();
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { project, repoDetails }, `Repository '${owner}/${repo}' connected successfully`));
};
exports.connectRepository = connectRepository;
const getRepoDetails = async (req, res) => {
    const { projectId } = req.params;
    const project = await Project_1.Project.findById(projectId).select('githubOwner githubRepo');
    if (!project) {
        throw new ApiError_1.ApiError(404, 'Project not found.');
    }
    if (!project.githubOwner || !project.githubRepo) {
        throw new ApiError_1.ApiError(400, 'No GitHub repository connected to this project.');
    }
    const token = req.headers['x-github-token'];
    const repoDetails = await githubService.getRepoDetails(project.githubOwner, project.githubRepo, token);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { repoDetails }, 'Repository details retrieved'));
};
exports.getRepoDetails = getRepoDetails;
const getCommits = async (req, res) => {
    const { projectId } = req.params;
    const { perPage } = req.query;
    const project = await Project_1.Project.findById(projectId).select('githubOwner githubRepo');
    if (!project) {
        throw new ApiError_1.ApiError(404, 'Project not found.');
    }
    if (!project.githubOwner || !project.githubRepo) {
        throw new ApiError_1.ApiError(400, 'No GitHub repository connected to this project.');
    }
    const token = req.headers['x-github-token'];
    const commits = await githubService.getCommits(project.githubOwner, project.githubRepo, token, perPage ? parseInt(perPage, 10) : 20);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { commits }, 'Commits retrieved'));
};
exports.getCommits = getCommits;
const getPullRequestStats = async (req, res) => {
    const { projectId } = req.params;
    const project = await Project_1.Project.findById(projectId).select('githubOwner githubRepo');
    if (!project) {
        throw new ApiError_1.ApiError(404, 'Project not found.');
    }
    if (!project.githubOwner || !project.githubRepo) {
        throw new ApiError_1.ApiError(400, 'No GitHub repository connected to this project.');
    }
    const token = req.headers['x-github-token'];
    const stats = await githubService.getPullRequestStats(project.githubOwner, project.githubRepo, token);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { stats }, 'Pull request statistics retrieved'));
};
exports.getPullRequestStats = getPullRequestStats;
const getContributors = async (req, res) => {
    const { projectId } = req.params;
    const project = await Project_1.Project.findById(projectId).select('githubOwner githubRepo');
    if (!project) {
        throw new ApiError_1.ApiError(404, 'Project not found.');
    }
    if (!project.githubOwner || !project.githubRepo) {
        throw new ApiError_1.ApiError(400, 'No GitHub repository connected to this project.');
    }
    const token = req.headers['x-github-token'];
    const contributors = await githubService.getContributors(project.githubOwner, project.githubRepo, token);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { contributors }, 'Contributors retrieved'));
};
exports.getContributors = getContributors;
