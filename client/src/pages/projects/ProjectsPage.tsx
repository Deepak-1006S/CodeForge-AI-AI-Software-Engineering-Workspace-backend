import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { ProjectCard } from '../../components/projects/ProjectCard';

const statusOptions = ['All', 'Planning', 'Active', 'Testing', 'Completed'];

export const ProjectsPage: React.FC = () => {
  const [status, setStatus] = useState('All');
  const { data: projects, isLoading, isError, error } = useProjects(undefined, 1, 20);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (status === 'All') return projects;
    return projects.filter((project) => project.status === status);
  }, [projects, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500">Manage your active initiatives, teams, and delivery milestones.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <Link
            to="/projects/new"
            className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Create Project
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-56 animate-pulse rounded-3xl bg-slate-200" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
          <h2 className="text-lg font-semibold">Unable to load projects</h2>
          <p className="mt-2 text-sm">{(error as Error)?.message || 'There was an error fetching your projects.'}</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-900">No projects found</p>
          <p className="mt-2 text-sm text-slate-500">Create a new project to get started with planning and tracking.</p>
          <Link
            to="/projects/new"
            className="mt-6 inline-flex rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Start a project
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

