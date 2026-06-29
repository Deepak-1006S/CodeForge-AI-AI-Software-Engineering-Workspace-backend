import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjectDetail } from '../../hooks/useProjects';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, isError, error } = useProjectDetail(id || '');

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center rounded-[2rem] bg-white p-10 shadow-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-slate-600">Loading project details…</p>
        </div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="rounded-[2rem] border border-red-100 bg-red-50 p-10 text-red-700 shadow-sm">
        <h2 className="text-xl font-semibold">Unable to load project</h2>
        <p className="mt-2 text-sm">{(error as Error)?.message || 'The project could not be found.'}</p>
        <Link to="/projects" className="mt-6 inline-flex rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700">
          Back to projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Project overview</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">{project.title}</h1>
            <p className="mt-4 max-w-2xl text-slate-600">{project.description || 'This project does not have a description yet.'}</p>
          </div>
          <div className="space-y-2 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            <div>
              <p className="text-slate-500">Status</p>
              <p className="mt-1 font-semibold text-slate-900">{project.status}</p>
            </div>
            <div>
              <p className="text-slate-500">Owner</p>
              <p className="mt-1 font-semibold text-slate-900">{project.owner?.name || 'Unassigned'}</p>
            </div>
            <div>
              <p className="text-slate-500">Team</p>
              <p className="mt-1 font-semibold text-slate-900">{project.team?.length ?? 0} members</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Team</h2>
          <p className="mt-3 text-sm text-slate-600">Project team members and collaborators.</p>
          <div className="mt-6 space-y-4">
            {project.team?.length ? (
              project.team.map((member) => (
                <div key={member._id} className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">{member.name?.slice(0, 2).toUpperCase()}</div>
                  <div>
                    <p className="font-medium text-slate-900">{member.name}</p>
                    <p className="text-sm text-slate-500">{member.email}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No team members assigned yet.</p>
            )}
          </div>
        </div>

        <div className="xl:col-span-2 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Recent activity</h2>
              <p className="mt-2 text-sm text-slate-500">Track the latest updates, issues, and milestones.</p>
            </div>
            <Link
              to="/issues"
              className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              View issues
            </Link>
          </div>

          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">Roadmap</p>
              <p className="mt-2">Break down your delivery plan into milestones and sprints.</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">GitHub integration</p>
              <p className="mt-2">Connect your repository to sync issues and pull requests automatically.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

