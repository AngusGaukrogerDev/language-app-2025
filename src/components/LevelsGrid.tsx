import LevelCard from './LevelCard';

interface Level {
  $id: string;
  code: string;
}

interface LevelsGridProps {
  levels: Level[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function LevelsGrid({ 
  levels, 
  loading, 
  error, 
  onRetry 
}: LevelsGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-900 text-lg">Loading levels...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
        <p className="text-red-700">{error}</p>
        <button 
          onClick={onRetry}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (levels.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 text-center">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">No Levels Available</h3>
        <p className="text-blue-700">
          No levels have been set up yet. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
      {levels.map((level) => (
        <LevelCard
          key={level.$id}
          id={level.$id}
          code={level.code}
        />
      ))}
    </div>
  );
}