import { UserProgress } from './workouts';

const STORAGE_KEY = 'c25k-progress';

export const loadProgress = (): UserProgress => {
  if (typeof window === 'undefined') {
    return { completedWorkouts: [] };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { completedWorkouts: [] };
    }
    return JSON.parse(stored) as UserProgress;
  } catch (error) {
    console.error('Failed to load progress:', error);
    return { completedWorkouts: [] };
  }
};

export const saveProgress = (progress: UserProgress): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
};

export const markWorkoutComplete = (workoutId: string): void => {
  const progress = loadProgress();

  if (!progress.completedWorkouts.includes(workoutId)) {
    progress.completedWorkouts.push(workoutId);
  }

  progress.lastWorkout = workoutId;
  saveProgress(progress);
};

export const isWorkoutCompleted = (workoutId: string): boolean => {
  const progress = loadProgress();
  return progress.completedWorkouts.includes(workoutId);
};
