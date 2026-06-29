import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCreateProject } from '../../hooks/useProjects';

interface FormValues {
  title: string;
  description: string;
  organization: string;
  status: 'Planning' | 'Active' | 'Testing' | 'Completed';
}

export const CreateProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const createProjectMutation = useCreateProject();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      organization: 'Acme Software',
      status: 'Planning',
    },
  });

  const onSubmit = async (data: FormValues) => {
    await createProjectMutation.mutateAsync(data);
    navigate('/projects');
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-slate-900">Create a new project</h1>
        <p className="mt-2 text-sm text-slate-500">Capture the initial project scope, team, and delivery status.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium text-slate-700">Project title</label>
          <input
            {...register('title', { required: 'Project title is required' })}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Organization</label>
            <select
              {...register('organization')}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option>Acme Software</option>
              <option>Skyline Labs</option>
              <option>Nova Platforms</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Project status</label>
            <select
              {...register('status')}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="Planning">Planning</option>
              <option value="Active">Active</option>
              <option value="Testing">Testing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={createProjectMutation.status === 'pending'}
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {createProjectMutation.status === 'pending' ? 'Creating project...' : 'Create Project'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

