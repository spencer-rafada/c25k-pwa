import ProgressTracker from '@/components/ProgressTracker';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-green-500">C25K</h1>
          <p className="text-zinc-400">Couch to 5K Training Program</p>
        </div>

        <ProgressTracker />
      </main>
    </div>
  );
}
