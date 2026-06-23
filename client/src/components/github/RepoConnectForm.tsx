import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { connectRepo } from '../../services/github.service';
import toast from 'react-hot-toast';

const schema = z.object({
  owner: z.string().min(1, 'Owner is required'),
  repo: z.string().min(1, 'Repository name is required'),
  githubToken: z.string().min(1, 'GitHub token is required'),
});

type FormData = z.infer<typeof schema>;

interface RepoConnectFormProps {
  onSuccess?: () => void;
}

export const RepoConnectForm: React.FC<RepoConnectFormProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await connectRepo(data);
      toast.success('Repository connected successfully!');
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to connect repository');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Connect GitHub Repository</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="owner" className="block text-sm font-medium text-slate-700">
              Repository Owner
            </label>
            <input
              id="owner"
              type="text"
              placeholder="e.g., codeforge"
              {...register('owner')}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            {errors.owner && <p className="mt-1 text-sm text-red-600">{errors.owner.message}</p>}
          </div>
          <div>
            <label htmlFor="repo" className="block text-sm font-medium text-slate-700">
              Repository Name
            </label>
            <input
              id="repo"
              type="text"
              placeholder="e.g., codeforge-ai"
              {...register('repo')}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            {errors.repo && <p className="mt-1 text-sm text-red-600">{errors.repo.message}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="githubToken" className="block text-sm font-medium text-slate-700">
            GitHub Personal Access Token
          </label>
          <input
            id="githubToken"
            type="password"
            placeholder="ghp_xxxxxxxxxxxx"
            {...register('githubToken')}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          {errors.githubToken && <p className="mt-1 text-sm text-red-600">{errors.githubToken.message}</p>}
          <p className="mt-2 text-xs text-slate-500">
            Create a token at <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">github.com/settings/tokens</a>
          </p>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Connecting...' : 'Connect Repository'}
        </button>
      </form>
    </div>
  );
};
