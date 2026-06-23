import React, { useState } from 'react';
import { generateTaskDescription } from '../../services/ai.service';
import { AIResponseCard } from './AIResponseCard';
import toast from 'react-hot-toast';

export const TaskDescriptionPanel: React.FC = () => {
  const [taskTitle, setTaskTitle] = useState('');
  const [projectContext, setProjectContext] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!taskTitle.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    setIsLoading(true);
    try {
      const result = await generateTaskDescription({
        title: taskTitle,
        projectContext: projectContext || undefined,
      });
      setResponse(result);
      toast.success('Task description generated');
    } catch (error) {
      toast.error('Failed to generate task description');
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
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Generate task description</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-slate-700">
              Task title or feature
            </label>
            <input
              id="task-title"
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g., User authentication with OAuth2"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div>
            <label htmlFor="project-context" className="block text-sm font-medium text-slate-700">
              Project context (optional)
            </label>
            <textarea
              id="project-context"
              value={projectContext}
              onChange={(e) => setProjectContext(e.target.value)}
              placeholder="e.g., Building a SaaS platform for project management..."
              rows={3}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate Description'}
          </button>
        </div>
      </div>

      {response && (
        <AIResponseCard
          title="Generated Task Description"
          content={response}
          isLoading={isLoading}
          onRegenerate={handleRegenerate}
        />
      )}
    </div>
  );
};

