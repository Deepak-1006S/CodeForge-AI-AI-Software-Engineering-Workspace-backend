import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar';
import { TopNav } from '../components/navigation/TopNav';

/**
 * Dashboard layout with navigation and main content area
 */
export const DashboardLayout: React.FC = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/projects')) return 'Projects';
    if (path.startsWith('/issues')) return 'Issues';
    if (path.startsWith('/organizations')) return 'Organizations';
    if (path.startsWith('/analytics')) return 'Analytics';
    if (path.startsWith('/github')) return 'GitHub';
    if (path.startsWith('/ai')) return 'AI Assistant';
    if (path.startsWith('/settings')) return 'Settings';
    if (path.startsWith('/profile')) return 'Profile';
    return 'Dashboard';
  };

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav pageTitle={getPageTitle()} />

        <main className="flex-1 overflow-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

