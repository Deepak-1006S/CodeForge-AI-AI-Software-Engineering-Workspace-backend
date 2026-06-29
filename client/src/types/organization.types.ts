import { User, UserRole } from './auth.types';

export interface OrgMember {
  user: User;
  role: UserRole;
}

export interface Organization {
  _id: string;
  name: string;
  owner: User;
  members: OrgMember[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrgPayload {
  name: string;
}

export interface UpdateOrgPayload {
  name?: string;
}

export interface InviteMemberPayload {
  email: string;
  role?: UserRole;
}

export interface UpdateMemberRolePayload {
  role: UserRole;
}
