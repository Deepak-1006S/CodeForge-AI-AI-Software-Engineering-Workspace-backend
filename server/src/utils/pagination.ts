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

export const parsePagination = (
  req: Request,
  defaultLimit = 20,
  maxLimit = 100,
): PaginationResult => {
  const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
  const rawLimit = parseInt(String(req.query.limit || String(defaultLimit)), 10);
  const limit = Math.min(Math.max(1, rawLimit), maxLimit);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number,
): PaginationMeta => {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
