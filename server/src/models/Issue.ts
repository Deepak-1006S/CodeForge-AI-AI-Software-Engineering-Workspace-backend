import mongoose, { Schema, Query } from 'mongoose';
import { IIssue, IssuePriority, IssueStatus } from '../types/models';

const IssueSchema = new Schema<IIssue>(
  {
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
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'] as IssuePriority[],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Todo', 'In Progress', 'Review', 'Done'] as IssueStatus[],
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ─── Indexes ─────────────────────────────────────────────────────────────────

IssueSchema.index({ project: 1, deletedAt: 1 });
IssueSchema.index({ assignedTo: 1 });
IssueSchema.index({ status: 1 });
IssueSchema.index({ priority: 1 });
// Full-text search index
IssueSchema.index({ title: 'text', description: 'text' });

// ─── Default Query Scope: Exclude Soft-Deleted ───────────────────────────────

function excludeDeleted(this: Query<unknown, IIssue>): void {
  this.where({ deletedAt: null });
}

IssueSchema.pre('find', excludeDeleted);
IssueSchema.pre('findOne', excludeDeleted);
IssueSchema.pre('findOneAndUpdate', excludeDeleted);
IssueSchema.pre('countDocuments', excludeDeleted);

export const Issue = mongoose.model<IIssue>('Issue', IssueSchema);
