'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getLessons } from '@/utils/appwrite';
import LessonsGrid from '@/components/LessonsGrid';

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

export default function LessonsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const levelId = params.levelId as string;
  const courseId = params.courseId as string;
  
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseTitle, setCourseTitle] = useState<string>('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!user || !courseId) return;
      
      try {
        setLessonsLoading(true);
        setError(null);
        const result = await getLessons(courseId);
        
        if (result.success && result.data) {
          const lessonsData = result.data as unknown as Lesson[];
          setLessons(lessonsData);
          // Set course title from the first lesson if available
          if (lessonsData.length > 0 && lessonsData[0].course) {
            setCourseTitle(lessonsData[0].course.title);
          }
        } else {
          setError(result.error?.message || 'Failed to load lessons');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Error fetching lessons:', err);
      } finally {
        setLessonsLoading(false);
      }
    };

    fetchLessons();
  }, [user, courseId]);

  const handleLessonSelect = (lessonId: string) => {
    router.push(`/levels/${levelId}/courses/${courseId}/lessons/${lessonId}`);
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
                onClick={() => router.push(`/levels/${levelId}/courses`)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span className="text-lg">←</span>
              </button>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                {courseTitle ? `${courseTitle} Lessons` : 'Lessons'}
              </h1>
            </div>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl ml-8">
              Choose a lesson to start learning
            </p>
          </div>

          {/* Lessons Grid */}
          <LessonsGrid
            lessons={lessons}
            loading={lessonsLoading}
            error={error}
            onLessonSelect={handleLessonSelect}
            onRetry={handleRetry}
          />

          {/* Back to Courses */}
          <div className="mt-8 sm:mt-12 lg:mt-16">
            <button 
              onClick={() => router.push(`/levels/${levelId}/courses`)}
              className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 transition-colors text-sm sm:text-base"
            >
              <span className="text-lg">←</span>
              Back to Courses
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}