import mongoose, { Schema, Query } from 'mongoose';
import { IProject, ProjectStatus } from '../types/models';

const ProjectSchema = new Schema<IProject>(
  {
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
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization is required'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project owner is required'],
    },
    status: {
      type: String,
      enum: ['Planning', 'Active', 'Testing', 'Completed'] as ProjectStatus[],
      default: 'Planning',
    },
    team: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ─── Indexes ─────────────────────────────────────────────────────────────────

ProjectSchema.index({ organization: 1, deletedAt: 1 });
ProjectSchema.index({ owner: 1 });
ProjectSchema.index({ status: 1 });

// ─── Default Query Scope: Exclude Soft-Deleted ───────────────────────────────

function excludeDeleted(this: Query<unknown, IProject>): void {
  this.where({ deletedAt: null });
}

ProjectSchema.pre('find', excludeDeleted);
ProjectSchema.pre('findOne', excludeDeleted);
ProjectSchema.pre('findOneAndUpdate', excludeDeleted);
ProjectSchema.pre('countDocuments', excludeDeleted);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
