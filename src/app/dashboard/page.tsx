'use client';

import { AppwriteTest } from '@/components/AppwriteTest';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

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
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Welcome to Grammar Lab
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                Your personal grammar learning dashboard
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Quick Stats */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    Lessons Completed
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600">Start your first lesson</p>
                </div>
                
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    Current Streak
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600">days</p>
                </div>
                
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 sm:col-span-2 lg:col-span-1">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    Total Score
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600">points</p>
                </div>
              </div>
              
              <div className="mt-6 sm:mt-8">
                <button 
                  onClick={() => router.push('/levels')}
                  className="bg-gray-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-md text-base sm:text-lg font-medium hover:bg-gray-800 transition-colors min-h-[44px]"
                >
                  Start Learning
                </button>
              </div>
            </div>
          </div>
          
          {/* Debug Section */}
          <div className="mt-8">
            <AppwriteTest />
          </div>
        </div>
      </main>
    </div>
  );
} 