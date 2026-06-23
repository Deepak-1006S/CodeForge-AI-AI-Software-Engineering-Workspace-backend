import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIssues } from '../../hooks/useIssues';
import { IssueCard } from '../../components/issues/IssueCard';
import { Issue, IssueStatus } from '../../types/issue.types';

const statuses: IssueStatus[] = ['Todo', 'In Progress', 'Review', 'Done'];

export const IssuesPage: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'board' | 'list'>('board');
  const [statusFilter, setStatusFilter] = useState<'All' | IssueStatus>('All');
  const { data: issues, isLoading, isError, error } = useIssues(undefined, statusFilter === 'All' ? undefined : statusFilter, 1, 50);

  const groupedIssues = useMemo(() => {
    const board: Record<IssueStatus, any[]> = {
      Todo: [],
      'In Progress': [],
      Review: [],
      Done: [],
    };

    (issues || []).forEach((issue: any) => {
      if (board[issue.status as IssueStatus]) {
        board[issue.status as IssueStatus].push(issue);
      }
    });

    return board;
  }, [issues]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Issues</h1>
          <p className="text-sm text-slate-500">Track bugs, tasks, and feature work with an issue-centric view.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setView('board')}
            className={`rounded-2xl px-5 py-3 text-sm font-semibold ${view === 'board' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
          >
            Board
          </button>
          <button
            type="button"
            onClick={() => setView('list')}
            className={`rounded-2xl px-5 py-3 text-sm font-semibold ${view === 'list' ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}
          >
            List
          </button>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'All' | IssueStatus)}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="All">All statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => navigate('/issues/new')}
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            New issue
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-40 rounded-[2rem] bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
          <h2 className="text-lg font-semibold">Unable to load issues</h2>
          <p className="mt-2 text-sm">{(error as Error)?.message || 'An error occurred fetching your issues.'}</p>
        </div>
      ) : view === 'list' ? (
        <div className="space-y-4">
          {(issues || []).map((issue) => (
            <IssueCard key={issue._id} issue={issue} />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 xl:grid-cols-4">
            {statuses.map((status) => (
              <div key={status} className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">{status}</h2>
                <div className="space-y-3">
                  {groupedIssues[status].length ? (
                    groupedIssues[status].map((issue: Issue) => <IssueCard key={issue._id} issue={issue} />)
                  ) : (
                    <p className="text-sm text-slate-500">No issues in this column.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

