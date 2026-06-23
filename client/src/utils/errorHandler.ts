import axios from 'axios';
import type { ApiError } from '@/types';

/**
 * Extract user-friendly error message from Axios error response
 */
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError | undefined;
    
    // Check for structured API error response
    if (apiError?.message) {
      return apiError.message;
    }

    // Check for validation errors array
    if (apiError?.errors && Array.isArray(apiError.errors)) {
      return apiError.errors.map((err) => err.message).join(', ');
    }

    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your connection and try again.';
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }

    // Handle specific HTTP status codes
    switch (error.response?.status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'Authentication required. Please login again.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'Conflict. This resource already exists.';
      case 429:
        return 'Too many requests. Please slow down and try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  }

  // Handle non-Axios errors
  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Log error to console in development
 */
export const logError = (error: unknown, context?: string): void => {
  if (import.meta.env.DEV) {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);
  }
};

/**
 * Combined error handler with logging and message extraction
 */
export const processError = (error: unknown, context?: string): string => {
  logError(error, context);
  return handleApiError(error);
};
