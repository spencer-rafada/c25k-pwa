'use client';

import { useParams, useRouter } from 'next/navigation';
import { getWorkoutById, getTotalDuration } from '@/lib/workouts';
import { completeWorkout } from '@/lib/auth';
import Timer from '@/components/Timer';

export default function WorkoutPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const workout = getWorkoutById(id);

  if (!workout) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-red-500">Workout Not Found</h1>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const handleComplete = async (durationSeconds: number) => {
    await completeWorkout(id, durationSeconds);
  };

  const totalMinutes = Math.ceil(getTotalDuration(workout) / 60);

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <header className="border-b border-zinc-800">
        <div className="max-w-2xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Week {workout.week}, Day {workout.day}
            </h1>
            <p className="text-zinc-400">~{totalMinutes} minutes</p>
          </div>
          <a
            href="/"
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors"
          >
            Exit
          </a>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Timer workout={workout} onComplete={handleComplete} />
      </main>
    </div>
  );
}
