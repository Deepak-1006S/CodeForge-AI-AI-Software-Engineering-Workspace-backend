import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from '../utils/ApiError';
import { logger } from '../config/logger';

const GITHUB_API_BASE = 'https://api.github.com';

export interface RepoDetails {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  defaultBranch: string;
  visibility: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
}

export interface Commit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
  };
  url: string;
  htmlUrl: string;
}

export interface PRStats {
  totalOpen: number;
  totalClosed: number;
  totalMerged: number;
  averageTimeToMergeHours: number | null;
  recentPRs: {
    number: number;
    title: string;
    state: string;
    author: string;
    createdAt: string;
    mergedAt: string | null;
  }[];
}

export interface Contributor {
  login: string;
  avatarUrl: string;
  htmlUrl: string;
  contributions: number;
  type: string;
}

const createGitHubClient = (token?: string): AxiosInstance => {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return axios.create({
    baseURL: GITHUB_API_BASE,
    timeout: 10000,
    headers,
  });
};

const handleGitHubError = (error: unknown, owner: string, repo: string): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message: string }>;
    const status = axiosError.response?.status;
    const message = axiosError.response?.data?.message;

    if (status === 404) {
      throw new ApiError(404, `Repository '${owner}/${repo}' not found or is private.`);
    }
    if (status === 403) {
      if (message?.includes('rate limit')) {
        throw new ApiError(429, 'GitHub API rate limit exceeded. Please try again later or provide a GitHub token.');
      }
      throw new ApiError(403, 'Access to this GitHub repository is forbidden. Check your token permissions.');
    }
    if (status === 401) {
      throw new ApiError(401, 'Invalid GitHub token. Please check your credentials.');
    }
    if (status === 422) {
      throw new ApiError(422, 'Invalid request to GitHub API. Please check the repository details.');
    }
  }
  logger.error('GitHub API unexpected error:', error);
  throw new ApiError(503, 'GitHub API is temporarily unavailable. Please try again later.');
};

export const getRepoDetails = async (
  owner: string,
  repo: string,
  token?: string,
): Promise<RepoDetails> => {
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
  } catch (error) {
    if (error instanceof ApiError) throw error;
    return handleGitHubError(error, owner, repo);
  }
};

export const getCommits = async (
  owner: string,
  repo: string,
  token?: string,
  perPage = 20,
): Promise<Commit[]> => {
  try {
    const client = createGitHubClient(token);
    const { data } = await client.get(`/repos/${owner}/${repo}/commits`, {
      params: { per_page: perPage },
    });

    return data.map((c: Record<string, unknown>) => {
      const commit = c.commit as Record<string, unknown>;
      const author = commit.author as Record<string, string>;
      return {
        sha: (c.sha as string).substring(0, 7),
        message: (commit.message as string).split('\n')[0], // First line only
        author: {
          name: author?.name || 'Unknown',
          email: author?.email || '',
          date: author?.date || '',
        },
        url: c.url as string,
        htmlUrl: c.html_url as string,
      };
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    return handleGitHubError(error, owner, repo);
  }
};

export const getPullRequestStats = async (
  owner: string,
  repo: string,
  token?: string,
): Promise<PRStats> => {
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

    const openPRs = openRes.data as Record<string, unknown>[];
    const closedPRs = closedRes.data as Record<string, unknown>[];
    const mergedPRs = closedPRs.filter((pr) => pr.merged_at !== null);

    // Calculate average merge time
    let avgMergeHours: number | null = null;
    if (mergedPRs.length > 0) {
      const mergeTimes = mergedPRs.map((pr) => {
        const created = new Date(pr.created_at as string).getTime();
        const merged = new Date(pr.merged_at as string).getTime();
        return (merged - created) / (1000 * 60 * 60); // hours
      });
      avgMergeHours = Math.round(mergeTimes.reduce((a, b) => a + b, 0) / mergeTimes.length);
    }

    const recentPRs = [...openPRs, ...closedPRs]
      .sort((a, b) => new Date(b.created_at as string).getTime() - new Date(a.created_at as string).getTime())
      .slice(0, 10)
      .map((pr) => ({
        number: pr.number as number,
        title: pr.title as string,
        state: pr.state as string,
        author: ((pr.user as Record<string, unknown>)?.login as string) || 'Unknown',
        createdAt: pr.created_at as string,
        mergedAt: (pr.merged_at as string) || null,
      }));

    return {
      totalOpen: openPRs.length,
      totalClosed: closedPRs.length,
      totalMerged: mergedPRs.length,
      averageTimeToMergeHours: avgMergeHours,
      recentPRs,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    return handleGitHubError(error, owner, repo);
  }
};

export const getContributors = async (
  owner: string,
  repo: string,
  token?: string,
): Promise<Contributor[]> => {
  try {
    const client = createGitHubClient(token);
    const { data } = await client.get(`/repos/${owner}/${repo}/contributors`, {
      params: { per_page: 20 },
    });

    return (data as Record<string, unknown>[]).map((c) => ({
      login: c.login as string,
      avatarUrl: c.avatar_url as string,
      htmlUrl: c.html_url as string,
      contributions: c.contributions as number,
      type: c.type as string,
    }));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    return handleGitHubError(error, owner, repo);
  }
};
