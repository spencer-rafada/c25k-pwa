'use client';

import { useEffect, useState } from 'react';
import { workouts, workoutId } from '@/lib/workouts';
import { loadProgress } from '@/lib/storage';
import Link from 'next/link';

export default function ProgressTracker() {
  const [completedWorkouts, setCompletedWorkouts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const progress = loadProgress();
    setCompletedWorkouts(new Set(progress.completedWorkouts));
  }, []);

  const weeks = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {weeks.map(week => {
        const weekWorkouts = workouts.filter(w => w.week === week);

        return (
          <div key={week} className="space-y-2">
            <h2 className="text-xl font-bold text-white">Week {week}</h2>
            <div className="grid grid-cols-3 gap-3">
              {weekWorkouts.map(workout => {
                const id = workoutId(workout.week, workout.day);
                const isCompleted = completedWorkouts.has(id);

                return (
                  <Link
                    key={id}
                    href={`/workout/${id}`}
                    className={`
                      p-4 rounded-lg font-semibold text-center transition-colors
                      ${isCompleted
                        ? 'bg-green-600 text-white'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                      }
                    `}
                  >
                    Day {workout.day}
                    {isCompleted && (
                      <div className="text-xs mt-1 opacity-80">✓</div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
