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
export declare const getRepoDetails: (owner: string, repo: string, token?: string) => Promise<RepoDetails>;
export declare const getCommits: (owner: string, repo: string, token?: string, perPage?: number) => Promise<Commit[]>;
export declare const getPullRequestStats: (owner: string, repo: string, token?: string) => Promise<PRStats>;
export declare const getContributors: (owner: string, repo: string, token?: string) => Promise<Contributor[]>;
//# sourceMappingURL=github.service.d.ts.map