'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthUser, clearAuthUser, isAdmin } from '@/lib/auth';
import { 
  Search, 
  MapPin, 
  Package, 
  AlertCircle,
  LogOut,
  CheckCircle,
  Store,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

interface Item {
  _id: string;
  name: string;
  category: string;
  floor: string;
  aisle: string;
  rack: string;
  shelf: string;
  quantity: number;
  minStockLevel?: number;
  description?: string;
}

export default function UserSearchPage() {
  const router = useRouter();
  const [user, setUser] = useState(getAuthUser());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = getAuthUser();
    
    if (!currentUser) {
      router.push('/login');
      return;
    }

    setUser(currentUser);
  }, [router]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/items?search=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthUser();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {isAdmin(user) ? 'Item Search' : 'Staff Search'}
                </h1>
                <p className="text-sm text-gray-500">Welcome, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin(user) && (
                <Link
                  href="/admin/dashboard"
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition text-sm font-medium"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-6 shadow-xl">
            <Search className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Find Any Item Instantly
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search by item name or category to locate items in your store
          </p>
        </div>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-3 border-2 border-gray-100">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search "USB Cable", "Mouse", "Notebook"...'
                  className="w-full pl-14 pr-4 py-4 text-lg border-none outline-none rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </form>

        {/* Search Results */}
        {hasSearched && (
          <div>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Searching...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                  No items found
                </h3>
                <p className="text-gray-500 text-lg">
                  Try searching with different keywords
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Found {searchResults.length} {searchResults.length === 1 ? 'item' : 'items'}
                  </h3>
                </div>

                <div className="grid gap-6">
                  {searchResults.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100 hover:border-blue-300 transition-all hover:shadow-xl"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Item Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-2xl font-bold text-gray-900">
                              {item.name}
                            </h3>
                            <span className="px-4 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                              {item.category}
                            </span>
                          </div>
                          
                          {item.description && (
                            <p className="text-gray-600 mb-4">{item.description}</p>
                          )}

                          {/* Stock Status */}
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              {item.quantity > (item.minStockLevel || 0) ? (
                                <>
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                  <span className="text-green-700 font-semibold">In Stock</span>
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="w-5 h-5 text-orange-500" />
                                  <span className="text-orange-700 font-semibold">Low Stock</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Package className="w-5 h-5 text-gray-400" />
                              <span className="text-gray-700 font-semibold">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-200">
                            <div className="flex items-center gap-2 mb-3">
                              <MapPin className="w-5 h-5 text-blue-600" />
                              <span className="font-semibold text-blue-900">
                                📍 Location
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              <div className="bg-white rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-500 mb-1">Floor</p>
                                <p className="font-bold text-gray-900">{item.floor}</p>
                              </div>
                              <div className="bg-white rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-500 mb-1">Aisle</p>
                                <p className="font-bold text-blue-600 text-lg">{item.aisle}</p>
                              </div>
                              <div className="bg-white rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-500 mb-1">Rack</p>
                                <p className="font-bold text-blue-600 text-lg">{item.rack}</p>
                              </div>
                              <div className="bg-white rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-500 mb-1">Shelf</p>
                                <p className="font-bold text-blue-600 text-lg">{item.shelf}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Tips (when no search) */}
        {!hasSearched && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                Quick Tips
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Search by exact item name (e.g., "HP Mouse")</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Search by category (e.g., "Electronics", "Stationery")</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Search is case-insensitive and supports partial matches</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
