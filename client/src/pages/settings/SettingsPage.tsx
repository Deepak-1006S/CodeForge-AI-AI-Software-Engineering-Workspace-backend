import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Bell, Shield, Key, Palette, Save } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card, { CardBody } from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import Select from '../../components/ui/Select';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isUpdating, setIsUpdating] = useState(false);

  const notificationForm = useForm({
    defaultValues: {
      emailNotifications: true,
      pushNotifications: true,
      issueUpdates: true,
      projectUpdates: true,
      mentions: true,
    },
  });

  const apiKeyForm = useForm({
    defaultValues: {
      keyName: '',
    },
  });

  const handleNotificationSubmit = async (data: any) => {
    setIsUpdating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Notification preferences updated');
    } catch (error) {
      toast.error('Failed to update preferences');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleGenerateApiKey = async (data: any) => {
    setIsUpdating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('API key generated successfully');
      apiKeyForm.reset();
    } catch (error) {
      toast.error('Failed to generate API key');
    } finally {
      setIsUpdating(false);
    }
  };

  const tabs = [
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="h-4 w-4" />,
      content: (
        <form onSubmit={notificationForm.handleSubmit(handleNotificationSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive notifications via email
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                {...notificationForm.register('emailNotifications')}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Push Notifications</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive push notifications in browser
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                {...notificationForm.register('pushNotifications')}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Issue Updates</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified when issues are updated
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                {...notificationForm.register('issueUpdates')}
              />
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Project Updates</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified about project changes
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                {...notificationForm.register('projectUpdates')}
              />
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Mentions</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified when someone mentions you
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                {...notificationForm.register('mentions')}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isUpdating}
            leftIcon={<Save className="h-4 w-4" />}
          >
            Save Preferences
          </Button>
        </form>
      ),
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Shield className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Add an extra layer of security to your account
            </p>
            <Button variant="outline">Enable 2FA</Button>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Active Sessions
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Manage your active sessions across devices
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      Current Device
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Last active: Just now
                    </p>
                  </div>
                  <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'api',
      label: 'API Keys',
      icon: <Key className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Generate API Key
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Create API keys to integrate with external services
            </p>
            <form onSubmit={apiKeyForm.handleSubmit(handleGenerateApiKey)} className="flex gap-3">
              <Input
                placeholder="Key name (e.g., Production API)"
                className="flex-1"
                {...apiKeyForm.register('keyName')}
              />
              <Button type="submit" isLoading={isUpdating}>
                Generate Key
              </Button>
            </form>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Active API Keys
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              No API keys generated yet.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'appearance',
      label: 'Appearance',
      icon: <Palette className="h-4 w-4" />,
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Theme Preference
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Choose your preferred color scheme
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <button
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'light'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="h-16 bg-white rounded mb-2 border border-gray-200"></div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Light</p>
              </button>
              <button
                onClick={() => theme === 'light' && toggleTheme()}
                className={`p-4 rounded-lg border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="h-16 bg-gray-800 rounded mb-2 border border-gray-600"></div>
                <p className="font-medium text-gray-900 dark:text-gray-100">Dark</p>
              </button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your application preferences and security settings
        </p>
      </div>

      <Card>
        <CardBody>
          <Tabs tabs={tabs} />
        </CardBody>
      </Card>
    </div>
  );
};
