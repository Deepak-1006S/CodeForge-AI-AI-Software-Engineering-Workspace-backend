import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import * as authService from '../../services/auth.service';
import * as userService from '../../services/user.service';
import { User, Mail, Lock, Save } from 'lucide-react';
import Avatar from '../../components/ui/Avatar';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import toast from 'react-hot-toast';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, 'Password must be at least 8 characters'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    profileForm.reset({
      name: user?.name || '',
      email: user?.email || '',
    });
  }, [user, profileForm]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsUpdating(true);
    try {
      await userService.updateUserProfile({ name: data.name });
      await refreshUser();
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsUpdating(true);
    try {
      await authService.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password updated successfully');
      passwordForm.reset();
    } catch (error) {
      toast.error('Failed to update password');
    } finally {
      setIsUpdating(false);
    }
  };

  const tabs = [
    {
      id: 'profile',
      label: 'Profile Information',
      icon: <User className="h-4 w-4" />,
      content: (
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar src={user?.avatar} name={user?.name} size="2xl" />
            <div>
              <Button variant="outline" size="sm">
                Upload Photo
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>

          <Input
            label="Full Name"
            leftIcon={<User className="h-5 w-5" />}
            error={profileForm.formState.errors.name?.message}
            {...profileForm.register('name')}
          />

          <Input
            label="Email Address"
            type="email"
            leftIcon={<Mail className="h-5 w-5" />}
            error={profileForm.formState.errors.email?.message}
            {...profileForm.register('email')}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Role
            </label>
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400">
              {user?.role}
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            isLoading={isUpdating}
            leftIcon={<Save className="h-4 w-4" />}
          >
            Save Changes
          </Button>
        </form>
      ),
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Lock className="h-4 w-4" />,
      content: (
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
          <Input
            label="Current Password"
            type="password"
            leftIcon={<Lock className="h-5 w-5" />}
            error={passwordForm.formState.errors.currentPassword?.message}
            {...passwordForm.register('currentPassword')}
          />

          <Input
            label="New Password"
            type="password"
            leftIcon={<Lock className="h-5 w-5" />}
            error={passwordForm.formState.errors.newPassword?.message}
            {...passwordForm.register('newPassword')}
          />

          <Input
            label="Confirm New Password"
            type="password"
            leftIcon={<Lock className="h-5 w-5" />}
            error={passwordForm.formState.errors.confirmPassword?.message}
            {...passwordForm.register('confirmPassword')}
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={isUpdating}
            leftIcon={<Save className="h-4 w-4" />}
          >
            Update Password
          </Button>
        </form>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Profile Settings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
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
