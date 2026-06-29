"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkload = exports.getTeamActivity = exports.getIssueResolution = exports.getProjectMetrics = exports.getOverview = void 0;
const ApiError_1 = require("../utils/ApiError");
const ApiResponse_1 = require("../utils/ApiResponse");
const analyticsService = __importStar(require("../services/analytics.service"));
const getOverview = async (req, res) => {
    const { orgId } = req.query;
    if (!orgId) {
        throw new ApiError_1.ApiError(400, 'Organization ID is required.');
    }
    const stats = await analyticsService.getOverviewStats(orgId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { stats }, 'Dashboard overview retrieved'));
};
exports.getOverview = getOverview;
const getProjectMetrics = async (req, res) => {
    const { orgId } = req.query;
    if (!orgId) {
        throw new ApiError_1.ApiError(400, 'Organization ID is required.');
    }
    const projectProgress = await analyticsService.getProjectProgress(orgId);
    const productivityScore = await analyticsService.getProductivityScore(orgId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { projectProgress, productivityScore }, 'Project metrics retrieved'));
};
exports.getProjectMetrics = getProjectMetrics;
const getIssueResolution = async (req, res) => {
    const { orgId, weeks } = req.query;
    if (!orgId) {
        throw new ApiError_1.ApiError(400, 'Organization ID is required.');
    }
    const weeksNum = weeks ? parseInt(weeks, 10) : 8;
    const timeSeries = await analyticsService.getIssueResolutionTimeSeries(orgId, weeksNum);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { timeSeries }, 'Issue resolution time series retrieved'));
};
exports.getIssueResolution = getIssueResolution;
const getTeamActivity = async (req, res) => {
    const { orgId, limit } = req.query;
    if (!orgId) {
        throw new ApiError_1.ApiError(400, 'Organization ID is required.');
    }
    const limitNum = limit ? Math.min(parseInt(limit, 10), 50) : 20;
    const activities = await analyticsService.getTeamActivityFeed(orgId, limitNum);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { activities }, 'Team activity retrieved'));
};
exports.getTeamActivity = getTeamActivity;
const getWorkload = async (req, res) => {
    const { orgId } = req.query;
    if (!orgId) {
        throw new ApiError_1.ApiError(400, 'Organization ID is required.');
    }
    const workload = await analyticsService.getWorkloadDistribution(orgId);
    res.status(200).json(new ApiResponse_1.ApiResponse(200, { workload }, 'Workload distribution retrieved'));
};
exports.getWorkload = getWorkload;
