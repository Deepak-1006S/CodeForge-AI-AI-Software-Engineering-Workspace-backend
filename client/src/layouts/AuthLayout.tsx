import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Layout for authentication pages (login, register, etc.)
 */
export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Logo/Branding */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">CodeForge AI</h1>
        <p className="text-gray-600 text-center mt-2">AI-Powered Software Engineering Workspace</p>
      </div>

      {/* Content */}
      <Outlet />
    </div>
  );
};
