'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface AccountMenuProps {
  user: User;
}

export default function AccountMenu({ user }: AccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleSignOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    // Next.js will handle the redirect via middleware or page refresh
    window.location.reload();
  };

  const displayName = user.email || user.user_metadata?.full_name || 'User';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
      >
        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <span className="text-white text-sm font-medium hidden sm:block">
          {displayName}
        </span>
        <svg
          className={`w-4 h-4 text-zinc-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 mt-2 w-64 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-20 py-2">
            <div className="px-4 py-3 border-b border-zinc-700">
              <p className="text-sm text-zinc-400">Signed in as</p>
              <p className="text-white font-semibold truncate">{displayName}</p>
            </div>

            <div className="px-2 py-2">
              <div className="flex items-center gap-2 px-3 py-2 text-sm text-green-500">
                <svg
                  className="w-4 h-4"
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
                <span>Progress synced</span>
              </div>
            </div>

            <div className="border-t border-zinc-700 px-2 py-2">
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-zinc-700 rounded transition-colors disabled:opacity-50"
              >
                {loading ? 'Signing out...' : 'Sign out'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
