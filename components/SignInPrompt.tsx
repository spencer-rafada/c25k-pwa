'use client';

import { useState } from 'react';

interface SignInPromptProps {
  onDismiss: () => void;
  onSignIn: () => void;
}

export default function SignInPrompt({ onDismiss, onSignIn }: SignInPromptProps) {
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-zinc-800 border border-zinc-700 rounded-lg p-4 shadow-lg z-50">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-white font-semibold mb-1">
            Save your progress
          </p>
          <p className="text-zinc-400 text-sm mb-3">
            Sign in to sync your workouts across devices
          </p>
          <div className="flex gap-2">
            <button
              onClick={onSignIn}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={onDismiss}
              className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Maybe later
            </button>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Dismiss"
        >
          <svg
            className="w-5 h-5"
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
        </button>
      </div>
    </div>
  );
}
