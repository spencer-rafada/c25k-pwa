'use client';

import { useState, useEffect } from 'react';
import ProgressTracker from '@/components/ProgressTracker';
import SignInPrompt from '@/components/SignInPrompt';
import AuthModal from '@/components/AuthModal';
import AccountMenu from '@/components/AccountMenu';
import { useAuth } from '@/components/AuthProvider';

export default function Home() {
  const { user, loading } = useAuth();
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [promptDismissed, setPromptDismissed] = useState(false);

  // Handle auth code in URL (if redirected here instead of callback)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      // Redirect to callback handler
      window.location.href = `/auth/callback?code=${code}`;
    }
  }, []);

  // Show sign-in prompt after a brief delay if user is not signed in
  useEffect(() => {
    if (!loading && !user && !promptDismissed) {
      const timer = setTimeout(() => {
        setShowSignInPrompt(true);
      }, 3000); // Show after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [loading, user, promptDismissed]);

  const handleDismissPrompt = () => {
    setShowSignInPrompt(false);
    setPromptDismissed(true);
    // Store dismiss in session storage
    sessionStorage.setItem('c25k_prompt_dismissed', 'true');
  };

  const handleOpenAuth = () => {
    setShowSignInPrompt(false);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="border-b border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-500">C25K</h1>
            <p className="text-zinc-400 text-sm">Couch to 5K Training Program</p>
          </div>
          {!loading && (
            <div>
              {user ? (
                <AccountMenu user={user} />
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Sign in
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <ProgressTracker />
        )}
      </main>

      {showSignInPrompt && (
        <SignInPrompt onDismiss={handleDismissPrompt} onSignIn={handleOpenAuth} />
      )}

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
