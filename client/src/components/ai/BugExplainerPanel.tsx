import React, { useState } from 'react';
import { explainBug } from '../../services/ai.service';
import { AIResponseCard } from './AIResponseCard';
import toast from 'react-hot-toast';

export const BugExplainerPanel: React.FC = () => {
  const [bugDescription, setBugDescription] = useState('');
  const [errorStack, setErrorStack] = useState('');
  const [context, setContext] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleExplain = async () => {
    if (!bugDescription.trim()) {
      toast.error('Please describe the bug');
      return;
    }

    setIsLoading(true);
    try {
      const result = await explainBug({
        bugDescription,
        errorStack: errorStack || undefined,
        context: context || undefined,
      });
      setResponse(result);
      toast.success('Bug analysis generated');
    } catch (error) {
      toast.error('Failed to analyze bug');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    handleExplain();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">AI bug explainer</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="bug-desc" className="block text-sm font-medium text-slate-700">
              Bug description
            </label>
            <textarea
              id="bug-desc"
              value={bugDescription}
              onChange={(e) => setBugDescription(e.target.value)}
              placeholder="Describe the bug you're experiencing..."
              rows={3}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label htmlFor="error-stack" className="block text-sm font-medium text-slate-700">
              Error stack trace (optional)
            </label>
            <textarea
              id="error-stack"
              value={errorStack}
              onChange={(e) => setErrorStack(e.target.value)}
              placeholder="Paste the full error stack trace..."
              rows={4}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-mono placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label htmlFor="context" className="block text-sm font-medium text-slate-700">
              Additional context (optional)
            </label>
            <textarea
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Environment, recent changes, reproduction steps..."
              rows={3}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            type="button"
            onClick={handleExplain}
            disabled={isLoading}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Analyzing...' : 'Analyze Bug'}
          </button>
        </div>
      </div>

      {response && (
        <AIResponseCard
          title="Bug Analysis"
          content={response}
          isLoading={isLoading}
          onRegenerate={handleRegenerate}
        />
      )}
    </div>
  );
};
