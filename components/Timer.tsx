'use client';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { Workout, Interval } from '@/lib/workouts';
import { initAudio, playIntervalCue } from '@/lib/audio';
import IntervalDisplay from './IntervalDisplay';

type TimerState = 'idle' | 'running' | 'paused' | 'completed';

interface TimerProps {
  workout: Workout;
  onComplete: (durationSeconds: number) => void;
}

export default function Timer({ workout, onComplete }: TimerProps) {
  // UI State
  const [state, setState] = useState<TimerState>('idle');
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(workout.intervals[0].durationSeconds);
  const [audioInitialized, setAudioInitialized] = useState(false);

  /**
   * Refs for time tracking and system resources
   *
   * Using refs instead of state because these values:
   * 1. Don't need to trigger re-renders when they change
   * 2. Need to persist across renders without causing re-render loops
   * 3. Are accessed frequently in callbacks and intervals
   *
   * Time-based approach: Instead of counting ticks, we store actual timestamps
   * and calculate current state based on elapsed time. This makes the timer
   * resilient to browser throttling when app is backgrounded.
   */
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const startTimeRef = useRef<number | null>(null); // When workout started
  const intervalStartTimeRef = useRef<number | null>(null); // When current interval started

  const currentInterval = workout.intervals[currentIntervalIndex];
  const totalIntervals = workout.intervals.length;

  // Cache total workout duration (doesn't change during workout)
  const totalDuration = useMemo(
    () => workout.intervals.reduce((sum, interval) => sum + interval.durationSeconds, 0),
    [workout.intervals]
  );

  // Calculate overall progress for progress bar
  const completedSeconds = workout.intervals
    .slice(0, currentIntervalIndex)
    .reduce((sum, interval) => sum + interval.durationSeconds, 0);
  const currentIntervalElapsed = currentInterval.durationSeconds - timeRemaining;
  const totalElapsed = completedSeconds + currentIntervalElapsed;
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

  /**
   * Start the workout timer
   *
   * Initializes both workout start time and interval start time to 'now'.
   * These timestamps are critical for the time-based calculation approach:
   * - startTimeRef: Tracks when entire workout began
   * - intervalStartTimeRef: Tracks when current interval began
   */
  const start = () => {
    handleInitAudio();
    setState('running');
    requestWakeLock();

    // Capture current time for both workout and interval tracking
    const now = Date.now();
    startTimeRef.current = now;
    intervalStartTimeRef.current = now;

    // Play audio cue for first interval (run/walk only, not warmup)
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

  /**
   * Skip to next interval
   *
   * When user manually skips, we need to adjust our time tracking to maintain
   * accuracy for the overall workout duration and future interval calculations.
   *
   * We adjust startTimeRef backwards by the amount of time that "should have"
   * elapsed up to this point, so recalculateTimerState() continues to work correctly.
   */
  const skipInterval = () => {
    if (currentIntervalIndex < totalIntervals - 1) {
      const nextIndex = currentIntervalIndex + 1;
      const nextInterval = workout.intervals[nextIndex];

      setCurrentIntervalIndex(nextIndex);
      setTimeRemaining(nextInterval.durationSeconds);

      // Update time tracking when skipping during active workout
      if (state === 'running') {
        intervalStartTimeRef.current = Date.now();

        // Adjust workout start time to maintain accuracy
        // We pretend the workout started earlier so the skipped intervals
        // appear to have already elapsed in our time calculations
        if (startTimeRef.current) {
          const skippedSeconds = workout.intervals
            .slice(0, nextIndex)
            .reduce((sum, interval) => sum + interval.durationSeconds, 0);
          startTimeRef.current = Date.now() - skippedSeconds * 1000;
        }

        // Play audio cue for the new interval
        if (nextInterval.type === 'run' || nextInterval.type === 'walk') {
          playIntervalCue(nextInterval.type);
        }
      }
    }
  };

  /**
   * Recalculate timer state based on actual elapsed time (not tick counting)
   *
   * This function is the core of the background-resilient timer. Instead of
   * assuming each setInterval tick equals 1 second, we calculate the current
   * state based on how much real time has actually elapsed since workout start.
   *
   * This ensures the timer works correctly even when:
   * - App is backgrounded (browser throttles setInterval)
   * - User switches tabs/windows
   * - Device goes to sleep
   * - User returns after extended absence
   *
   * The function:
   * 1. Calculates total elapsed time from workout start
   * 2. Determines which interval we should be on based on that time
   * 3. Auto-advances through any missed intervals
   * 4. Updates timeRemaining to reflect actual remaining time
   */
  const recalculateTimerState = useCallback(() => {
    if (!startTimeRef.current || state !== 'running') return;

    // Calculate how much real time has passed since workout started
    const totalElapsedMs = Date.now() - startTimeRef.current;
    const totalElapsedSeconds = Math.floor(totalElapsedMs / 1000);

    // Walk through intervals to find which one we should be on
    // accumulatedSeconds tracks the start time of each interval
    let accumulatedSeconds = 0;
    let targetIntervalIndex = 0;

    for (let i = 0; i < workout.intervals.length; i++) {
      const intervalDuration = workout.intervals[i].durationSeconds;
      // If elapsed time falls within this interval's duration window
      if (totalElapsedSeconds < accumulatedSeconds + intervalDuration) {
        targetIntervalIndex = i;
        break;
      }
      accumulatedSeconds += intervalDuration;
      targetIntervalIndex = i + 1; // In case we're past the last interval
    }

    // Workout complete - we've passed all intervals
    if (targetIntervalIndex >= workout.intervals.length) {
      setState('completed');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      releaseWakeLock();
      onComplete(totalElapsedSeconds);
      return;
    }

    // Interval transition - we've moved to a new interval since last calculation
    // This handles both normal progression and catching up after backgrounding
    if (targetIntervalIndex !== currentIntervalIndex) {
      setCurrentIntervalIndex(targetIntervalIndex);
      // Update interval start time for accurate tracking
      intervalStartTimeRef.current = startTimeRef.current + accumulatedSeconds * 1000;

      // Play audio cue for new interval (run/walk only)
      const targetInterval = workout.intervals[targetIntervalIndex];
      if (targetInterval.type === 'run' || targetInterval.type === 'walk') {
        playIntervalCue(targetInterval.type);
      }
    }

    // Calculate and display remaining time in current interval
    const intervalElapsedSeconds = totalElapsedSeconds - accumulatedSeconds;
    const intervalDuration = workout.intervals[targetIntervalIndex].durationSeconds;
    const remaining = Math.max(0, intervalDuration - intervalElapsedSeconds);
    setTimeRemaining(remaining);
  }, [state, currentIntervalIndex, workout.intervals, onComplete, releaseWakeLock]);

  /**
   * Timer tick effect - drives the countdown display
   *
   * Updates every 200ms (5 times per second) which provides:
   * - Smooth visual countdown for users
   * - Reasonable CPU usage (not too aggressive)
   * - Fast enough to catch background returns quickly
   *
   * Note: Even if browser throttles this interval when backgrounded,
   * recalculateTimerState() will correctly catch up based on real elapsed time.
   */
  useEffect(() => {
    if (state === 'running') {
      // Calculate immediately on state change to 'running'
      recalculateTimerState();

      // Update every 200ms for smooth countdown display
      intervalRef.current = setInterval(() => {
        recalculateTimerState();
      }, 200);
    } else {
      // Clean up interval when paused, idle, or completed
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
  }, [state, recalculateTimerState]);

  /**
   * Page Visibility API - handle backgrounding/foregrounding
   *
   * Detects when user returns to the app after:
   * - Switching to another app/tab
   * - Locking device
   * - Minimizing browser
   *
   * When user returns, immediately recalculate to show accurate time.
   * This ensures users see the correct state instantly rather than
   * waiting up to 200ms for the next interval tick.
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && state === 'running') {
        console.log('App visible again - recalculating timer state');
        recalculateTimerState();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [state, recalculateTimerState]);

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
