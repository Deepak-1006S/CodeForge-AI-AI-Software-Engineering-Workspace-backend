import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationBell } from '../notifications/NotificationBell';

interface TopNavProps {
  pageTitle: string;
}

export const TopNav: React.FC<TopNavProps> = ({ pageTitle }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [query, setQuery] = useState('');

  return (
    <header className="border-b border-slate-200 bg-white/90 px-4 py-4 shadow-sm backdrop-blur md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Workspace</p>
          <h2 className="text-2xl font-semibold text-slate-900">{pageTitle}</h2>
        </div>

        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="relative w-full sm:max-w-sm">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects, issues, teams..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />

            <div className="hidden h-11 min-w-[12rem] items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-600 sm:flex">
              <div>
                <p className="text-xs text-slate-400">Signed in as</p>
                <p className="font-medium text-slate-900">{user?.name || 'Guest'}</p>
              </div>
              <button onClick={logout} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

