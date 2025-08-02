'use client';

import { Models } from 'appwrite';

interface CourseDocument extends Models.Document {
  title: string;
  description: string;
  level: string;
  difficulty: number;
  estimatedDuration: number;
  imageUrl?: string;
  isActive: boolean;
}

interface LevelDocument extends Models.Document {
  title: string;
  description: string;
}

interface AdminStatsProps {
  levels: LevelDocument[];
  courses: CourseDocument[];
}

export default function AdminStats({ levels, courses }: AdminStatsProps) {
  const activeCourses = courses.filter(course => course.isActive);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Total Levels
        </h3>
        <p className="text-3xl font-bold text-gray-900">{levels.length}</p>
        <p className="text-sm text-gray-600 mt-1">Learning levels available</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Total Courses
        </h3>
        <p className="text-3xl font-bold text-gray-900">{courses.length}</p>
        <p className="text-sm text-gray-600 mt-1">Courses in the system</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Active Courses
        </h3>
        <p className="text-3xl font-bold text-gray-900">{activeCourses.length}</p>
        <p className="text-sm text-gray-600 mt-1">Currently available to students</p>
      </div>
    </div>
  );
}