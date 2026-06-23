import { Types, Document } from 'mongoose';

// ─── User ────────────────────────────────────────────────────────────────────

export type UserRole = 'Admin' | 'Manager' | 'Developer';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

// ─── Organization ────────────────────────────────────────────────────────────

export type OrgMemberRole = 'Admin' | 'Manager' | 'Developer';

export interface IOrgMember {
  user: Types.ObjectId;
  role: OrgMemberRole;
}

export interface IOrganization extends Document {
  _id: Types.ObjectId;
  name: string;
  owner: Types.ObjectId;
  members: IOrgMember[];
  createdAt: Date;
  updatedAt: Date;
}

// ─── Project ─────────────────────────────────────────────────────────────────

export type ProjectStatus = 'Planning' | 'Active' | 'Testing' | 'Completed';

export interface IProject extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  organization: Types.ObjectId;
  owner: Types.ObjectId;
  status: ProjectStatus;
  team: Types.ObjectId[];
  githubOwner?: string;
  githubRepo?: string;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Issue ───────────────────────────────────────────────────────────────────

export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type IssueStatus = 'Todo' | 'In Progress' | 'Review' | 'Done';

export interface IIssue extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  project: Types.ObjectId;
  assignedTo?: Types.ObjectId | null;
  priority: IssuePriority;
  status: IssueStatus;
  labels: string[];
  dueDate?: Date | null;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Issue Activity ──────────────────────────────────────────────────────────

export interface IIssueActivity extends Document {
  _id: Types.ObjectId;
  issue: Types.ObjectId;
  actor: Types.ObjectId;
  action: string;
  oldValue?: string;
  newValue?: string;
  createdAt: Date;
}

// ─── Notification ────────────────────────────────────────────────────────────

export type NotificationType =
  | 'issue_assigned'
  | 'issue_updated'
  | 'issue_commented'
  | 'project_updated'
  | 'invitation'
  | 'mention'
  | 'status_change'
  | 'general';

export interface INotification extends Document {
  _id: Types.ObjectId;
  recipient: Types.ObjectId;
  sender?: Types.ObjectId;
  type: NotificationType;
  message: string;
  read: boolean;
  link?: string;
  createdAt: Date;
}

// ─── Invitation ──────────────────────────────────────────────────────────────

export type InvitationStatus = 'pending' | 'accepted' | 'expired';

export interface IInvitation extends Document {
  _id: Types.ObjectId;
  organization: Types.ObjectId;
  email: string;
  role: OrgMemberRole;
  token: string;
  expiresAt: Date;
  status: InvitationStatus;
  createdAt: Date;
}
