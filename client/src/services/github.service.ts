import api from './api';
import {
  GitHubRepository,
  GitHubCommit,
  GitHubPullRequest,
  GitHubContributor,
  ConnectRepoRequest,
  GetRepoDetailsResponse,
  GetCommitsResponse,
  GetPullRequestsResponse,
  GetContributorsResponse,
  GitHubPullRequestStats,
} from '../types/github.types';

const mockRepository: GitHubRepository = {
  id: 'repo-1',
  name: 'codeforge-ai',
  owner: 'codeforge',
  url: 'https://github.com/codeforge/codeforge-ai',
  description: 'AI-powered project management and development platform',
  stars: 1250,
  language: 'TypeScript',
  topics: ['project-management', 'ai', 'collaboration', 'developer-tools'],
  isPrivate: false,
  lastSyncedAt: new Date(),
};

const mockCommits: GitHubCommit[] = [
  {
    sha: 'abc123def456',
    message: 'feat: implement Gemini AI integration',
    author: 'Alice Johnson',
    authorEmail: 'alice@example.com',
    authorAvatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    url: 'https://github.com/codeforge/codeforge-ai/commit/abc123def456',
  },
  {
    sha: 'def789ghi012',
    message: 'fix: resolve socket.io connection timeout',
    author: 'Bob Smith',
    authorEmail: 'bob@example.com',
    authorAvatar: 'https://avatars.githubusercontent.com/u/2?v=4',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    url: 'https://github.com/codeforge/codeforge-ai/commit/def789ghi012',
  },
  {
    sha: 'ghi345jkl678',
    message: 'docs: update API documentation',
    author: 'Carol White',
    authorEmail: 'carol@example.com',
    authorAvatar: 'https://avatars.githubusercontent.com/u/3?v=4',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    url: 'https://github.com/codeforge/codeforge-ai/commit/ghi345jkl678',
  },
];

const mockPullRequests: GitHubPullRequest[] = [
  {
    id: 1,
    number: 42,
    title: 'Add dark mode support',
    state: 'merged',
    author: 'Alice Johnson',
    authorAvatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    mergedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    url: 'https://github.com/codeforge/codeforge-ai/pull/42',
    additions: 256,
    deletions: 48,
  },
  {
    id: 2,
    number: 45,
    title: 'Implement real-time notifications',
    state: 'open',
    author: 'Bob Smith',
    authorAvatar: 'https://avatars.githubusercontent.com/u/2?v=4',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
    url: 'https://github.com/codeforge/codeforge-ai/pull/45',
    additions: 512,
    deletions: 128,
  },
  {
    id: 3,
    number: 38,
    title: 'Fix authentication flow',
    state: 'merged',
    author: 'Carol White',
    authorAvatar: 'https://avatars.githubusercontent.com/u/3?v=4',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    mergedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    url: 'https://github.com/codeforge/codeforge-ai/pull/38',
    additions: 128,
    deletions: 96,
  },
];

const mockContributors: GitHubContributor[] = [
  {
    login: 'alice-johnson',
    avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
    name: 'Alice Johnson',
    commitCount: 156,
    url: 'https://github.com/alice-johnson',
  },
  {
    login: 'bob-smith',
    avatar: 'https://avatars.githubusercontent.com/u/2?v=4',
    name: 'Bob Smith',
    commitCount: 98,
    url: 'https://github.com/bob-smith',
  },
  {
    login: 'carol-white',
    avatar: 'https://avatars.githubusercontent.com/u/3?v=4',
    name: 'Carol White',
    commitCount: 67,
    url: 'https://github.com/carol-white',
  },
  {
    login: 'david-brown',
    avatar: 'https://avatars.githubusercontent.com/u/4?v=4',
    name: 'David Brown',
    commitCount: 45,
    url: 'https://github.com/david-brown',
  },
];

export const connectRepo = async (request: ConnectRepoRequest): Promise<GitHubRepository> => {
  try {
    const response = await api.post<GetRepoDetailsResponse>('/api/github/connect', request);
    return response.data.repository;
  } catch (error) {
    console.error('Failed to connect repository:', error);
    return mockRepository;
  }
};

export const getRepoDetails = async (repoId: string): Promise<GitHubRepository> => {
  try {
    const response = await api.get<GetRepoDetailsResponse>(`/api/github/repos/${repoId}`);
    return response.data.repository;
  } catch (error) {
    console.error('Failed to fetch repository details:', error);
    return mockRepository;
  }
};

export const getCommits = async (repoId: string, limit: number = 10): Promise<GitHubCommit[]> => {
  try {
    const response = await api.get<GetCommitsResponse>(`/api/github/repos/${repoId}/commits`, {
      params: { limit },
    });
    return response.data.commits;
  } catch (error) {
    console.error('Failed to fetch commits:', error);
    return mockCommits.slice(0, limit);
  }
};

export const getPullRequests = async (
  repoId: string
): Promise<{ pullRequests: GitHubPullRequest[]; stats: GitHubPullRequestStats }> => {
  try {
    const response = await api.get<GetPullRequestsResponse>(`/api/github/repos/${repoId}/pull-requests`);
    return {
      pullRequests: response.data.pullRequests,
      stats: response.data.stats,
    };
  } catch (error) {
    console.error('Failed to fetch pull requests:', error);
    const stats: GitHubPullRequestStats = {
      open: mockPullRequests.filter((pr) => pr.state === 'open').length,
      closed: mockPullRequests.filter((pr) => pr.state === 'closed').length,
      merged: mockPullRequests.filter((pr) => pr.state === 'merged').length,
      total: mockPullRequests.length,
    };
    return { pullRequests: mockPullRequests, stats };
  }
};

export const getContributors = async (repoId: string): Promise<GitHubContributor[]> => {
  try {
    const response = await api.get<GetContributorsResponse>(`/api/github/repos/${repoId}/contributors`);
    return response.data.contributors;
  } catch (error) {
    console.error('Failed to fetch contributors:', error);
    return mockContributors;
  }
};