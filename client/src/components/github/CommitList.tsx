import React, { useState } from 'react';
import { GitHubCommit } from '../../types/github.types';
import { formatDate } from '../../utils/formatDate';

interface CommitListProps {
  commits: GitHubCommit[];
  isLoading?: boolean;
}

export const CommitList: React.FC<CommitListProps> = ({ commits, isLoading = false }) => {
  const [itemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(commits.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedCommits = commits.slice(startIdx, startIdx + itemsPerPage);

  if (isLoading) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Recent Commits</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h3 className="text-lg font-semibold text-slate-900">Recent Commits ({commits.length})</h3>
      </div>
      <div className="divide-y divide-slate-200">
        {paginatedCommits.length > 0 ? (
          paginatedCommits.map((commit) => (
            <div key={commit.sha} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50">
              <div>
                {commit.authorAvatar && (
                  <img
                    src={commit.authorAvatar}
                    alt={commit.author}
                    className="h-10 w-10 rounded-full"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <a
                    href={commit.url}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate font-mono text-sm text-blue-600 hover:underline"
                  >
                    {commit.sha.substring(0, 7)}
                  </a>
                  <span className="text-xs text-slate-500">{formatDate(commit.timestamp)}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-900 line-clamp-2">{commit.message}</p>
                <p className="mt-1 text-xs text-slate-600">
                  by <span className="font-medium">{commit.author}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-slate-500">No commits found</p>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-slate-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
