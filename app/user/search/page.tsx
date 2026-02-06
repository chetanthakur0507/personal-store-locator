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
  TrendingUp,
  ShoppingCart,
  Flame
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
  image?: string;
  totalSoldUnits?: number;
  saleCount?: number;
  lastSoldAt?: string;
}

export default function UserSearchPage() {
  const router = useRouter();
  const [user, setUser] = useState(getAuthUser());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [trendingItems, setTrendingItems] = useState<Item[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [markingSold, setMarkingSold] = useState<string | null>(null);

  useEffect(() => {
    const currentUser = getAuthUser();
    
    if (!currentUser) {
      router.push('/login');
      return;
    }

    setUser(currentUser);
    fetchTrendingItems();
  }, [router]);

  const fetchTrendingItems = async () => {
    try {
      const response = await fetch('/api/items?trending=true&limit=6');
      const data = await response.json();
      
      if (data.success) {
        // Filter out items with no sales to show only trending items
        const trendy = data.data.filter((item: Item) => (item.totalSoldUnits || 0) > 0).slice(0, 6);
        setTrendingItems(trendy);
      }
    } catch (error) {
      console.error('Error fetching trending items:', error);
    } finally {
      setTrendingLoading(false);
    }
  };

  // Real-time search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setHasSearched(false);
      }
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/items?search=${encodeURIComponent(query)}`);
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;

    performSearch(searchQuery);
  };

  const handleMarkSold = async (itemId: string, currentQuantity: number) => {
    if (currentQuantity <= 0) {
      alert('No units available to mark as sold');
      return;
    }

    const quantityToSell = prompt('How many units sold?', '1');
    
    if (!quantityToSell) return;

    const quantity = parseInt(quantityToSell);
    if (isNaN(quantity) || quantity < 1) {
      alert('Please enter a valid number');
      return;
    }

    setMarkingSold(itemId);

    try {
      const response = await fetch(`/api/items/${itemId}/mark-sold`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        
        // Update search results if displayed
        if (hasSearched) {
          setSearchResults(
            searchResults.map((item) =>
              item._id === itemId ? data.data : item
            )
          );
        }

        // Update trending items
        setTrendingItems(
          trendingItems.map((item) =>
            item._id === itemId ? data.data : item
          )
        );
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error marking item as sold:', error);
      alert('Failed to mark item as sold');
    } finally {
      setMarkingSold(null);
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
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-3 border-2 border-gray-100">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Type to search... "USB", "Mouse", "Notebook"...'
                  className="w-full pl-14 pr-4 py-4 text-lg border-none outline-none rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className="px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                🔍
              </button>
            </div>
          </div>
        </form>

        {/* Search Results - Show First if Searching */}
        {hasSearched && (
          <div className="mb-12">
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

                          {/* Sales Stats */}
                          {(item.totalSoldUnits || 0) > 0 && (
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 mb-4 border border-green-200">
                              <p className="text-xs text-gray-600 mb-2">📊 <strong>Sales Info</strong></p>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="text-center">
                                  <p className="text-xs text-gray-600">Total Sold</p>
                                  <p className="font-bold text-green-600">{item.totalSoldUnits}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-xs text-gray-600">Times Sold</p>
                                  <p className="font-bold text-green-600">{item.saleCount}x</p>
                                </div>
                              </div>
                            </div>
                          )}

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

                          {/* Mark Sold Button */}
                          <button
                            onClick={() => handleMarkSold(item._id, item.quantity)}
                            disabled={markingSold === item._id || item.quantity === 0}
                            className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                          >
                            <ShoppingCart className="w-5 h-5" />
                            {markingSold === item._id ? 'Marking as Sold...' : 'Mark Item as Sold ✓'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Trending Items Section - Show Below Search Results */}
        {!hasSearched && !trendingLoading && trendingItems.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-8">
              <Flame className="w-7 h-7 text-orange-500" />
              <h2 className="text-3xl font-bold text-gray-900">🔥 Trending Now</h2>
              <span className="text-sm text-gray-500 ml-auto">Most popular items in your store</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {trendingItems.map((item) => (
                <div
                  key={item._id}
                  className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-orange-300 cursor-pointer flex flex-col"
                >
                  {/* Image Section */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-center">
                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">No Image</p>
                      </div>
                    )}
                    
                    {/* Trending Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      <Flame className="w-4 h-4" />
                      Trending
                    </div>

                    {/* Stock Status Badge */}
                    <div className="absolute bottom-3 left-3">
                      {item.quantity > (item.minStockLevel || 0) ? (
                        <span className="inline-flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                          <CheckCircle className="w-3 h-3" />
                          In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                          <AlertCircle className="w-3 h-3" />
                          Low Stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4 flex flex-col flex-1">
                    {/* Category */}
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-2 w-fit">
                      {item.category}
                    </span>

                    {/* Name */}
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {item.name}
                    </h3>

                    {/* Description */}
                    {item.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Sales Stats Box */}
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-3 mb-3 border border-orange-200">
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="border-r border-orange-200">
                          <p className="text-xs text-gray-600 font-medium">Sold</p>
                          <p className="text-xl font-bold text-orange-600">{item.totalSoldUnits || 0}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Times</p>
                          <p className="text-xl font-bold text-orange-600">{item.saleCount || 0}x</p>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Info */}
                    <div className="flex items-center justify-between mb-3 px-2 py-2 bg-gray-50 rounded-lg">
                      <span className="text-xs text-gray-600 font-medium">Available:</span>
                      <span className="text-sm font-bold text-gray-900">{item.quantity} units</span>
                    </div>

                    {/* Location Info */}
                    <div className="text-xs text-gray-600 mb-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="font-semibold text-blue-900 mb-1">📍 Location:</p>
                      <p className="leading-relaxed">
                        <strong>F</strong>{item.floor} • <strong>A</strong>{item.aisle} • <strong>R</strong>{item.rack} • <strong>S</strong>{item.shelf}
                      </p>
                    </div>

                    {/* Mark Sold Button */}
                    <button
                      onClick={() => handleMarkSold(item._id, item.quantity)}
                      disabled={markingSold === item._id || item.quantity === 0}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg mt-auto"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="text-sm">{markingSold === item._id ? 'Marking...' : 'Sold ✓'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <hr className="my-12 border-t-2" />
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
