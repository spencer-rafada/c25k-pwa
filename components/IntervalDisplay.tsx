import { Interval } from '@/lib/workouts';

interface IntervalDisplayProps {
  interval: Interval;
  timeRemaining: number;
  formatTime: (seconds: number) => string;
}

const intervalColors: Record<string, { bg: string; text: string; label: string }> = {
  warmup: { bg: 'bg-blue-900', text: 'text-blue-300', label: 'Warm Up Walk' },
  run: { bg: 'bg-green-900', text: 'text-green-300', label: 'Run' },
  walk: { bg: 'bg-sky-900', text: 'text-sky-300', label: 'Walk' },
  cooldown: { bg: 'bg-purple-900', text: 'text-purple-300', label: 'Cool Down Walk' },
};

export default function IntervalDisplay({ interval, timeRemaining, formatTime }: IntervalDisplayProps) {
  const colors = intervalColors[interval.type];

  return (
    <div className={`${colors.bg} p-12 rounded-2xl w-full max-w-md text-center space-y-6`}>
      <div className={`${colors.text} text-2xl font-bold uppercase tracking-wide`}>
        {colors.label}
      </div>
      <div className="text-white text-8xl font-bold tabular-nums">
        {formatTime(timeRemaining)}
      </div>
    </div>
  );
}
