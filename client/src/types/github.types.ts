export interface GitHubRepository {
  id: string;
  name: string;
  owner: string;
  url: string;
  description?: string;
  stars: number;
  language?: string;
  topics: string[];
  isPrivate: boolean;
  lastSyncedAt?: Date;
}

export interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  authorEmail?: string;
  authorAvatar?: string;
  timestamp: Date;
  url: string;
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed' | 'merged';
  author: string;
  authorAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
  mergedAt?: Date;
  url: string;
  additions: number;
  deletions: number;
}

export interface GitHubPullRequestStats {
  open: number;
  closed: number;
  merged: number;
  total: number;
}

export interface GitHubContributor {
  login: string;
  avatar: string;
  name?: string;
  commitCount: number;
  url: string;
}

export interface ConnectRepoRequest {
  owner: string;
  repo: string;
  githubToken: string;
}

export interface GetRepoDetailsResponse {
  repository: GitHubRepository;
}

export interface GetCommitsResponse {
  commits: GitHubCommit[];
  total: number;
}

export interface GetPullRequestsResponse {
  pullRequests: GitHubPullRequest[];
  stats: GitHubPullRequestStats;
}

export interface GetContributorsResponse {
  contributors: GitHubContributor[];
}
