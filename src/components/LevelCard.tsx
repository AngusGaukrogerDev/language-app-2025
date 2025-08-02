import { useRouter } from 'next/navigation';

interface LevelCardProps {
  id: string;
  code: string;
}

export default function LevelCard({ id, code }: LevelCardProps) {
  const router = useRouter();
  
  const handleClick = () => {
    router.push(`/levels/${id}/courses`);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200 group"
    >
      <div className="text-center">
        {/* Level Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center group-hover:bg-gray-900 transition-colors">
          <span className="text-xl sm:text-2xl font-bold text-gray-600 group-hover:text-white transition-colors">
            {code.charAt(0).toUpperCase()}
          </span>
        </div>
        
        {/* Level Title */}
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
          Level {code.toUpperCase()}
        </h3>
        
        {/* Level Description */}
        <p className="text-sm text-gray-600 mb-4">
          Grammar exercises for {code.toLowerCase()} learners
        </p>
        
        {/* Start Button */}
        <button 
          onClick={handleClick}
          className="w-full bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Start Level
        </button>
      </div>
    </div>
  );
}