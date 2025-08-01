'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Models } from 'appwrite';
import { getCurrentUser, logout } from '@/utils/appwrite';

interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  logout: () => Promise<void>;
  setUser: (user: Models.User<Models.Preferences> | null) => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      setError(null);
      const result = await getCurrentUser();
      if (result.success && result.data) {
        setUser(result.data);
      } else {
        // Not authenticated is not an error, just set user to null
        setUser(null);
      }
    } catch (error: any) {
      // Only set error for actual errors, not for expected "not authenticated" responses
      if (!error.message?.includes('Not authenticated')) {
        console.error('Error checking user:', error);
        setError(error.message || 'Failed to check authentication status');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setError(null);
      await logout();
      setUser(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if logout fails, clear the user state
      setUser(null);
      setError(error.message || 'Failed to logout');
    }
  };

  const value = {
    user,
    loading,
    logout: handleLogout,
    setUser,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 