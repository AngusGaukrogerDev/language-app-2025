'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export const Navigation = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Grammar Lab</h1>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Welcome, {user?.name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}; 