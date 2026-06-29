import { Types } from 'mongoose';
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
export declare const getOverviewStats: (orgId: string) => Promise<OverviewStats>;
export declare const getProjectProgress: (orgId: string) => Promise<ProjectProgress[]>;
export declare const getIssueResolutionTimeSeries: (orgId: string, weeks?: number) => Promise<TimeSeriesPoint[]>;
export declare const getProductivityScore: (orgId: string) => Promise<number>;
export declare const getWorkloadDistribution: (orgId: string) => Promise<WorkloadItem[]>;
export declare const getTeamActivityFeed: (orgId: string, limit?: number) => Promise<(import("mongoose").FlattenMaps<import("../types/models").IIssueActivity> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
})[]>;
//# sourceMappingURL=analytics.service.d.ts.map