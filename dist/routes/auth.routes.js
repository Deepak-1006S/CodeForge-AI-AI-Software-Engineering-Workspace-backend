"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validate_middleware_1 = require("../middleware/validate.middleware");
const auth_validator_1 = require("../validators/auth.validator");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
// POST /api/auth/register
router.post('/register', auth_validator_1.registerValidator, validate_middleware_1.validate, (0, asyncHandler_1.asyncHandler)(auth_controller_1.register));
// POST /api/auth/login
router.post('/login', auth_validator_1.loginValidator, validate_middleware_1.validate, (0, asyncHandler_1.asyncHandler)(auth_controller_1.login));
// GET /api/auth/github/login
router.get('/github/login', (0, asyncHandler_1.asyncHandler)(auth_controller_1.githubLogin));
// GET /api/auth/github/callback
router.get('/github/callback', (0, asyncHandler_1.asyncHandler)(auth_controller_1.githubCallback));
// GET /api/auth/google/login
router.get('/google/login', (0, asyncHandler_1.asyncHandler)(auth_controller_1.googleLogin));
// GET /api/auth/google/callback
router.get('/google/callback', (0, asyncHandler_1.asyncHandler)(auth_controller_1.googleCallback));
// GET /api/auth/verify/:token
router.get('/verify/:token', (0, asyncHandler_1.asyncHandler)(auth_controller_1.verifyEmail));
// POST /api/auth/resend-verification
router.post('/resend-verification', (0, asyncHandler_1.asyncHandler)(auth_controller_1.resendVerificationEmail));
// GET /api/auth/me
router.get('/me', auth_middleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(auth_controller_1.getMe));
// PUT /api/auth/password
router.put('/password', auth_middleware_1.authenticate, auth_validator_1.updatePasswordValidator, validate_middleware_1.validate, (0, asyncHandler_1.asyncHandler)(auth_controller_1.updatePassword));
// POST /api/auth/forgot-password
router.post('/forgot-password', auth_validator_1.forgotPasswordValidator, validate_middleware_1.validate, (0, asyncHandler_1.asyncHandler)(auth_controller_1.forgotPassword));
// POST /api/auth/reset-password
router.post('/reset-password', auth_validator_1.resetPasswordValidator, validate_middleware_1.validate, (0, asyncHandler_1.asyncHandler)(auth_controller_1.resetPassword));
// POST /api/auth/refresh-token
router.post('/refresh-token', (0, asyncHandler_1.asyncHandler)(auth_controller_1.refreshAccessToken));
exports.default = router;
