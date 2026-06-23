import mongoose, { Schema } from 'mongoose';
import { IOrganization, OrgMemberRole } from '../types/models';

const OrgMemberSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['Admin', 'Manager', 'Developer'] as OrgMemberRole[],
      default: 'Developer',
    },
  },
  { _id: false },
);

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: {
      type: String,
      required: [true, 'Organization name is required'],
      trim: true,
      minlength: [2, 'Organization name must be at least 2 characters'],
      maxlength: [100, 'Organization name cannot exceed 100 characters'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Organization owner is required'],
    },
    members: {
      type: [OrgMemberSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// ─── Indexes ─────────────────────────────────────────────────────────────────

OrganizationSchema.index({ name: 1, owner: 1 }, { unique: true });
OrganizationSchema.index({ 'members.user': 1 });
OrganizationSchema.index({ owner: 1 });

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);
