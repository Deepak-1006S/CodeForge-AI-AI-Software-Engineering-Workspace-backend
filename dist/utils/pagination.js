"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPaginationMeta = exports.parsePagination = void 0;
const parsePagination = (req, defaultLimit = 20, maxLimit = 100) => {
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
    const rawLimit = parseInt(String(req.query.limit || String(defaultLimit)), 10);
    const limit = Math.min(Math.max(1, rawLimit), maxLimit);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};
exports.parsePagination = parsePagination;
const buildPaginationMeta = (total, page, limit) => {
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
exports.buildPaginationMeta = buildPaginationMeta;
