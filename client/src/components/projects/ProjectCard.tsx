import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../../types/project.types';

const statusStyles = {
  Planning: 'bg-slate-100 text-slate-700',
  Active: 'bg-blue-100 text-blue-700',
  Testing: 'bg-amber-100 text-amber-700',
  Completed: 'bg-emerald-100 text-emerald-700',
};

const progressMap: Record<string, number> = {
  Planning: 20,
  Active: 55,
  Testing: 80,
  Completed: 100,
};

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const progress = progressMap[project.status] || 0;
  const organizationName = typeof project.organization === 'string' ? project.organization : project.organization.name;

  return (
    <Link to={`/projects/${project._id}`} className="group block rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-400">{organizationName}</p>
          <h3 className="mt-3 text-xl font-semibold text-slate-900">{project.title}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[project.status]}`}>
          {project.status}
        </span>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{project.description || 'No description provided.'}</p>

      <div className="mt-6 flex items-center justify-between gap-4 text-sm text-slate-500">
        <div>
          <p className="font-semibold text-slate-900">Team</p>
          <p>{project.team?.length ?? 0} members</p>
        </div>
        <div>
          <p className="font-semibold text-slate-900">Owner</p>
          <p>{project.owner?.name ?? 'Unassigned'}</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.18em] text-slate-400">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div style={{ width: `${progress}%` }} className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
        </div>
      </div>
    </Link>
  );
};

