'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type CallbackState = 'loading' | 'success' | 'error';

export default function AuthCallbackPage() {
  const [state, setState] = useState<CallbackState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from the URL
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error');
        const errorDescription = params.get('error_description');

        // Check for errors in URL
        if (error) {
          setState('error');
          setErrorMessage(
            errorDescription || 'Authentication failed. Please try again.'
          );
          return;
        }

        // If no code, show error
        if (!code) {
          setState('error');
          setErrorMessage('No authentication code found. Please try again.');
          return;
        }

        // Exchange code for session
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.error('Auth exchange error:', exchangeError);
          setState('error');
          setErrorMessage(
            exchangeError.message || 'This link may have expired. Please try again.'
          );
          return;
        }

        // Success! Session is now stored
        setState('success');
      } catch (err) {
        console.error('Callback error:', err);
        setState('error');
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    };

    handleCallback();
  }, [supabase.auth]);

  const getAppUrl = () => {
    if (typeof window !== 'undefined') {
      const { protocol, hostname, port } = window.location;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3000';
      }
      return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
    }
    return '/';
  };

  const handleOpenApp = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {state === 'loading' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
            </div>
            <p className="text-xl text-zinc-300">Signing you in…</p>
          </div>
        )}

        {state === 'success' && (
          <div className="space-y-6">
            {/* Checkmark Icon */}
            <div className="flex justify-center">
              <div className="rounded-full bg-green-500/20 p-4">
                <svg
                  className="w-16 h-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white">You&apos;re signed in!</h1>

            {/* Subtitle */}
            <p className="text-xl text-zinc-300">Return to the app to continue.</p>

            {/* Primary Button */}
            <button
              onClick={handleOpenApp}
              className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-lg transition-colors"
            >
              Open C25K App
            </button>

            {/* Helper Text */}
            <p className="text-sm text-zinc-500">
              Or open the app from your home screen
            </p>
          </div>
        )}

        {state === 'error' && (
          <div className="space-y-6">
            {/* Error Icon */}
            <div className="flex justify-center">
              <div className="rounded-full bg-red-500/20 p-4">
                <svg
                  className="w-16 h-16 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white">Sign in failed</h1>

            {/* Subtitle */}
            <p className="text-xl text-zinc-300">
              {errorMessage || 'This link may have expired. Please try again.'}
            </p>

            {/* Primary Button */}
            <button
              onClick={handleOpenApp}
              className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold rounded-lg transition-colors"
            >
              Back to App
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
