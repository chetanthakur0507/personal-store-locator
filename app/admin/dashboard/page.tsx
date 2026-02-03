'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthUser, isAdmin, clearAuthUser } from '@/lib/auth';
import { 
  Store, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  LogOut,
  Plus,
  Search,
  Settings,
  BarChart3,
  Loader
} from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalItems: number;
  totalStock: number;
  categories: Array<{ _id: string; count: number }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(getAuthUser());
  const [stats, setStats] = useState<Stats | null>(null);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getAuthUser();
    
    if (!currentUser || !isAdmin(currentUser)) {
      router.push('/login');
      return;
    }

    setUser(currentUser);
    fetchStats();
  }, [router]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const response = await fetch('/api/stats');
      const data = await response.json();
      
      console.log('Stats response:', data);
      
      if (data.success && data.data) {
        setStats(data.data);
      } else {
        console.error('Stats API failed:', data.error);
        // Set default stats to avoid null
        setStats({
          totalItems: 0,
          totalStock: 0,
          categories: []
        });
      }

      // Fetch low stock items
      try {
        const lowStockResponse = await fetch('/api/items/low-stock');
        const lowStockData = await lowStockResponse.json();
        
        if (lowStockData.success && lowStockData.data) {
          setLowStockCount(lowStockData.data.length);
        }
      } catch (lowStockError) {
        console.error('Error fetching low stock:', lowStockError);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default stats to show dashboard even if API fails
      setStats({
        totalItems: 0,
        totalStock: 0,
        categories: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthUser();
    router.push('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">Welcome, {user.name}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : stats ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Items */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalItems}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Items in inventory
                </p>
              </div>

              {/* Low Stock Alert */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Low Stock</p>
                    <p className="text-3xl font-bold text-orange-600 mt-2">{lowStockCount}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Items need restocking
                </p>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Categories</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {stats.categories.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  Product categories
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/admin/items/add"
                  className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition group"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Add Item</span>
                </Link>

                <Link
                  href="/admin/items"
                  className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition group"
                >
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Manage Items</span>
                </Link>

                <Link
                  href="/admin/reports"
                  className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition group"
                >
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Reports</span>
                </Link>

                <Link
                  href="/user/search"
                  className="flex flex-col items-center justify-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition group"
                >
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Search Items</span>
                </Link>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Category Breakdown
              </h2>
              <div className="space-y-3">
                {stats.categories.map((cat) => (
                  <div key={cat._id} className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">{cat._id}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(cat.count / stats.totalItems) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-600 w-8">
                        {cat.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Failed to load statistics</p>
          </div>
        )}
      </div>
    </div>
  );
}
