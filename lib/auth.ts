import { createClient } from './supabase/client';
import {
  WorkoutCompletion,
  getLocalProgress,
  saveLocalCompletion,
  getSyncQueue,
  removeFromSyncQueue,
  addToSyncQueue,
} from './storage';

// Database types
export interface DbWorkoutCompletion {
  id: string;
  user_id: string;
  workout_id: string;
  completed_at: string;
  duration_seconds: number | null;
  created_at: string;
}

// Fetch user's completions from database
export async function fetchCloudProgress(
  userId: string
): Promise<WorkoutCompletion[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('workout_completions')
    .select('workout_id, completed_at, duration_seconds')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch cloud progress:', error);
    return [];
  }

  return (
    data?.map((row) => ({
      workoutId: row.workout_id,
      completedAt: row.completed_at,
      durationSeconds: row.duration_seconds ?? undefined,
    })) ?? []
  );
}

// Migrate local progress to cloud (on first sign-in or merge)
export async function migrateLocalToCloud(userId: string): Promise<boolean> {
  const supabase = createClient();
  const local = getLocalProgress();

  if (local.completions.length === 0) return true;

  try {
    // Fetch existing cloud completions
    const { data: cloudCompletions } = await supabase
      .from('workout_completions')
      .select('workout_id')
      .eq('user_id', userId);

    const cloudWorkoutIds = new Set(
      cloudCompletions?.map((c) => c.workout_id) ?? []
    );

    // Find local completions not in cloud
    const toUpload = local.completions.filter(
      (c) => !cloudWorkoutIds.has(c.workoutId)
    );

    if (toUpload.length === 0) return true;

    // Insert missing completions
    const { error } = await supabase.from('workout_completions').insert(
      toUpload.map((c) => ({
        user_id: userId,
        workout_id: c.workoutId,
        completed_at: c.completedAt,
        duration_seconds: c.durationSeconds ?? null,
      }))
    );

    if (error) {
      console.error('Migration failed:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Migration error:', error);
    return false;
  }
}

// Sync on sign-in: merge local data and fetch cloud state
export async function syncOnSignIn(userId: string): Promise<void> {
  // Attempt to migrate/merge local data
  await migrateLocalToCloud(userId);

  // Process offline queue
  await processSyncQueue(userId);

  // Fetch full cloud state as source of truth
  const cloudProgress = await fetchCloudProgress(userId);

  // Update localStorage to match cloud (acts as cache)
  if (typeof window !== 'undefined') {
    localStorage.setItem(
      'c25k_progress',
      JSON.stringify({
        completions: cloudProgress,
      })
    );
  }
}

// Complete a workout (authenticated or anonymous)
export async function completeWorkout(
  workoutId: string,
  durationSeconds?: number
): Promise<void> {
  const completion: WorkoutCompletion = {
    workoutId,
    completedAt: new Date().toISOString(),
    durationSeconds,
  };

  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    // Authenticated — write to database
    try {
      const { error } = await supabase
        .from('workout_completions')
        .upsert(
          {
            user_id: session.user.id,
            workout_id: completion.workoutId,
            completed_at: completion.completedAt,
            duration_seconds: completion.durationSeconds ?? null,
          },
          {
            onConflict: 'user_id,workout_id',
          }
        );

      if (error) {
        console.error('Failed to save to cloud:', error);
        // Add to offline queue for retry
        addToSyncQueue(completion);
      }

      // Also update local cache
      saveLocalCompletion(completion);
    } catch (error) {
      console.error('Sync error:', error);
      // Add to offline queue
      addToSyncQueue(completion);
      // Save locally
      saveLocalCompletion(completion);
    }
  } else {
    // Anonymous — localStorage only
    saveLocalCompletion(completion);
  }
}

// Process offline sync queue
export async function processSyncQueue(userId: string): Promise<void> {
  const queue = getSyncQueue();
  if (queue.length === 0) return;

  const supabase = createClient();

  for (const completion of queue) {
    try {
      const { error } = await supabase
        .from('workout_completions')
        .upsert(
          {
            user_id: userId,
            workout_id: completion.workoutId,
            completed_at: completion.completedAt,
            duration_seconds: completion.durationSeconds ?? null,
          },
          {
            onConflict: 'user_id,workout_id',
          }
        );

      if (!error) {
        // Successfully synced, remove from queue
        removeFromSyncQueue(completion.workoutId);
      }
    } catch (error) {
      console.error('Failed to sync queued item:', error);
      // Keep in queue for next attempt
    }
  }
}

// Attempt to process queue on app load (when user is authenticated)
export async function attemptQueueSync(): Promise<void> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    await processSyncQueue(session.user.id);
  }
}
