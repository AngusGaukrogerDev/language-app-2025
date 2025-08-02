import CourseCard from './CourseCard';

interface Course {
  $id: string;
  title: string;
  description?: string;
  isActive: boolean;
  grammarType?: {
    $id: string;
    name: string;
    slug: string;
    description?: string;
  };
  level?: {
    $id: string;
    code: string;
  };
}

interface CoursesGridProps {
  courses: Course[];
  loading: boolean;
  error: string | null;
  onCourseSelect: (courseId: string, courseTitle: string) => void;
  onRetry: () => void;
}

export default function CoursesGrid({ 
  courses, 
  loading, 
  error, 
  onCourseSelect, 
  onRetry 
}: CoursesGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-900 text-lg">Loading courses...</div>
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

  if (courses.length === 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 text-center">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">No Courses Available</h3>
        <p className="text-blue-700">
          No active courses have been set up for this level yet. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {courses.map((course) => (
        <CourseCard
          key={course.$id}
          id={course.$id}
          title={course.title}
          description={course.description}
          grammarType={course.grammarType}
          onSelect={onCourseSelect}
        />
      ))}
    </div>
  );
}