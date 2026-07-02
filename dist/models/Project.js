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
exports.Project = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ProjectSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Project title is required'],
        trim: true,
        minlength: [2, 'Title must be at least 2 characters'],
        maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [2000, 'Description cannot exceed 2000 characters'],
        default: '',
    },
    organization: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Organization',
        required: [true, 'Organization is required'],
    },
    owner: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Project owner is required'],
    },
    status: {
        type: String,
        enum: ['Planning', 'Active', 'Testing', 'Completed'],
        default: 'Planning',
    },
    team: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    favorite: {
        type: Boolean,
        default: false,
    },
    pinned: {
        type: Boolean,
        default: false,
    },
    archivedAt: {
        type: Date,
        default: null,
    },
    githubOwner: {
        type: String,
        default: null,
    },
    githubRepo: {
        type: String,
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
ProjectSchema.index({ organization: 1, deletedAt: 1 });
ProjectSchema.index({ owner: 1 });
ProjectSchema.index({ status: 1 });
// ─── Default Query Scope: Exclude Soft-Deleted ───────────────────────────────
function excludeDeleted() {
    this.where({ deletedAt: null });
}
ProjectSchema.pre('find', excludeDeleted);
ProjectSchema.pre('findOne', excludeDeleted);
ProjectSchema.pre('findOneAndUpdate', excludeDeleted);
ProjectSchema.pre('countDocuments', excludeDeleted);
exports.Project = mongoose_1.default.model('Project', ProjectSchema);
