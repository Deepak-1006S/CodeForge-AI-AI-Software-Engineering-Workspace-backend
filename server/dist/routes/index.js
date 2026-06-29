"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const organization_routes_1 = __importDefault(require("./organization.routes"));
const project_routes_1 = __importDefault(require("./project.routes"));
const issue_routes_1 = __importDefault(require("./issue.routes"));
const dashboard_routes_1 = __importDefault(require("./dashboard.routes"));
const github_routes_1 = __importDefault(require("./github.routes"));
const ai_routes_1 = __importDefault(require("./ai.routes"));
const notification_routes_1 = __importDefault(require("./notification.routes"));
const router = (0, express_1.Router)();
// Health check
router.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        message: 'CodeForge AI API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
    });
});
// Mount routers
router.use('/auth', auth_routes_1.default);
router.use('/users', user_routes_1.default);
router.use('/organizations', organization_routes_1.default);
router.use('/projects', project_routes_1.default);
router.use('/issues', issue_routes_1.default);
router.use('/dashboard', dashboard_routes_1.default);
router.use('/github', github_routes_1.default);
router.use('/ai', ai_routes_1.default);
router.use('/notifications', notification_routes_1.default);
exports.default = router;
