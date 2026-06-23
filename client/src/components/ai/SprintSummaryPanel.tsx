import React, { useState } from 'react';
import { generateSprintSummary } from '../../services/ai.service';
import { AIResponseCard } from './AIResponseCard';
import toast from 'react-hot-toast';

export const SprintSummaryPanel: React.FC = () => {
  const [sprintName, setSprintName] = useState('Sprint 1');
  const [issues, setIssues] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!issues.trim()) {
      toast.error('Please enter issues');
      return;
    }

    const parsedIssues = issues.split('\n').filter((line) => line.trim());
    const issueList = parsedIssues.map((line) => ({
      title: line,
      status: 'Completed',
      description: '',
    }));

    setIsLoading(true);
    try {
      const result = await generateSprintSummary({
        issues: issueList,
        sprintName: sprintName || undefined,
      });
      setResponse(result);
      toast.success('Sprint summary generated');
    } catch (error) {
      toast.error('Failed to generate sprint summary');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Generate sprint summary</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="sprint-name" className="block text-sm font-medium text-slate-700">
              Sprint name
            </label>
            <input
              id="sprint-name"
              type="text"
              value={sprintName}
              onChange={(e) => setSprintName(e.target.value)}
              placeholder="e.g., Sprint 15 - Q2 Release"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label htmlFor="issues" className="block text-sm font-medium text-slate-700">
              Issues (one per line)
            </label>
            <textarea
              id="issues"
              value={issues}
              onChange={(e) => setIssues(e.target.value)}
              placeholder="User authentication flow&#10;Notification system&#10;Search optimization&#10;Documentation updates"
              rows={6}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate Summary'}
          </button>
        </div>
      </div>

      {response && (
        <AIResponseCard
          title="Sprint Summary"
          content={response}
          isLoading={isLoading}
          onRegenerate={handleRegenerate}
        />
      )}
    </div>
  );
};
