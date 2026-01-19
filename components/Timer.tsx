'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { Workout, Interval } from '@/lib/workouts';
import { initAudio, playIntervalCue } from '@/lib/audio';
import IntervalDisplay from './IntervalDisplay';

type TimerState = 'idle' | 'running' | 'paused' | 'completed';

interface TimerProps {
  workout: Workout;
  onComplete: (durationSeconds: number) => void;
}

export default function Timer({ workout, onComplete }: TimerProps) {
  const [state, setState] = useState<TimerState>('idle');
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(workout.intervals[0].durationSeconds);
  const [audioInitialized, setAudioInitialized] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const currentInterval = workout.intervals[currentIntervalIndex];
  const totalIntervals = workout.intervals.length;

  // Calculate overall progress
  const completedSeconds = workout.intervals
    .slice(0, currentIntervalIndex)
    .reduce((sum, interval) => sum + interval.durationSeconds, 0);
  const currentIntervalElapsed = currentInterval.durationSeconds - timeRemaining;
  const totalElapsed = completedSeconds + currentIntervalElapsed;
  const totalDuration = workout.intervals.reduce(
    (sum, interval) => sum + interval.durationSeconds,
    0
  );
  const overallProgress = (totalElapsed / totalDuration) * 100;

  // Initialize audio on first user interaction
  const handleInitAudio = useCallback(() => {
    if (!audioInitialized) {
      initAudio();
      setAudioInitialized(true);
    }
  }, [audioInitialized]);

  // Request wake lock
  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        console.log('Wake lock acquired');
      } catch (err) {
        console.log('Wake lock failed:', err);
      }
    }
  };

  // Release wake lock
  const releaseWakeLock = () => {
    if (wakeLockRef.current) {
      wakeLockRef.current.release();
      wakeLockRef.current = null;
      console.log('Wake lock released');
    }
  };

  // Start timer
  const start = () => {
    handleInitAudio();
    setState('running');
    requestWakeLock();
    startTimeRef.current = Date.now();

    // Play cue for first interval if it's run or walk
    if (currentInterval.type === 'run' || currentInterval.type === 'walk') {
      playIntervalCue(currentInterval.type);
    }
  };

  // Pause timer
  const pause = () => {
    setState('paused');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Resume timer
  const resume = () => {
    handleInitAudio();
    setState('running');
  };

  // Skip to next interval
  const skipInterval = () => {
    if (currentIntervalIndex < totalIntervals - 1) {
      const nextIndex = currentIntervalIndex + 1;
      const nextInterval = workout.intervals[nextIndex];

      setCurrentIntervalIndex(nextIndex);
      setTimeRemaining(nextInterval.durationSeconds);

      if (state === 'running' && (nextInterval.type === 'run' || nextInterval.type === 'walk')) {
        playIntervalCue(nextInterval.type);
      }
    }
  };

  // Timer tick effect
  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Move to next interval
            if (currentIntervalIndex < totalIntervals - 1) {
              const nextIndex = currentIntervalIndex + 1;
              const nextInterval = workout.intervals[nextIndex];

              setCurrentIntervalIndex(nextIndex);

              // Play audio cue for run/walk transitions
              if (nextInterval.type === 'run' || nextInterval.type === 'walk') {
                playIntervalCue(nextInterval.type);
              }

              return nextInterval.durationSeconds;
            } else {
              // Workout complete
              setState('completed');
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
              }
              releaseWakeLock();

              // Calculate actual workout duration
              const durationSeconds = startTimeRef.current
                ? Math.floor((Date.now() - startTimeRef.current) / 1000)
                : totalDuration;

              onComplete(durationSeconds);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state, currentIntervalIndex, totalIntervals, workout.intervals, onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      releaseWakeLock();
    };
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
      <IntervalDisplay
        interval={currentInterval}
        timeRemaining={timeRemaining}
        formatTime={formatTime}
      />

      {/* Progress bar */}
      <div className="w-full max-w-md">
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-1000 ease-linear"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-zinc-500 text-center">
          Interval {currentIntervalIndex + 1} of {totalIntervals}
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex gap-4">
        {state === 'idle' && (
          <button
            onClick={start}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-xl rounded-lg transition-colors"
          >
            Start
          </button>
        )}

        {state === 'running' && (
          <button
            onClick={pause}
            className="px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-xl rounded-lg transition-colors"
          >
            Pause
          </button>
        )}

        {state === 'paused' && (
          <button
            onClick={resume}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-xl rounded-lg transition-colors"
          >
            Resume
          </button>
        )}

        {(state === 'running' || state === 'paused') && currentIntervalIndex < totalIntervals - 1 && (
          <button
            onClick={skipInterval}
            className="px-6 py-4 bg-zinc-700 hover:bg-zinc-600 text-white font-semibold rounded-lg transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      {state === 'completed' && (
        <div className="text-center space-y-4">
          <div className="text-3xl font-bold text-green-500">Workout Complete!</div>
          <a
            href="/"
            className="inline-block px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
          >
            Back to Home
          </a>
        </div>
      )}
    </div>
  );
}
