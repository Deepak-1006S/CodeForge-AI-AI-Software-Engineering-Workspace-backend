"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../utils/asyncHandler");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// All user routes require authentication
router.use(auth_middleware_1.authenticate);
// GET /api/users — Admin only
router.get('/', (0, rbac_middleware_1.authorize)('Admin'), (0, asyncHandler_1.asyncHandler)(user_controller_1.getUsers));
// GET /api/users/me
router.get('/me', (0, asyncHandler_1.asyncHandler)(user_controller_1.getProfile));
// PATCH /api/users/me
router.patch('/me', (0, asyncHandler_1.asyncHandler)(user_controller_1.updateProfile));
// POST /api/users/me/avatar
router.post('/me/avatar', upload_middleware_1.uploadAvatar, (0, asyncHandler_1.asyncHandler)(user_controller_1.uploadAvatar));
exports.default = router;
