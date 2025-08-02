'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getLevels } from '@/utils/appwrite';
import LevelsGrid from '@/components/LevelsGrid';

interface Level {
  $id: string;
  code: string;
}

export default function LevelsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [levels, setLevels] = useState<Level[]>([]);
  const [levelsLoading, setLevelsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchLevels = async () => {
      if (!user) return;
      
      try {
        setLevelsLoading(true);
        const result = await getLevels();
        
        if (result.success) {
          setLevels(result.data);
        } else {
          setError(result.error?.message || 'Failed to load levels');
        }
      } catch (err) {
        setError('An unexpected error occurred');
        console.error('Error fetching levels:', err);
      } finally {
        setLevelsLoading(false);
      }
    };

    fetchLevels();
  }, [user]);

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
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
              Choose Your Level
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl">
              Select a difficulty level to start your grammar learning journey
            </p>
          </div>

          {/* Levels Grid */}
          <LevelsGrid
            levels={levels}
            loading={levelsLoading}
            error={error}
            onLevelSelect={() => {}} // Not used since LevelCard handles navigation directly
            onRetry={handleRetry}
          />

          {/* Back to Dashboard */}
          <div className="mt-8 sm:mt-12 lg:mt-16">
            <button 
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 transition-colors text-sm sm:text-base"
            >
              <span className="text-lg">←</span>
              Back to Dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}