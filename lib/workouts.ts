export type IntervalType = 'warmup' | 'run' | 'walk' | 'cooldown';

export interface Interval {
  type: IntervalType;
  durationSeconds: number;
}

export interface Workout {
  week: number;
  day: number;
  intervals: Interval[];
}

export interface UserProgress {
  completedWorkouts: string[];
  lastWorkout?: string;
}

// Helper to create workout ID
export const workoutId = (week: number, day: number): string => `W${week}D${day}`;

// All workouts include 5-minute (300s) warmup walk and 5-minute cooldown walk
export const workouts: Workout[] = [
  // WEEK 1 — 60s run / 90s walk × 8
  {
    week: 1,
    day: 1,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 60 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 60 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 60 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 60 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 60 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 60 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 60 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 60 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },
  {
    week: 1,
    day: 2,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 60 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 60 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 60 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 60 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 60 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 60 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 60 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 60 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },
  {
    week: 1,
    day: 3,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 60 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 60 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 60 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 60 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 60 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 60 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 60 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 60 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },

  // WEEK 2 — 90s run / 2min walk × 6
  {
    week: 2,
    day: 1,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 90 },
      { type: 'walk', durationSeconds: 120 },
      { type: 'run', durationSeconds: 90 },
      { type: 'walk', durationSeconds: 120 },
      { type: 'run', durationSeconds: 90 },
      { type: 'walk', durationSeconds: 120 },
      { type: 'run', durationSeconds: 90 },
      { type: 'walk', durationSeconds: 120 },
      { type: 'run', durationSeconds: 90 },
      { type: 'walk', durationSeconds: 120 },
      { type: 'run', durationSeconds: 90 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },
  {
    week: 2,
    day: 2,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 90 },
      { type: 'walk', durationSeconds: 120 },
      { type: 'run', durationSeconds: 90 },
      { type: 'walk', durationSeconds: 120 },
      { type: 'run', durationSeconds: 90 },
      { type: 'walk', durationSeconds: 120 },
      { type: 'run', durationSeconds: 90 },
      { type: 'walk', durationSeconds: 120 },
      { type: 'run', durationSeconds: 90 },
      { type: 'walk', durationSeconds: 120 },
      { type: 'run', durationSeconds: 90 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },
  {
    week: 2,
    day: 3,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 90 },
      { type: 'walk', durationSeconds: 120 },
      { type: 'run', durationSeconds: 90 },
      { type: 'walk', durationSeconds: 120 },
      { type: 'run', durationSeconds: 90 },
      { type: 'walk', durationSeconds: 120 },
      { type: 'run', durationSeconds: 90 },
      { type: 'walk', durationSeconds: 120 },
      { type: 'run', durationSeconds: 90 },
      { type: 'walk', durationSeconds: 120 },
      { type: 'run', durationSeconds: 90 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },

  // WEEK 3 — 90s run, 90s walk, 3min run, 3min walk × 2
  {
    week: 3,
    day: 1,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 90 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 180 },
      { type: 'walk', durationSeconds: 180 },
      { type: 'run', durationSeconds: 90 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 180 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },
  {
    week: 3,
    day: 2,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 90 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 180 },
      { type: 'walk', durationSeconds: 180 },
      { type: 'run', durationSeconds: 90 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 180 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },
  {
    week: 3,
    day: 3,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 90 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 180 },
      { type: 'walk', durationSeconds: 180 },
      { type: 'run', durationSeconds: 90 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 180 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },

  // WEEK 4 — 3min run, 90s walk, 5min run, 2.5min walk, 3min run, 90s walk, 5min run
  {
    week: 4,
    day: 1,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 180 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 300 },
      { type: 'walk', durationSeconds: 150 },
      { type: 'run', durationSeconds: 180 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 300 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },
  {
    week: 4,
    day: 2,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 180 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 300 },
      { type: 'walk', durationSeconds: 150 },
      { type: 'run', durationSeconds: 180 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 300 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },
  {
    week: 4,
    day: 3,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 180 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 300 },
      { type: 'walk', durationSeconds: 150 },
      { type: 'run', durationSeconds: 180 },
      { type: 'walk', durationSeconds: 90 },
      { type: 'run', durationSeconds: 300 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },

  // WEEK 5
  // Day 1: 5min run, 3min walk, 5min run, 3min walk, 5min run
  {
    week: 5,
    day: 1,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 300 },
      { type: 'walk', durationSeconds: 180 },
      { type: 'run', durationSeconds: 300 },
      { type: 'walk', durationSeconds: 180 },
      { type: 'run', durationSeconds: 300 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },
  // Day 2: 8min run, 5min walk, 8min run
  {
    week: 5,
    day: 2,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 480 },
      { type: 'walk', durationSeconds: 300 },
      { type: 'run', durationSeconds: 480 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },
  // Day 3: 20min run
  {
    week: 5,
    day: 3,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 1200 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },

  // WEEK 6
  // Day 1: 5min run, 3min walk, 8min run, 3min walk, 5min run
  {
    week: 6,
    day: 1,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 300 },
      { type: 'walk', durationSeconds: 180 },
      { type: 'run', durationSeconds: 480 },
      { type: 'walk', durationSeconds: 180 },
      { type: 'run', durationSeconds: 300 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },
  // Day 2: 10min run, 3min walk, 10min run
  {
    week: 6,
    day: 2,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 600 },
      { type: 'walk', durationSeconds: 180 },
      { type: 'run', durationSeconds: 600 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },
  // Day 3: 25min run
  {
    week: 6,
    day: 3,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 1500 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },

  // WEEK 7 — 25min run (all days)
  {
    week: 7,
    day: 1,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 1500 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },
  {
    week: 7,
    day: 2,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 1500 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },
  {
    week: 7,
    day: 3,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 1500 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },

  // WEEK 8 — 28min run (all days)
  {
    week: 8,
    day: 1,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 1680 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },
  {
    week: 8,
    day: 2,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 1680 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },
  {
    week: 8,
    day: 3,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 1680 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },

  // WEEK 9 — 30min run (all days)
  {
    week: 9,
    day: 1,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 1800 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },
  {
    week: 9,
    day: 2,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 1800 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },
  {
    week: 9,
    day: 3,
    intervals: [
      { type: 'warmup', durationSeconds: 300 },
      { type: 'run', durationSeconds: 1800 },
      { type: 'cooldown', durationSeconds: 300 },
    ],
  },
];

// Helper to find a workout by ID
export const getWorkoutById = (id: string): Workout | undefined => {
  const match = id.match(/W(\d+)D(\d+)/);
  if (!match) return undefined;

  const week = parseInt(match[1], 10);
  const day = parseInt(match[2], 10);

  return workouts.find(w => w.week === week && w.day === day);
};

// Calculate total workout duration
export const getTotalDuration = (workout: Workout): number => {
  return workout.intervals.reduce((sum, interval) => sum + interval.durationSeconds, 0);
};
