import mongoose, { Schema } from 'mongoose';
import { INotification, NotificationType } from '../types/models';

const NotificationSchema = new Schema<INotification>(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient is required'],
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    type: {
      type: String,
      enum: [
        'issue_assigned',
        'issue_updated',
        'issue_commented',
        'project_updated',
        'invitation',
        'mention',
        'status_change',
        'general',
      ] as NotificationType[],
      required: [true, 'Notification type is required'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
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

NotificationSchema.index({ recipient: 1, createdAt: -1 });
NotificationSchema.index({ recipient: 1, read: 1 });

// TTL index: auto-delete notifications older than 90 days
NotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
