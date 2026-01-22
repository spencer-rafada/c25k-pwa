'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type CallbackState = 'loading' | 'success' | 'error';

export default function AuthCallbackStatusPage() {
  const [state, setState] = useState<CallbackState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check URL parameters to determine state
    const success = searchParams.get('success');
    const error = searchParams.get('error');

    if (success === 'true') {
      setState('success');
    } else if (error) {
      setState('error');
      setErrorMessage(decodeURIComponent(error));
    } else {
      // If we somehow got here without parameters, show loading briefly then error
      setTimeout(() => {
        setState('error');
        setErrorMessage('Invalid callback URL. Please try again.');
      }, 1000);
    }
  }, [searchParams]);

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
