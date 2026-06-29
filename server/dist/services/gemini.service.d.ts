interface IssueSummary {
    title: string;
    status: string;
    priority: string;
    assignedTo?: string;
}
export declare const generateSprintSummary: (issues: IssueSummary[], projectName: string, startDate: string, endDate: string) => Promise<string>;
export declare const explainBug: (issue: {
    title: string;
    description?: string;
    priority: string;
    labels?: string[];
}) => Promise<string>;
export declare const generateReleaseNotes: (issues: IssueSummary[], version: string) => Promise<string>;
export declare const generateTaskDescription: (title: string) => Promise<string>;
export declare const generateStandupReport: (issues: IssueSummary[], userName: string) => Promise<string>;
export {};
//# sourceMappingURL=gemini.service.d.ts.map