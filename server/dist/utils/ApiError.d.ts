export declare class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;
    errors?: unknown[];
    constructor(statusCode: number, message: string, isOperational?: boolean, errors?: unknown[]);
    static badRequest(message: string, errors?: unknown[]): ApiError;
    static unauthorized(message?: string): ApiError;
    static forbidden(message?: string): ApiError;
    static notFound(message?: string): ApiError;
    static conflict(message: string): ApiError;
    static unprocessable(message: string, errors?: unknown[]): ApiError;
    static tooManyRequests(message?: string): ApiError;
    static internal(message?: string): ApiError;
}
//# sourceMappingURL=ApiError.d.ts.map