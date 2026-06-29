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
exports.IssueActivity = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const IssueActivitySchema = new mongoose_1.Schema({
    issue: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Issue',
        required: [true, 'Issue reference is required'],
    },
    actor: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Actor is required'],
    },
    action: {
        type: String,
        required: [true, 'Action is required'],
        trim: true,
        maxlength: [200, 'Action cannot exceed 200 characters'],
    },
    oldValue: {
        type: String,
        default: null,
    },
    newValue: {
        type: String,
        default: null,
    },
}, {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
});
// ─── Indexes ─────────────────────────────────────────────────────────────────
IssueActivitySchema.index({ issue: 1, createdAt: -1 });
IssueActivitySchema.index({ actor: 1 });
exports.IssueActivity = mongoose_1.default.model('IssueActivity', IssueActivitySchema);
