import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import queryClient from './config/queryClient';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { SocketProvider } from './context/SocketContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Auth pages
import { PremiumLoginPage } from './pages/auth/PremiumLoginPage';
import { PremiumRegisterPage } from './pages/auth/PremiumRegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { SocialCallbackPage } from './pages/auth/SocialCallbackPage';

// Layout
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import NotFoundPage from './pages/NotFoundPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ProjectsPage } from './pages/projects/ProjectsPage';
import { CreateProjectPage } from './pages/projects/CreateProjectPage';
import { ProjectDetailPage } from './pages/projects/ProjectDetailPage';
import { IssuesPage } from './pages/issues/IssuesPage';
import { IssueDetailPage } from './pages/issues/IssueDetailPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { AIAssistantPage } from './pages/ai/AIAssistantPage';
import { GitHubIntegrationPage } from './pages/github/GitHubIntegrationPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { OrganizationPage } from './pages/organization/OrganizationPage';
import { CreateOrganizationPage } from './pages/organization/CreateOrganizationPage';

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <ThemeProvider>
            <NotificationProvider>
              <SocketProvider>
                <Routes>
                  {/* Redirect root to dashboard */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />

                  {/* Public Auth Routes */}
                  <Route element={<AuthLayout />}>
                    <Route path="/auth/login" element={<PremiumLoginPage />} />
                    <Route path="/auth/register" element={<PremiumRegisterPage />} />
                    <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/auth/reset-password/:token" element={<ResetPasswordPage />} />
                    <Route path="/auth/social-callback" element={<SocialCallbackPage />} />
                  </Route>

                  {/* Protected Routes */}
                  <Route
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="/dashboard" element={<DashboardPage />} />
                    {/* Projects */}
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/projects/new" element={<CreateProjectPage />} />
                    <Route path="/projects/:id" element={<ProjectDetailPage />} />
                    {/* Issues */}
                    <Route path="/issues" element={<IssuesPage />} />
                    <Route path="/issues/:id" element={<IssueDetailPage />} />
                    {/* Notifications */}
                    <Route path="/notifications" element={<NotificationsPage />} />
                    {/* Analytics */}
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    {/* AI Assistant */}
                    <Route path="/ai" element={<AIAssistantPage />} />
                    {/* GitHub Integration */}
                    <Route path="/github" element={<GitHubIntegrationPage />} />
                    {/* Organization */}
                    <Route path="/organization" element={<OrganizationPage />} />
                    <Route path="/organization/new" element={<CreateOrganizationPage />} />
                    {/* Settings */}
                    <Route path="/settings" element={<SettingsPage />} />
                    {/* Profile */}
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>

                  {/* 404 */}
                  <Route path="/404" element={<NotFoundPage />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>

                <Toaster position="top-right" />
              </SocketProvider>
            </NotificationProvider>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
