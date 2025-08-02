'use client';

import { useRouter } from 'next/navigation';

export default function AdminActions() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Quick Actions
      </h2>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => router.push('/admin/create-course')}
          className="bg-gray-900 text-white px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Create New Course
        </button>
        <button
          onClick={() => router.push('/levels')}
          className="bg-gray-100 text-gray-900 px-6 py-3 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          View Learning Content
        </button>
        <button
          onClick={() => router.push('/dashboard?view=student')}
          className="bg-blue-100 text-blue-900 px-6 py-3 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
        >
          Switch to Student View
        </button>
      </div>
    </div>
  );
}