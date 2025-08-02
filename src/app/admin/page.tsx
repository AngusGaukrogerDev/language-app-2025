'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { isUserAdmin, getLevels, getCourses } from '@/utils/appwrite';
import { Models } from 'appwrite';
import AdminActions from '@/components/admin/AdminActions';
import CourseTable from '@/components/admin/CourseTable';
import AdminHeader from '@/components/admin/AdminHeader';

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

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [levels, setLevels] = useState<LevelDocument[]>([]);
  const [courses, setCourses] = useState<CourseDocument[]>([]);

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
      loadLevelsAndCourses();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    try {
      const adminStatus = await isUserAdmin();
      setIsAdmin(adminStatus);
      
      if (!adminStatus) {
        // Redirect non-admin users to regular dashboard
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      router.push('/dashboard');
    } finally {
      setCheckingAdmin(false);
    }
  };

  const loadLevelsAndCourses = async () => {
    try {
      const [levelsResult, coursesResult] = await Promise.all([
        getLevels(),
        getCourses('')
      ]);

      if (levelsResult.success && levelsResult.data) {
        setLevels(levelsResult.data as LevelDocument[]);
      }

      if (coursesResult.success && coursesResult.data) {
        setCourses(coursesResult.data as CourseDocument[]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
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
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          {/* Header */}
          <AdminHeader />

          {/* Admin Actions */}
          <div className="mb-8">
            <AdminActions />
          </div>
          {/* Course Management Table */}
          <CourseTable courses={courses} levels={levels} />
        </div>
      </main>
    </div>
  );
}