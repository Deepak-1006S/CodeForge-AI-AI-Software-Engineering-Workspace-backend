import React, { useState } from 'react';
import { Users, Settings, Mail, UserPlus } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import { MemberList } from '../../components/organization/MemberList';
import { InviteMemberModal } from '../../components/organization/InviteMemberModal';

export const OrganizationPage: React.FC = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Mock data
  const organization = {
    name: 'Acme Corporation',
    slug: 'acme-corp',
    description: 'Building the future of software development',
    website: 'https://acme.com',
    memberCount: 12,
  };

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Settings className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Organization Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {organization.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {organization.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    @{organization.slug}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                  <p className="mt-1 text-gray-900 dark:text-gray-100">
                    {organization.description}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Website</p>
                  <a
                    href={organization.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {organization.website}
                  </a>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Members</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    {organization.memberCount}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <Badge variant="success" className="mt-1">
                    Active
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'members',
      label: 'Members',
      icon: <Users className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Team Members
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your organization's team members
              </p>
            </div>
            <Button
              variant="primary"
              leftIcon={<UserPlus className="h-4 w-4" />}
              onClick={() => setShowInviteModal(true)}
            >
              Invite Member
            </Button>
          </div>

          <MemberList />
        </div>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Organization Settings
            </h3>
            <div className="space-y-4">
              <Input label="Organization Name" defaultValue={organization.name} />
              <Input label="Organization Slug" defaultValue={organization.slug} disabled />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  defaultValue={organization.description}
                />
              </div>
              <Input label="Website" type="url" defaultValue={organization.website} />

              <div className="pt-4">
                <Button variant="primary">Save Changes</Button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
              Danger Zone
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Irreversible actions for this organization
            </p>
            <Button variant="danger">Delete Organization</Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Organization</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your organization settings, members, and teams
        </p>
      </div>

      <Card>
        <CardBody>
          <Tabs tabs={tabs} />
        </CardBody>
      </Card>

      <InviteMemberModal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} />
    </div>
  );
};
