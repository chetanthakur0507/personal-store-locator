'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { setAuthUser } from '@/lib/auth';
import { Store, Lock, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#FFFDF1' }}>
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg" style={{ backgroundColor: '#FF9644' }}>
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#562F00' }}>
            Smart Store Locator
          </h1>
          <p style={{ color: '#562F00' }}>
            Find items in your store instantly 🔍
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8" style={{ borderTop: '4px solid #FF9644' }}>
          <h2 className="text-2xl font-semibold mb-6" style={{ color: '#562F00' }}>
            Login to Continue
          </h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#562F00' }}>
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#FF9644' }} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 rounded-lg outline-none transition"
                  style={{ 
                    borderColor: '#FFCE99',
                    color: '#562F00'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#FF9644';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 150, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#FFCE99';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#562F00' }}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#FF9644' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 rounded-lg outline-none transition"
                  style={{ 
                    borderColor: '#FFCE99',
                    color: '#562F00'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#FF9644';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255, 150, 68, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#FFCE99';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="border-2 px-4 py-3 rounded-lg text-sm" style={{ 
                backgroundColor: '#ffe6e6',
                borderColor: '#FF9644',
                color: '#562F00'
              }}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              style={{ 
                backgroundColor: '#FF9644',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E68A3C'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF9644'}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t" style={{ borderTopColor: '#FFCE99' }}>
            <p className="text-sm font-medium mb-3" style={{ color: '#562F00' }}>
              Account Credentials:
            </p>
            <div className="p-3 rounded-lg text-xs" style={{ 
              backgroundColor: '#FFCE99',
              color: '#562F00'
            }}>
              Use the admin or staff credentials created from the Admin Panel.
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="mt-6">
            <Link 
              href="/" 
              className="block text-center px-4 py-2 rounded-lg font-semibold transition hover:shadow-md"
              style={{ backgroundColor: '#FFCE99', color: '#562F00' }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Footer */}
        
      </div>
    </div>
  );
}
