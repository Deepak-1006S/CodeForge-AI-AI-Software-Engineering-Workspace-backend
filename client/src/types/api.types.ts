export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: { field: string; message: string; value?: unknown }[];
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
