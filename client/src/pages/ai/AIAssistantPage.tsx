import React, { useState } from 'react';
import { TaskDescriptionPanel } from '../../components/ai/TaskDescriptionPanel';
import { BugExplainerPanel } from '../../components/ai/BugExplainerPanel';
import { SprintSummaryPanel } from '../../components/ai/SprintSummaryPanel';
import { ReleaseNotesPanel } from '../../components/ai/ReleaseNotesPanel';

type TabType = 'tasks' | 'bugs' | 'sprint' | 'release';

const tabs: { id: TabType; label: string; icon: string }[] = [
  { id: 'tasks', label: 'Task Generator', icon: '✨' },
  { id: 'bugs', label: 'Bug Explainer', icon: '🐛' },
  { id: 'sprint', label: 'Sprint Summary', icon: '📊' },
  { id: 'release', label: 'Release Notes', icon: '🚀' },
];

export const AIAssistantPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('tasks');

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Powered by Gemini AI</p>
            <h1 className="text-3xl font-semibold text-slate-900">AI Assistant</h1>
            <p className="mt-2 text-sm text-slate-500">Generate tasks, analyze bugs, summarize sprints, and create release notes.</p>
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-4 text-center font-medium transition ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'tasks' && <TaskDescriptionPanel />}
          {activeTab === 'bugs' && <BugExplainerPanel />}
          {activeTab === 'sprint' && <SprintSummaryPanel />}
          {activeTab === 'release' && <ReleaseNotesPanel />}
        </div>
      </div>
    </div>
  );
};
