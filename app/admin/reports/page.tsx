'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthUser, isAdmin, clearAuthUser } from '@/lib/auth';
import { 
  Store, 
  LogOut, 
  ArrowLeft,
  Package,
  AlertTriangle,
  BarChart3,
  TrendingDown,
  Loader
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
}

interface Stats {
  totalItems: number;
  totalStock: number;
  categories: Array<{ _id: string; count: number }>;
}

export default function ReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState(getAuthUser());
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [lowStockItems, setLowStockItems] = useState<Item[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getAuthUser();
    
    if (!currentUser || !isAdmin(currentUser)) {
      router.push('/login');
      return;
    }

    setUser(currentUser);
    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all items
      const itemsResponse = await fetch('/api/items');
      const itemsData = await itemsResponse.json();
      if (itemsData.success) {
        setAllItems(itemsData.data);
      }

      // Fetch low stock items
      const lowStockResponse = await fetch('/api/items/low-stock');
      const lowStockData = await lowStockResponse.json();
      if (lowStockData.success) {
        setLowStockItems(lowStockData.data);
      }

      // Fetch stats
      const statsResponse = await fetch('/api/stats');
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStats(statsData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Link 
                href="/admin/dashboard"
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-sm text-gray-500">Inventory insights and statistics</p>
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
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Total Items</p>
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.totalItems}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Total Stock</p>
                  <BarChart3 className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stats.totalStock}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Low Stock</p>
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <p className="text-3xl font-bold text-orange-600">{lowStockItems.length}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Categories</p>
                  <TrendingDown className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.categories.length}
                </p>
              </div>
            </div>

            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
              <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                  <h2 className="text-xl font-bold text-orange-900">
                    Low Stock Alert ({lowStockItems.length} items)
                  </h2>
                </div>
                <div className="grid gap-3">
                  {lowStockItems.map((item) => (
                    <div
                      key={item._id}
                      className="bg-white rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.floor} → {item.aisle} → {item.rack} → {item.shelf}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-orange-600">{item.quantity}</p>
                        <p className="text-xs text-gray-500">Min: {item.minStockLevel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category Breakdown */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Category Breakdown
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.categories.map((cat) => {
                  const percentage = ((cat.count / stats.totalItems) * 100).toFixed(1);
                  return (
                    <div key={cat._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-gray-900">{cat._id}</span>
                        <span className="text-sm font-bold text-blue-600">{cat.count} items</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{percentage}% of total</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* All Items Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                All Items Overview
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Item</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Quantity</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allItems.map((item) => (
                      <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium text-gray-900">{item.name}</td>
                        <td className="py-3 px-4 text-gray-600">{item.category}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {item.floor} / {item.aisle} / {item.rack} / {item.shelf}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.quantity <= (item.minStockLevel || 0) ? (
                            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                              In Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Failed to load reports</p>
          </div>
        )}
      </div>
    </div>
  );
}
