'use client';

import { Navigation } from '@/components/Navigation';
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-900 text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Grammar Lab
              </h1>
              <p className="text-gray-600 mb-8">
                Your personal grammar learning dashboard
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Lessons Completed
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600">Start your first lesson</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Current Streak
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600">days</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Total Score
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600">points</p>
                </div>
              </div>
              
              <div className="mt-8">
                <button className="bg-gray-900 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors">
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