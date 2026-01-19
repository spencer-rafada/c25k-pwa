// Updated storage layer with timestamps and duration tracking

export interface WorkoutCompletion {
  workoutId: string;
  completedAt: string; // ISO 8601 timestamp
  durationSeconds?: number;
}

export interface LocalUserProgress {
  completions: WorkoutCompletion[];
}

const STORAGE_KEY = 'c25k_progress';
const QUEUE_KEY = 'c25k_sync_queue';

// Get local progress
export function getLocalProgress(): LocalUserProgress {
  if (typeof window === 'undefined') {
    return { completions: [] };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { completions: [] };
    }
    return JSON.parse(stored) as LocalUserProgress;
  } catch (error) {
    console.error('Failed to load progress:', error);
    return { completions: [] };
  }
}

// Save local completion
export function saveLocalCompletion(completion: WorkoutCompletion): void {
  if (typeof window === 'undefined') return;

  try {
    const progress = getLocalProgress();
    const existingIndex = progress.completions.findIndex(
      (c) => c.workoutId === completion.workoutId
    );

    if (existingIndex >= 0) {
      progress.completions[existingIndex] = completion;
    } else {
      progress.completions.push(completion);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save completion:', error);
  }
}

// Clear local progress (used after successful migration to cloud)
export function clearLocalProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// Check if workout is completed
export function isWorkoutCompleted(workoutId: string): boolean {
  const progress = getLocalProgress();
  return progress.completions.some((c) => c.workoutId === workoutId);
}

// Get all completed workout IDs (for backward compatibility)
export function getCompletedWorkoutIds(): string[] {
  const progress = getLocalProgress();
  return progress.completions.map((c) => c.workoutId);
}

// Offline queue for failed syncs
export function addToSyncQueue(completion: WorkoutCompletion): void {
  if (typeof window === 'undefined') return;

  try {
    const queue = getSyncQueue();
    // Avoid duplicates
    const exists = queue.some((c) => c.workoutId === completion.workoutId);
    if (!exists) {
      queue.push(completion);
      localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    }
  } catch (error) {
    console.error('Failed to add to sync queue:', error);
  }
}

export function getSyncQueue(): WorkoutCompletion[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load sync queue:', error);
    return [];
  }
}

export function clearSyncQueue(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(QUEUE_KEY);
}

export function removeFromSyncQueue(workoutId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const queue = getSyncQueue();
    const filtered = queue.filter((c) => c.workoutId !== workoutId);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove from sync queue:', error);
  }
}
