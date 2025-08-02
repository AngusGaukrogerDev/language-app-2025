'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export const Navigation = () => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-black border-b border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center min-w-0">
            <Link href={user ? "/dashboard" : "/"} className="flex items-center">
              <h1 className="text-lg sm:text-xl font-bold text-white truncate">Grammar Lab</h1>
            </Link>
          </div>
          
          {/* Only show user options when signed in */}
          {user && (
            <>
              {/* Desktop layout - hidden on mobile */}
              <div className="hidden sm:flex items-center space-x-4 min-w-0">
                <span className="text-sm text-gray-300 truncate">
                  Welcome, {user?.name || user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors whitespace-nowrap"
                >
                  Logout
                </button>
              </div>

              {/* Mobile dropdown - hidden on desktop */}
              <div className="relative sm:hidden">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center justify-center w-10 h-10 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={4}
                      d="M12 5v.01M12 12v.01M12 19v.01"
                    />
                  </svg>
                  <span className="sr-only">User menu</span>
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <>
                    {/* Backdrop to close dropdown when clicking outside */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={closeDropdown}
                      aria-hidden="true"
                    />
                    
                    <div className="absolute right-0 z-20 mt-2 w-64 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user?.name || user?.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}; 