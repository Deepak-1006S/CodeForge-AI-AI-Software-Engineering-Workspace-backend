import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, UserPlus } from 'lucide-react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const inviteSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['Admin', 'Manager', 'Developer']),
});

type InviteFormData = z.infer<typeof inviteSchema>;

export interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite?: (data: InviteFormData) => Promise<void>;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  onInvite,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      role: 'Developer',
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: InviteFormData) => {
    try {
      if (onInvite) {
        await onInvite(data);
      } else {
        // Mock invitation
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      toast.success(`Invitation sent to ${data.email}`);
      reset();
      onClose();
    } catch (error) {
      toast.error('Failed to send invitation');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Invite Team Member"
      description="Send an invitation to join your organization"
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          placeholder="colleague@company.com"
          leftIcon={<Mail className="h-5 w-5" />}
          error={errors.email?.message}
          helperText="We'll send an invitation link to this email"
          {...register('email')}
        />

        <Select
          label="Role"
          options={[
            { value: 'Developer', label: 'Developer - Can create and manage issues' },
            { value: 'Manager', label: 'Manager - Can manage projects and teams' },
            { value: 'Admin', label: 'Admin - Full access to organization' },
          ]}
          value={selectedRole}
          onChange={(value) => setValue('role', value as any)}
          error={errors.role?.message}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<UserPlus className="h-4 w-4" />}
            className="flex-1"
          >
            Send Invitation
          </Button>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};
