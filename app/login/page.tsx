'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setAuthUser } from '@/lib/auth';
import { Store, Lock, User, Loader } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [initMessage, setInitMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setAuthUser({
          id: result.data.id,
          username: result.data.username,
          role: result.data.role,
          name: result.data.name,
        });

        if (result.data.role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/user/search');
        }
      } else {
        setError(result.error || 'Invalid username or password');
      }
    } catch (error: any) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInitialize = async () => {
    setInitLoading(true);
    setInitMessage('');
    try {
      const response = await fetch('/api/init', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setInitMessage(`✅ ${data.message}`);
      } else {
        setInitMessage(`❌ Error: ${data.error}`);
      }
    } catch (error: any) {
      setInitMessage(`❌ Error: ${error.message}`);
    } finally {
      setInitLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Smart Store Locator
          </h1>
          <p className="text-gray-600">
            Find items in your store instantly 🔍
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Login to Continue
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Initialization Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 font-medium mb-3">
              First Time? Load Sample Data:
            </p>
            <button
              onClick={handleInitialize}
              disabled={initLoading}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {initLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                '📦 Initialize Database'
              )}
            </button>
            {initMessage && (
              <p className={`mt-2 text-sm ${initMessage.includes('✅') ? 'text-green-700' : 'text-red-700'}`}>
                {initMessage}
              </p>
            )}
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 font-medium mb-3">
              Account Credentials:
            </p>
            <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
              Use the admin or staff credentials created from the Admin Panel.
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Built with Next.js & Tailwind CSS 💙
        </p>
      </div>
    </div>
  );
}
