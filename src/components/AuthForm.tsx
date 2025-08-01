'use client';

import { useState } from 'react';
import { loginWithEmail, signupWithEmail, getCurrentUser } from '@/utils/appwrite';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      
      if (mode === 'login') {
        result = await loginWithEmail(email, password);
      } else {
        result = await signupWithEmail(email, password, name);
      }

      if (result.success) {
        if (mode === 'signup' && result.data && 'user' in result.data) {
          setUser(result.data.user);
          router.push('/dashboard');
        } else if (mode === 'login') {
          // For login, we need to get the user data after successful session creation
          const userResult = await getCurrentUser();
          if (userResult.success && userResult.data) {
            setUser(userResult.data);
            router.push('/dashboard');
          } else {
            setError('Failed to get user data after login');
          }
        }
      } else {
        setError(result.error?.message || 'An error occurred');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === 'login' ? 'Sign in to Grammar Lab' : 'Create your account'}
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {mode === 'signup' && (
              <div>
                <label htmlFor="name" className="sr-only">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${
                  mode === 'signup' ? '' : 'rounded-t-md'
                } focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm`}
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-gray-500 focus:border-gray-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Sign in' : 'Sign up'}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <Link
                href={mode === 'login' ? '/signup' : '/login'}
                className="font-medium text-gray-900 hover:text-gray-700"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}; 