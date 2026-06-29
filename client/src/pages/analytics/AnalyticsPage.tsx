import React from 'react';
import { ProjectProgressChart } from '../../components/dashboard/ProjectProgressChart';
import { ProductivityChart } from '../../components/dashboard/ProductivityChart';
import { IssueResolutionChart } from '../../components/dashboard/IssueResolutionChart';
import { IssueStatusPieChart } from '../../components/dashboard/IssueStatusPieChart';

export const AnalyticsPage: React.FC = () => {
  const metrics = [
    { label: 'Productivity', value: '82%', change: '+12%' },
    { label: 'Project Health', value: '91%', change: '+8%' },
    { label: 'Cycle Time', value: '3.4d', change: '-6%' },
    { label: 'Issue Closure', value: '74%', change: '+15%' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Analytics</p>
            <h1 className="text-3xl font-semibold text-slate-900">Project health dashboard</h1>
            <p className="mt-2 text-sm text-slate-500">Review team productivity, issue flow, and project momentum.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">{metric.label}</p>
            <div className="mt-3 flex items-end gap-3">
              <p className="text-3xl font-semibold text-slate-900">{metric.value}</p>
              <span className="text-sm font-semibold text-emerald-600">{metric.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Project completion</h2>
              <p className="text-sm text-slate-500">Track health across active initiatives.</p>
            </div>
          </div>
          <ProjectProgressChart />
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Productivity pace</h2>
              <p className="text-sm text-slate-500">Completed tasks per team member over the last 6 weeks.</p>
            </div>
          </div>
          <ProductivityChart />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900">Issue flow</h2>
            <p className="text-sm text-slate-500">Opened vs resolved issues in the current sprint.</p>
          </div>
          <IssueResolutionChart />
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-slate-900">Issue status mix</h2>
            <p className="text-sm text-slate-500">Healthy balance of work across statuses.</p>
          </div>
          <IssueStatusPieChart />
        </div>
      </div>
    </div>
  );
};

