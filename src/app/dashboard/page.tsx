'use client';

import { AppwriteTest } from '@/components/AppwriteTest';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { isUserAdmin } from '@/utils/appwrite';

function DashboardContent() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      checkAdminStatus();
    }
  }, [user, loading, router]); // eslint-disable-line react-hooks/exhaustive-deps

  const checkAdminStatus = async () => {
    try {
      // Check if admin explicitly wants to view student dashboard
      const forceStudentView = searchParams.get('view') === 'student';
      
      const adminStatus = await isUserAdmin();
      setIsAdmin(adminStatus);
      
      if (adminStatus && !forceStudentView) {
        // Redirect admin users to admin dashboard only if they haven't explicitly requested student view
        router.push('/admin');
        return;
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
    } finally {
      setCheckingAdmin(false);
    }
  };

  if (loading || checkingAdmin) {
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
          {/* Admin viewing student dashboard indicator */}
          {isAdmin && searchParams.get('view') === 'student' && (
            <div className="mb-4 bg-blue-100 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-800">
                      <strong>Admin Mode:</strong> You&apos;re viewing the student dashboard
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => router.push('/admin')}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Back to Admin
                </button>
              </div>
            </div>
          )}
          
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

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50">
        <div className="text-gray-900 text-lg">Loading...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
} 