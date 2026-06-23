import React from 'react';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { GitHubPullRequest, GitHubPullRequestStats } from '../../types/github.types';

interface PullRequestStatsProps {
  pullRequests: GitHubPullRequest[];
  stats: GitHubPullRequestStats;
  isLoading?: boolean;
}

export const PullRequestStats: React.FC<PullRequestStatsProps> = ({
  pullRequests,
  stats,
  isLoading = false,
}) => {
  const chartData = [
    {
      name: 'Pull Requests',
      open: stats.open,
      merged: stats.merged,
      closed: stats.closed,
    },
  ];

  if (isLoading) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Pull Request Statistics</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Pull Request Statistics</h3>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-blue-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-blue-600">Total PRs</p>
          <p className="mt-2 text-2xl font-bold text-blue-900">{stats.total}</p>
        </div>
        <div className="rounded-2xl bg-green-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-green-600">Merged</p>
          <p className="mt-2 text-2xl font-bold text-green-900">{stats.merged}</p>
        </div>
        <div className="rounded-2xl bg-yellow-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-yellow-600">Open</p>
          <p className="mt-2 text-2xl font-bold text-yellow-900">{stats.open}</p>
        </div>
        <div className="rounded-2xl bg-red-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-red-600">Closed</p>
          <p className="mt-2 text-2xl font-bold text-red-900">{stats.closed}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="merged" fill="#10b981" />
            <Bar dataKey="open" fill="#f59e0b" />
            <Bar dataKey="closed" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6">
        <h4 className="mb-3 font-semibold text-slate-900">Recent PRs</h4>
        <div className="space-y-2">
          {pullRequests.slice(0, 5).map((pr) => (
            <div key={pr.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
              <div className="flex-1 min-w-0">
                <a
                  href={pr.url}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-sm font-medium text-blue-600 hover:underline"
                >
                  #{pr.number} {pr.title}
                </a>
                <p className="text-xs text-slate-600">by {pr.author}</p>
              </div>
              <span
                className={`ml-2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${
                  pr.state === 'merged'
                    ? 'bg-green-100 text-green-800'
                    : pr.state === 'open'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {pr.state}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
