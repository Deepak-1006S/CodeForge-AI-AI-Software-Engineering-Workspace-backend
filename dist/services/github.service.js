"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContributors = exports.getPullRequestStats = exports.getCommits = exports.getRepoDetails = void 0;
const axios_1 = __importDefault(require("axios"));
const ApiError_1 = require("../utils/ApiError");
const logger_1 = require("../config/logger");
const GITHUB_API_BASE = 'https://api.github.com';
const createGitHubClient = (token) => {
    const headers = {
        Accept: 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return axios_1.default.create({
        baseURL: GITHUB_API_BASE,
        timeout: 10000,
        headers,
    });
};
const handleGitHubError = (error, owner, repo) => {
    if (axios_1.default.isAxiosError(error)) {
        const axiosError = error;
        const status = axiosError.response?.status;
        const message = axiosError.response?.data?.message;
        if (status === 404) {
            throw new ApiError_1.ApiError(404, `Repository '${owner}/${repo}' not found or is private.`);
        }
        if (status === 403) {
            if (message?.includes('rate limit')) {
                throw new ApiError_1.ApiError(429, 'GitHub API rate limit exceeded. Please try again later or provide a GitHub token.');
            }
            throw new ApiError_1.ApiError(403, 'Access to this GitHub repository is forbidden. Check your token permissions.');
        }
        if (status === 401) {
            throw new ApiError_1.ApiError(401, 'Invalid GitHub token. Please check your credentials.');
        }
        if (status === 422) {
            throw new ApiError_1.ApiError(422, 'Invalid request to GitHub API. Please check the repository details.');
        }
    }
    logger_1.logger.error('GitHub API unexpected error:', error);
    throw new ApiError_1.ApiError(503, 'GitHub API is temporarily unavailable. Please try again later.');
};
const getRepoDetails = async (owner, repo, token) => {
    try {
        const client = createGitHubClient(token);
        const { data } = await client.get(`/repos/${owner}/${repo}`);
        return {
            id: data.id,
            name: data.name,
            fullName: data.full_name,
            description: data.description,
            language: data.language,
            stars: data.stargazers_count,
            forks: data.forks_count,
            openIssues: data.open_issues_count,
            watchers: data.watchers_count,
            defaultBranch: data.default_branch,
            visibility: data.visibility,
            url: data.html_url,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
            pushedAt: data.pushed_at,
        };
    }
    catch (error) {
        if (error instanceof ApiError_1.ApiError)
            throw error;
        return handleGitHubError(error, owner, repo);
    }
};
exports.getRepoDetails = getRepoDetails;
const getCommits = async (owner, repo, token, perPage = 20) => {
    try {
        const client = createGitHubClient(token);
        const { data } = await client.get(`/repos/${owner}/${repo}/commits`, {
            params: { per_page: perPage },
        });
        return data.map((c) => {
            const commit = c.commit;
            const author = commit.author;
            return {
                sha: c.sha.substring(0, 7),
                message: commit.message.split('\n')[0], // First line only
                author: {
                    name: author?.name || 'Unknown',
                    email: author?.email || '',
                    date: author?.date || '',
                },
                url: c.url,
                htmlUrl: c.html_url,
            };
        });
    }
    catch (error) {
        if (error instanceof ApiError_1.ApiError)
            throw error;
        return handleGitHubError(error, owner, repo);
    }
};
exports.getCommits = getCommits;
const getPullRequestStats = async (owner, repo, token) => {
    try {
        const client = createGitHubClient(token);
        const [openRes, closedRes] = await Promise.all([
            client.get(`/repos/${owner}/${repo}/pulls`, {
                params: { state: 'open', per_page: 30 },
            }),
            client.get(`/repos/${owner}/${repo}/pulls`, {
                params: { state: 'closed', per_page: 30 },
            }),
        ]);
        const openPRs = openRes.data;
        const closedPRs = closedRes.data;
        const mergedPRs = closedPRs.filter((pr) => pr.merged_at !== null);
        // Calculate average merge time
        let avgMergeHours = null;
        if (mergedPRs.length > 0) {
            const mergeTimes = mergedPRs.map((pr) => {
                const created = new Date(pr.created_at).getTime();
                const merged = new Date(pr.merged_at).getTime();
                return (merged - created) / (1000 * 60 * 60); // hours
            });
            avgMergeHours = Math.round(mergeTimes.reduce((a, b) => a + b, 0) / mergeTimes.length);
        }
        const recentPRs = [...openPRs, ...closedPRs]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 10)
            .map((pr) => ({
            number: pr.number,
            title: pr.title,
            state: pr.state,
            author: pr.user?.login || 'Unknown',
            createdAt: pr.created_at,
            mergedAt: pr.merged_at || null,
        }));
        return {
            totalOpen: openPRs.length,
            totalClosed: closedPRs.length,
            totalMerged: mergedPRs.length,
            averageTimeToMergeHours: avgMergeHours,
            recentPRs,
        };
    }
    catch (error) {
        if (error instanceof ApiError_1.ApiError)
            throw error;
        return handleGitHubError(error, owner, repo);
    }
};
exports.getPullRequestStats = getPullRequestStats;
const getContributors = async (owner, repo, token) => {
    try {
        const client = createGitHubClient(token);
        const { data } = await client.get(`/repos/${owner}/${repo}/contributors`, {
            params: { per_page: 20 },
        });
        return data.map((c) => ({
            login: c.login,
            avatarUrl: c.avatar_url,
            htmlUrl: c.html_url,
            contributions: c.contributions,
            type: c.type,
        }));
    }
    catch (error) {
        if (error instanceof ApiError_1.ApiError)
            throw error;
        return handleGitHubError(error, owner, repo);
    }
};
exports.getContributors = getContributors;
