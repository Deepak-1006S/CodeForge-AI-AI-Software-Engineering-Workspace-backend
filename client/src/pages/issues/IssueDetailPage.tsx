import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useIssueDetail } from '../../hooks/useIssues';

export const IssueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: issue, isLoading, isError, error } = useIssueDetail(id || '');

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center rounded-[2rem] bg-white p-10 shadow-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-slate-600">Loading issue details…</p>
        </div>
      </div>
    );
  }

  if (isError || !issue) {
    return (
      <div className="rounded-[2rem] border border-red-100 bg-red-50 p-10 text-red-700 shadow-sm">
        <h2 className="text-xl font-semibold">Unable to load issue</h2>
        <p className="mt-2 text-sm">{(error as Error)?.message || 'The issue could not be found.'}</p>
        <Link to="/issues" className="mt-6 inline-flex rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700">
          Back to issues
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-slate-400">Issue details</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">{issue.title}</h1>
            <p className="mt-4 text-slate-600">{issue.description || 'No description has been added to this issue yet.'}</p>
          </div>
          <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            <div>
              <p className="text-slate-500">Status</p>
              <p className="mt-1 font-semibold text-slate-900">{issue.status}</p>
            </div>
            <div>
              <p className="text-slate-500">Priority</p>
              <p className="mt-1 font-semibold text-slate-900">{issue.priority}</p>
            </div>
            <div>
              <p className="text-slate-500">Assignee</p>
              <p className="mt-1 font-semibold text-slate-900">
                {issue.assignedTo?.name || 'Unassigned'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Activity log</h2>
          <p className="mt-2 text-sm text-slate-500">Recent updates and comments will appear here.</p>
          <div className="mt-6 space-y-4 text-slate-600">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">No activity yet</p>
              <p className="mt-1 text-sm text-slate-500">This issue has not had any activity logged yet.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Quick actions</h2>
          <div className="mt-6 space-y-3 text-sm text-slate-600">
            <button className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-white hover:bg-slate-800">Change status</button>
            <button className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 hover:bg-slate-50">Assign owner</button>
            <button className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 hover:bg-slate-50">Add comment</button>
          </div>
        </div>
      </div>
    </div>
  );
};

