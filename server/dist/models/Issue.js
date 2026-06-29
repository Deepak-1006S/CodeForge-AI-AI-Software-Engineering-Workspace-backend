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
exports.Issue = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const IssueSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Issue title is required'],
        trim: true,
        minlength: [2, 'Title must be at least 2 characters'],
        maxlength: [500, 'Title cannot exceed 500 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [10000, 'Description cannot exceed 10000 characters'],
        default: '',
    },
    project: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Project is required'],
    },
    assignedTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium',
    },
    status: {
        type: String,
        enum: ['Todo', 'In Progress', 'Review', 'Done'],
        default: 'Todo',
    },
    labels: {
        type: [String],
        default: [],
    },
    dueDate: {
        type: Date,
        default: null,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
    versionKey: false,
});
// ─── Indexes ─────────────────────────────────────────────────────────────────
IssueSchema.index({ project: 1, deletedAt: 1 });
IssueSchema.index({ assignedTo: 1 });
IssueSchema.index({ status: 1 });
IssueSchema.index({ priority: 1 });
// Full-text search index
IssueSchema.index({ title: 'text', description: 'text' });
// ─── Default Query Scope: Exclude Soft-Deleted ───────────────────────────────
function excludeDeleted() {
    this.where({ deletedAt: null });
}
IssueSchema.pre('find', excludeDeleted);
IssueSchema.pre('findOne', excludeDeleted);
IssueSchema.pre('findOneAndUpdate', excludeDeleted);
IssueSchema.pre('countDocuments', excludeDeleted);
exports.Issue = mongoose_1.default.model('Issue', IssueSchema);
