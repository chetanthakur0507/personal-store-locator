'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAuthUser, clearAuthUser, isAdmin } from '@/lib/auth';
import { LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(getAuthUser());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  const handleLogout = () => {
    clearAuthUser();
    setUser(null);
    router.push('/login');
  };

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3 sm:py-6">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="h-10 w-10 rounded-xl bg-[#FF9644] text-white flex items-center justify-center font-bold shadow-lg shadow-[#FFCE99]">
            SM
          </div>
          <div className="hidden sm:block">
            <p className="text-lg font-semibold text-gray-900">Sahara Mart</p>
            <p className="text-xs text-gray-500">Daily Needs • Fresh • Grocery</p>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-gray-900 transition">Home</Link>
          <Link href="/categories" className="hover:text-gray-900 transition">Categories</Link>
          <Link href="/offers" className="hover:text-gray-900 transition">Best Offers</Link>
          <Link href="/store-map" className="hover:text-gray-900 transition">Store View</Link>
        </div>
        
        {/* Right Section - Buttons and Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition"
            title="Menu"
          >
            {menuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>

          {user ? (
            <div className="hidden lg:flex items-center gap-1 sm:gap-2">
              <Link
                href={isAdmin(user) ? '/admin/dashboard' : '/user/search'}
                className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg bg-blue-600 px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow hover:bg-blue-700 transition whitespace-nowrap"
                title="Go to Dashboard"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-1 sm:gap-2 rounded-lg bg-red-600 px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow hover:bg-red-700 transition whitespace-nowrap"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden lg:block rounded-lg bg-[#FF9644] px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow hover:bg-[#E67E00] transition whitespace-nowrap"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-gray-50 border-t border-gray-200 px-4 py-4">
          <div className="flex flex-col gap-3">
            <Link 
              href="/" 
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition"
            >
              🏠 Home
            </Link>
            <Link 
              href="/categories" 
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition"
            >
              📁 Categories
            </Link>
            <Link 
              href="/offers" 
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition"
            >
              🎁 Best Offers
            </Link>
            <Link 
              href="/store-map" 
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition"
            >
              🏪 Store View
            </Link>
            
            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>
            
            {/* User Actions */}
            {user ? (
              <>
                <Link
                  href={isAdmin(user) ? '/admin/dashboard' : '/user/search'}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition font-semibold"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-semibold text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 text-sm text-white bg-[#FF9644] hover:bg-[#E67E00] rounded-lg transition font-semibold text-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
