'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCourses } from '@/utils/appwrite';
import CoursesGrid from '@/components/CoursesGrid';

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

export default function CoursesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const levelId = params.levelId as string;
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [levelCode, setLevelCode] = useState<string>('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user || !levelId) return;
      
      try {
        setCoursesLoading(true);
        setError(null);
        const result = await getCourses(levelId);
        
        if (result.success) {
          setCourses(result.data);
          // Set level code from the first course if available
          if (result.data.length > 0 && result.data[0].level) {
            setLevelCode(result.data[0].level.code);
          }
        } else {
          setError(result.error?.message || 'Failed to load courses');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Error fetching courses:', err);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchCourses();
  }, [user, levelId]);

  const handleCourseSelect = (courseId: string, courseTitle: string) => {
    // TODO: Navigate to course lessons
    console.log('Selected course:', courseTitle, 'ID:', courseId);
  };

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <div className="text-gray-900 text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <main className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          {/* Header */}
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <div className="flex items-center gap-2 mb-2">
              <button 
                onClick={() => router.push('/levels')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span className="text-lg">←</span>
              </button>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                {levelCode ? `Level ${levelCode.toUpperCase()} Courses` : 'Courses'}
              </h1>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl ml-8">
              Choose a course to start learning grammar concepts
            </p>
          </div>

          {/* Courses Grid */}
          <CoursesGrid
            courses={courses}
            loading={coursesLoading}
            error={error}
            onCourseSelect={handleCourseSelect}
            onRetry={handleRetry}
          />

          {/* Back to Levels */}
          <div className="mt-8 sm:mt-12 lg:mt-16">
            <button 
              onClick={() => router.push('/levels')}
              className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 transition-colors text-sm sm:text-base"
            >
              <span className="text-lg">←</span>
              Back to Levels
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}