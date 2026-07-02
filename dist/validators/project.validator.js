"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTeamMemberValidator = exports.toggleProjectArchiveValidator = exports.toggleProjectPinValidator = exports.toggleProjectFavoriteValidator = exports.updateProjectValidator = exports.createProjectValidator = void 0;
const express_validator_1 = require("express-validator");

exports.createProjectValidator = [
    (0, express_validator_1.body)("title")
        .trim()
        .notEmpty().withMessage("Project title is required")
        .isLength({ min: 2 }).withMessage("Title must be at least 2 characters")
        .isLength({ max: 200 }).withMessage("Title cannot exceed 200 characters"),
    (0, express_validator_1.body)("description")
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage("Description cannot exceed 2000 characters"),
    (0, express_validator_1.body)("organization")
        .notEmpty().withMessage("Organization ID is required")
        .isMongoId().withMessage("Invalid organization ID format"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["Planning", "Active", "Testing", "Completed"])
        .withMessage("Status must be one of: Planning, Active, Testing, Completed"),
];

exports.updateProjectValidator = [
    (0, express_validator_1.param)("id")
        .isMongoId().withMessage("Invalid project ID format"),
    (0, express_validator_1.body)("title")
        .optional()
        .trim()
        .isLength({ min: 2 }).withMessage("Title must be at least 2 characters")
        .isLength({ max: 200 }).withMessage("Title cannot exceed 200 characters"),
    (0, express_validator_1.body)("description")
        .optional()
        .trim()
        .isLength({ max: 2000 }).withMessage("Description cannot exceed 2000 characters"),
    (0, express_validator_1.body)("status")
        .optional()
        .isIn(["Planning", "Active", "Testing", "Completed"])
        .withMessage("Status must be one of: Planning, Active, Testing, Completed"),
];

exports.toggleProjectFavoriteValidator = [
    (0, express_validator_1.param)("id")
        .isMongoId().withMessage("Invalid project ID format"),
    (0, express_validator_1.body)("favorite")
        .exists().withMessage("Favorite flag is required")
        .isBoolean().withMessage("Favorite must be a boolean"),
];

exports.toggleProjectPinValidator = [
    (0, express_validator_1.param)("id")
        .isMongoId().withMessage("Invalid project ID format"),
    (0, express_validator_1.body)("pinned")
        .exists().withMessage("Pinned flag is required")
        .isBoolean().withMessage("Pinned must be a boolean"),
];

exports.toggleProjectArchiveValidator = [
    (0, express_validator_1.param)("id")
        .isMongoId().withMessage("Invalid project ID format"),
    (0, express_validator_1.body)("archived")
        .exists().withMessage("Archive flag is required")
        .isBoolean().withMessage("Archived must be a boolean"),
];

exports.addTeamMemberValidator = [
    (0, express_validator_1.param)("id")
        .isMongoId().withMessage("Invalid project ID format"),
    (0, express_validator_1.body)("userId")
        .notEmpty().withMessage("User ID is required")
        .isMongoId().withMessage("Invalid user ID format"),
];
