interface CourseCardProps {
  id: string;
  title: string;
  description?: string;
  grammarType?: {
    name: string;
    slug: string;
    description?: string;
  };
  onSelect: (courseId: string, courseTitle: string) => void;
}

export default function CourseCard({ 
  id, 
  title, 
  description, 
  grammarType, 
  onSelect 
}: CourseCardProps) {
  const handleClick = () => {
    onSelect(id, title);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200 cursor-pointer group"
      onClick={handleClick}
    >
      <div className="flex flex-col h-full">
        {/* Grammar Type Badge */}
        {grammarType && (
          <div className="mb-3">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {grammarType.name}
            </span>
          </div>
        )}
        
        {/* Course Title */}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
          {title}
        </h3>
        
        {/* Course Description */}
        {description && (
          <p className="text-sm text-gray-600 mb-4 flex-grow overflow-hidden" style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}>
            {description}
          </p>
        )}
        
        {/* Grammar Type Description */}
        {grammarType?.description && !description && (
          <p className="text-sm text-gray-600 mb-4 flex-grow overflow-hidden" style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}>
            {grammarType.description}
          </p>
        )}
        
        {/* Start Button */}
        <button className="w-full bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors group-hover:bg-gray-800 mt-auto">
          Start Course
        </button>
      </div>
    </div>
  );
}