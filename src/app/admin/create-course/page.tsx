'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isUserAdmin, getLevels, createCourse } from '@/utils/appwrite';
import { Models } from 'appwrite';

interface LevelDocument extends Models.Document {
  title: string;
  description: string;
}

interface CourseFormData {
  title: string;
  description: string;
  level: string;
}

export default function CreateCoursePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [levels, setLevels] = useState<LevelDocument[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    level: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      checkAdminStatus();
    }
  }, [user, loading, router]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isAdmin) {
      loadLevels();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    try {
      const adminStatus = await isUserAdmin();
      setIsAdmin(adminStatus);
      
      if (!adminStatus) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      router.push('/dashboard');
    } finally {
      setCheckingAdmin(false);
    }
  };

  const loadLevels = async () => {
    try {
      const result = await getLevels();
      if (result.success && result.data) {
        setLevels(result.data as LevelDocument[]);
      }
    } catch (error) {
      console.error('Error loading levels:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'difficulty' || name === 'estimatedDuration' ? parseInt(value) || 0 : value
    }));
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.level) {
      alert('Please fill in all required fields');
      return;
    }

    setIsCreating(true);
    
    try {
      const result = await createCourse({
        title: formData.title,
        description: formData.description,
        level: formData.level,
        isActive: true,
      });

      if (result.success) {
        alert('Course created successfully!');
        router.push('/admin');
      } else {
        alert(`Failed to create course: ${result.error?.message}`);
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course');
    } finally {
      setIsCreating(false);
    }
  };

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <div className="text-gray-900 text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <main className="max-w-4xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Admin
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create New Course
            </h1>
            <p className="text-lg text-gray-600">
              Add a new course to the Grammar Lab curriculum
            </p>
          </div>

          {/* Course Creation Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
            <form onSubmit={handleCreateCourse} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  placeholder="Enter course title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                  placeholder="Enter course description"
                />
              </div>

              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                  Level *
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                >
                  <option value="" className="text-gray-500">Select a level</option>
                  {levels.map((level) => (
                    <option key={level.$id} value={level.$id} className="text-gray-900">
                      {level.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push('/admin')}
                  className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                >
                  {isCreating ? 'Creating...' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>

          {/* Help Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Course Creation Tips
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Choose a clear, descriptive title that indicates the learning objective</li>
              <li>• Write a detailed description explaining what students will learn</li>
              <li>• Set an appropriate difficulty level (1 = Beginner, 5 = Advanced)</li>
              <li>• Estimate the time needed to complete the course realistically</li>
              <li>• Add an image URL to make the course more visually appealing</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}