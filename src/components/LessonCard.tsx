interface LessonCardProps {
  id: string;
  title: string;
  description?: string;
  progress?: number; // Progress percentage (0-100)
  onSelect?: (lessonId: string) => void;
}

export default function LessonCard({ 
  id, 
  title, 
  description, 
  progress = 0,
  onSelect 
}: LessonCardProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(id);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="flex flex-col h-full">
        {/* Lesson Title */}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
          {title}
        </h3>
        
        {/* Lesson Description */}
        {description && (
          <p className="text-sm text-gray-600 mb-4 flex-grow overflow-hidden" style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}>
            {description}
          </p>
        )}
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            ></div>
          </div>
        </div>
        
        {/* Start/Continue Button */}
        <button className="w-full bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors group-hover:bg-gray-800 mt-auto">
          {progress > 0 ? 'Continue Lesson' : 'Start Lesson'}
        </button>
      </div>
    </div>
  );
}