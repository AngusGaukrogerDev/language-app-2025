'use client';

import { useState } from 'react';
import { account } from '@/utils/appwrite';

export const AppwriteTest = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult('Testing connection...');
    
    try {
      // Test basic connection
      const result = await account.get();
      setTestResult(`✅ Connection successful! User: ${result.name || result.email}`);
    } catch (error: unknown) {
      // Handle expected authentication failures gracefully
      if (error && typeof error === 'object' && 'code' in error && error.code === 401) {
        setTestResult('ℹ️ Connection working - User not authenticated (this is normal)');
      } else if (error instanceof Error && error.message?.includes('missing scope')) {
        setTestResult('ℹ️ Connection working - User not authenticated (this is normal)');
      } else {
        console.error('Connection test error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setTestResult(`❌ Connection failed: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Appwrite Connection Test</h3>
      <button
        onClick={testConnection}
        disabled={loading}
        className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>
      {testResult && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-700">{testResult}</p>
        </div>
      )}
    </div>
  );
}; 