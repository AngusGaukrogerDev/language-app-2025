'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getLesson } from '@/utils/appwrite';

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

export default function LessonPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const levelId = params.levelId as string;
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessonLoading, setLessonLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!user || !lessonId) return;
      
      try {
        setLessonLoading(true);
        setError(null);
        const result = await getLesson(lessonId);
        
        if (result.success && result.data) {
          const lessonData = result.data as unknown as Lesson;
          setLesson(lessonData);
        } else {
          setError(result.error?.message || 'Failed to load lesson');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Error fetching lesson:', err);
      } finally {
        setLessonLoading(false);
      }
    };

    fetchLesson();
  }, [user, lessonId]);

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading || lessonLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <div className="text-gray-900 text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
        <main className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
              <p className="text-red-700">{error}</p>
              <button 
                onClick={handleRetry}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
            
            {/* Back to Lessons */}
            <div className="mt-8">
              <button 
                onClick={() => router.push(`/levels/${levelId}/courses/${courseId}/lessons`)}
                className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 transition-colors text-sm sm:text-base"
              >
                <span className="text-lg">←</span>
                Back to Lessons
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <div className="text-gray-900 text-lg">Lesson not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <main className="max-w-4xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          {/* Header */}
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <div className="flex items-center gap-2 mb-4">
              <button 
                onClick={() => router.push(`/levels/${levelId}/courses/${courseId}/lessons`)}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <span className="text-lg">←</span>
              </button>
              <nav className="text-sm text-gray-600 flex items-center gap-2">
                <button 
                  onClick={() => router.push(`/levels/${levelId}/courses/${courseId}/lessons`)}
                  className="hover:text-gray-900 transition-colors"
                >
                  Lessons
                </button>
                <span>→</span>
                <span className="text-gray-900 font-medium">{lesson.title}</span>
              </nav>
            </div>
          </div>

          {/* Lesson Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
            {/* Lesson Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              {lesson.title}
            </h1>
            
            {/* Lesson Description */}
            {lesson.description && (
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {lesson.description}
                </p>
              </div>
            )}

            {/* Course Info */}
            {lesson.course && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Part of: <span className="font-medium text-gray-900">{lesson.course.title}</span>
                </p>
              </div>
            )}

            {/* Placeholder for lesson content */}
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Lesson Content</h3>
              <p className="text-blue-700">
                Lesson content will be added here in future updates. This could include interactive exercises, 
                videos, text content, quizzes, and more.
              </p>
            </div>
          </div>

          {/* Back to Lessons */}
          <div className="mt-8 sm:mt-12 lg:mt-16">
            <button 
              onClick={() => router.push(`/levels/${levelId}/courses/${courseId}/lessons`)}
              className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 transition-colors text-sm sm:text-base"
            >
              <span className="text-lg">←</span>
              Back to Lessons
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}