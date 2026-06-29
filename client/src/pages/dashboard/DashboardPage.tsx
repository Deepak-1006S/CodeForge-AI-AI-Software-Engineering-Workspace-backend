import React, { useEffect, useState } from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import { ActivityFeed } from '../../components/dashboard/ActivityFeed';
import type { ActivityPayload } from '../../types/socket';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const organizationId = user?.organizationId;
  const { data: stats, isLoading, error, refetch } = useDashboard(organizationId);
  const { socket, isConnected } = useSocket();
  const [activities, setActivities] = useState<ActivityPayload[]>([]);

  React.useEffect(() => {
    if (!socket) return;

    const handleNewActivity = (activity: ActivityPayload) => {
      setActivities((prev) => [activity, ...prev].slice(0, 10));
    };

    socket.on('activity:new', handleNewActivity);

    return () => {
      socket.off('activity:new', handleNewActivity);
    };
  }, [socket]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!organizationId && !isLoading) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-yellow-900">No organization selected</h3>
        <p className="mt-2 text-sm text-yellow-700">
          Create or join an organization to load dashboard insights for your team.
        </p>
        <div className="mt-4">
          <a
            href="/organization/new"
            className="inline-flex items-center rounded-full bg-yellow-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-yellow-700"
          >
            Create organization
          </a>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm">
        <div className="flex flex-col gap-3">
          <div>
            <h3 className="text-lg font-medium text-red-900">Error Loading Dashboard</h3>
            <p className="text-red-700 mt-2">{error.message || 'Failed to load dashboard statistics.'}</p>
          </div>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600 mt-2">Here's what's happening in your workspace today.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <p>Realtime status</p>
            <p className={`font-semibold ${isConnected ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-gray-600 text-sm">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalProjects || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📁</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-gray-600 text-sm">Active Projects</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.activeProjects || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🚀</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-gray-600 text-sm">Total Issues</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalIssues || 0}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-gray-600 text-sm">Completed Issues</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.completedIssues || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-gray-600 text-sm">Critical Issues</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.criticalIssues || 0}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-gray-600 text-sm">Team Members</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.teamMembers || 0}</p>
            </div>
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Completion rate</p>
            <p className="text-2xl font-semibold text-slate-900">{stats?.completionRate?.toFixed(1) || 0}%</p>
          </div>
          <div className="w-full md:w-2/3 bg-slate-100 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-600"
              style={{ width: `${Math.min(Math.max(stats?.completionRate ?? 0, 0), 100)}%` }}
            />
          </div>
        </div>
      </div>

      <ActivityFeed activities={activities} />
    </div>
  );
};

