import LessonCard from './LessonCard';

interface Lesson {
  $id: string;
  title: string;
  description?: string;
  isActive: boolean;
  course?: {
    $id: string;
    title: string;
  };
}

interface LessonsGridProps {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
  onLessonSelect?: (lessonId: string) => void;
  onRetry: () => void;
}

export default function LessonsGrid({ 
  lessons, 
  loading, 
  error, 
  onLessonSelect, 
  onRetry 
}: LessonsGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-900 text-lg">Loading lessons...</div>
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

  if (lessons.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 text-center">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">No Lessons Available</h3>
        <p className="text-blue-700">
          No active lessons have been set up for this course yet. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.$id}
          id={lesson.$id}
          title={lesson.title}
          description={lesson.description}
          progress={0} // Set to 0% as requested
          onSelect={onLessonSelect}
        />
      ))}
    </div>
  );
}