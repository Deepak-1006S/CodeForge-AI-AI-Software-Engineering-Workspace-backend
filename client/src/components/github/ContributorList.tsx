import React from 'react';
import { GitHubContributor } from '../../types/github.types';

interface ContributorListProps {
  contributors: GitHubContributor[];
  isLoading?: boolean;
}

export const ContributorList: React.FC<ContributorListProps> = ({ contributors, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Top Contributors</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const sorted = [...contributors].sort((a, b) => b.commitCount - a.commitCount);
  const maxCommits = sorted[0]?.commitCount || 0;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Top Contributors ({contributors.length})</h3>
      <div className="space-y-4">
        {sorted.map((contributor, index) => {
          const percentage = (contributor.commitCount / maxCommits) * 100;
          return (
            <div key={contributor.login} className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-500 w-6 text-center">#{index + 1}</span>
              <img
                src={contributor.avatar}
                alt={contributor.login}
                className="h-10 w-10 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <a
                    href={contributor.url}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate text-sm font-medium text-blue-600 hover:underline"
                  >
                    {contributor.name || contributor.login}
                  </a>
                  <span className="text-xs font-semibold text-slate-700 ml-2">
                    {contributor.commitCount} commits
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-blue-600 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
