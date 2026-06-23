import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationError } from 'express-validator';
import { ApiError } from '../utils/ApiError';

interface FieldError {
  field: string;
  message: string;
  value?: unknown;
}

/**
 * Middleware that checks express-validator results and returns a 422
 * response with field-level error details if validation fails.
 */
export const validate = (req: Request, _res: Response, next: NextFunction): void => {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const errors: FieldError[] = result.array().map((error: ValidationError) => {
    if (error.type === 'field') {
      return {
        field: error.path,
        message: error.msg,
        value: error.value,
      };
    }
    return {
      field: 'unknown',
      message: error.msg,
    };
  });

  const error = new ApiError(
    422,
    `Validation failed: ${errors.map((e) => e.message).join(', ')}`,
    true,
    errors,
  );

  next(error);
};
