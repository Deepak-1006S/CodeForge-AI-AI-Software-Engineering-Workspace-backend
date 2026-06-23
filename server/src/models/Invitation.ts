import mongoose, { Schema } from 'mongoose';
import { IInvitation, OrgMemberRole, InvitationStatus } from '../types/models';

const InvitationSchema = new Schema<IInvitation>(
  {
    organization: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'Organization is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    role: {
      type: String,
      enum: ['Admin', 'Manager', 'Developer'] as OrgMemberRole[],
      default: 'Developer',
    },
    token: {
      type: String,
      required: [true, 'Invitation token is required'],
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'expired'] as InvitationStatus[],
      default: 'pending',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
  },
);

// ─── Indexes ─────────────────────────────────────────────────────────────────

InvitationSchema.index({ email: 1, organization: 1 });
InvitationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL auto-delete

export const Invitation = mongoose.model<IInvitation>('Invitation', InvitationSchema);
