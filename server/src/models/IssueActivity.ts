import mongoose, { Schema } from 'mongoose';
import { IIssueActivity } from '../types/models';

const IssueActivitySchema = new Schema<IIssueActivity>(
  {
    issue: {
      type: Schema.Types.ObjectId,
      ref: 'Issue',
      required: [true, 'Issue reference is required'],
    },
    actor: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

// ─── Indexes ─────────────────────────────────────────────────────────────────

IssueActivitySchema.index({ issue: 1, createdAt: -1 });
IssueActivitySchema.index({ actor: 1 });

export const IssueActivity = mongoose.model<IIssueActivity>('IssueActivity', IssueActivitySchema);
