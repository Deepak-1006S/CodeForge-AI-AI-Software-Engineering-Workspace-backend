import React from 'react';
import { Link } from 'react-router-dom';
import { Issue } from '../../types/issue.types';

const priorityStyles = {
  Low: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  High: 'bg-orange-100 text-orange-700',
  Critical: 'bg-red-100 text-red-700',
};

interface IssueCardProps {
  issue: Issue;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  return (
    <Link
      to={`/issues/${issue._id}`}
      className="block rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">{issue.title}</p>
          <p className="mt-2 text-sm text-slate-500">{typeof issue.project === 'string' ? issue.project : issue.project?.title}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[issue.priority]}`}>
          {issue.priority}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-500">
        <span className="rounded-2xl bg-white px-3 py-1 shadow-sm">{issue.status}</span>
        <span>{issue.assignedTo ? `Assignee: ${issue.assignedTo}` : 'Unassigned'}</span>
      </div>
    </Link>
  );
};

