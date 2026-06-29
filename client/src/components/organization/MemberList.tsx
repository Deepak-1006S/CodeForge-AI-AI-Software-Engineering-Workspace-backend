import React from 'react';
import { MoreVertical, Mail, Shield } from 'lucide-react';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Dropdown, { DropdownItem } from '../ui/Dropdown';
import type { User } from '@/types/auth.types';

export interface MemberListProps {
  members?: User[];
  onRemoveMember?: (memberId: string) => void;
  onChangeRole?: (memberId: string, newRole: string) => void;
}

export const MemberList: React.FC<MemberListProps> = ({
  members = [],
  onRemoveMember,
  onChangeRole,
}) => {
  // Mock data if no members provided
  const mockMembers: User[] = members.length
    ? members
    : [
        {
          _id: '1',
          name: 'John Doe',
          email: 'john@acme.com',
          role: 'Admin',
          avatar: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: '2',
          name: 'Jane Smith',
          email: 'jane@acme.com',
          role: 'Manager',
          avatar: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: '3',
          name: 'Bob Johnson',
          email: 'bob@acme.com',
          role: 'Developer',
          avatar: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'danger';
      case 'Manager':
        return 'primary';
      case 'Developer':
        return 'success';
      default:
        return 'default';
    }
  };

  const getMemberActions = (member: User): DropdownItem[] => [
    {
      label: 'Change to Admin',
      icon: <Shield className="h-4 w-4" />,
      onClick: () => onChangeRole?.(member._id, 'Admin'),
      disabled: member.role === 'Admin',
    },
    {
      label: 'Change to Manager',
      icon: <Shield className="h-4 w-4" />,
      onClick: () => onChangeRole?.(member._id, 'Manager'),
      disabled: member.role === 'Manager',
    },
    {
      label: 'Change to Developer',
      icon: <Shield className="h-4 w-4" />,
      onClick: () => onChangeRole?.(member._id, 'Developer'),
      disabled: member.role === 'Developer',
    },
    {
      separator: true,
      label: '',
    },
    {
      label: 'Send Email',
      icon: <Mail className="h-4 w-4" />,
      onClick: () => window.open(`mailto:${member.email}`),
    },
    {
      separator: true,
      label: '',
    },
    {
      label: 'Remove Member',
      onClick: () => onRemoveMember?.(member._id),
      danger: true,
    },
  ];

  return (
    <div className="space-y-3">
      {mockMembers.map((member) => (
        <div
          key={member._id}
          className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-sm transition-shadow"
        >
          <div className="flex items-center gap-4">
            <Avatar src={member.avatar} name={member.name} size="md" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">{member.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{member.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={getRoleBadgeVariant(member.role) as any}>{member.role}</Badge>
            <Dropdown
              trigger={
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              }
              items={getMemberActions(member)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
