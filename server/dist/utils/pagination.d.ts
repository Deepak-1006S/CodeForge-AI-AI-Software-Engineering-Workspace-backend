import { Request } from 'express';
export interface PaginationResult {
    page: number;
    limit: number;
    skip: number;
}
export interface PaginationMeta extends Record<string, unknown> {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}
export declare const parsePagination: (req: Request, defaultLimit?: number, maxLimit?: number) => PaginationResult;
export declare const buildPaginationMeta: (total: number, page: number, limit: number) => PaginationMeta;
//# sourceMappingURL=pagination.d.ts.map