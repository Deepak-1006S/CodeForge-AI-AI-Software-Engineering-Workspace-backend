"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const ApiError_1 = require("../utils/ApiError");
/**
 * Middleware that checks express-validator results and returns a 422
 * response with field-level error details if validation fails.
 */
const validate = (req, _res, next) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (result.isEmpty()) {
        return next();
    }
    const errors = result.array().map((error) => {
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
    const error = new ApiError_1.ApiError(422, `Validation failed: ${errors.map((e) => e.message).join(', ')}`, true, errors);
    next(error);
};
exports.validate = validate;
