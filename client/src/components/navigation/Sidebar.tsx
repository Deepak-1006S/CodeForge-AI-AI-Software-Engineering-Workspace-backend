import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Projects', to: '/projects' },
  { label: 'Issues', to: '/issues' },
  { label: 'Organizations', to: '/organizations' },
  { label: 'Analytics', to: '/analytics' },
  { label: 'GitHub', to: '/github' },
];

const secondaryItems = [
  { label: 'Settings', to: '/settings' },
  { label: 'Profile', to: '/profile' },
];

const activeClass =
  'block rounded-2xl px-4 py-3 text-sm font-semibold text-white bg-slate-700 shadow-sm';
const inactiveClass =
  'block rounded-2xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((word: string) => word[0])
        .join('')
        .slice(0, 2)
    : 'CF';

  return (
    <aside className="hidden w-72 flex-col bg-slate-950 text-slate-100 p-6 md:flex">
      <div className="mb-10 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-lg font-bold text-white">
          CF
        </div>
        <div>
          <p className="text-sm text-slate-400">CodeForge AI</p>
          <h1 className="text-xl font-semibold">Workspace</h1>
        </div>
      </div>

      <div className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-400">
        <p className="font-semibold text-slate-100">Current organization</p>
        <p className="mt-2 text-sm text-slate-300">Acme Software</p>
        <p className="mt-1 text-xs text-slate-500">Project delivery · 24 members</p>
      </div>

      <div className="mt-auto space-y-2">
        {secondaryItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
          >
            {item.label}
          </NavLink>
        ))}

        <button
          type="button"
          onClick={logout}
          className="w-full rounded-2xl bg-slate-800 px-4 py-3 text-left text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
};

