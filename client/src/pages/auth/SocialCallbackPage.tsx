import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from 'lucide-react';

export const SocialCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuthSession } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (!accessToken || !refreshToken) {
      setError('Missing authentication tokens. Please try signing in again.');
      return;
    }

    const restoreSession = async () => {
      try {
        await setAuthSession(accessToken, refreshToken);
        navigate('/dashboard', { replace: true });
      } catch (err) {
        setError('Unable to complete social login. Please try again.');
      }
    };

    restoreSession();
  }, [location.search, navigate, setAuthSession]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/95 p-8 shadow-2xl">
        {error ? (
          <div>
            <h1 className="text-2xl font-semibold mb-4">Social login failed</h1>
            <p className="text-sm text-slate-300">{error}</p>
          </div>
        ) : (
          <div className="text-center">
            <Loader className="mx-auto h-12 w-12 animate-spin text-blue-400" />
            <h1 className="mt-6 text-2xl font-semibold">Signing you in...</h1>
            <p className="mt-3 text-sm text-slate-400">Finishing authentication and redirecting to your dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
};
