export declare class ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    meta?: Record<string, unknown>;
    constructor(statusCode: number, data: T, message?: string, meta?: Record<string, unknown>);
}
//# sourceMappingURL=ApiResponse.d.ts.map