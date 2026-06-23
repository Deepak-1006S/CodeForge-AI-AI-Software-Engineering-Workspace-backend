import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, Globe } from 'lucide-react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card, { CardBody, CardHeader } from '../../components/ui/Card';
import toast from 'react-hot-toast';

const organizationSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  slug: z
    .string()
    .min(3, 'Slug must be at least 3 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

export const CreateOrganizationPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
  });

  const onSubmit = async (data: OrganizationFormData) => {
    try {
      // Call create organization API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Organization created successfully');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create organization');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Create Organization
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Set up a new organization to collaborate with your team
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Organization Details
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Basic information about your organization
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Organization Name"
              placeholder="Acme Corporation"
              leftIcon={<Building2 className="h-5 w-5" />}
              error={errors.name?.message}
              helperText="The name of your organization or company"
              {...register('name')}
            />

            <Input
              label="Organization Slug"
              placeholder="acme-corp"
              leftIcon={<Users className="h-5 w-5" />}
              error={errors.slug?.message}
              helperText="Unique identifier for your organization (lowercase, alphanumeric, hyphens only)"
              {...register('slug')}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Description
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="Brief description of your organization..."
                {...register('description')}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>

            <Input
              label="Website"
              type="url"
              placeholder="https://acme.com"
              leftIcon={<Globe className="h-5 w-5" />}
              error={errors.website?.message}
              helperText="Your organization's website (optional)"
              {...register('website')}
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                Create Organization
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
