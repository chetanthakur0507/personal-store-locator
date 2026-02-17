'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthUser, isAdmin, clearAuthUser } from '@/lib/auth';
import {
  ArrowLeft,
  BarChart3,
  LogOut,
  Package,
  TrendingUp,
  Wallet,
  Loader,
} from 'lucide-react';
import Link from 'next/link';

interface SalesSummary {
  totalUnits: number;
  totalRevenue: number;
  totalOrders: number;
}

interface ItemSummary {
  itemName: string;
  totalUnits: number;
  totalRevenue: number;
}

interface DailyPoint {
  date: string;
  totalUnits: number;
  totalRevenue: number;
}

interface SaleRow {
  id: string;
  itemName: string;
  quantity: number;
  priceAtSale: number;
  totalAmount: number;
  soldAt: string;
}

interface SalesData {
  range: string;
  label: string;
  summary: SalesSummary;
  items: ItemSummary[];
  daily: DailyPoint[];
  sales: SaleRow[];
}

export default function SalesReportPage() {
  const router = useRouter();
  const [user, setUser] = useState(getAuthUser());
  const [range, setRange] = useState<'today' | 'yesterday' | 'last7'>('today');
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<SalesData | null>(null);

  const formatRupees = (amount: number) => {
    return `Rs ${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  const formatDate = (value: string) => {
    const date = new Date(value);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    const currentUser = getAuthUser();

    if (!currentUser || !isAdmin(currentUser)) {
      router.push('/login');
      return;
    }

    setUser(currentUser);
    fetchSales('today');
  }, [router]);

  const fetchSales = async (value: 'today' | 'yesterday' | 'last7') => {
    try {
      setLoading(true);
      const response = await fetch(`/api/sales?range=${value}`);
      const data = await response.json();
      if (data.success) {
        setSalesData(data.data);
      }
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRangeChange = (value: 'today' | 'yesterday' | 'last7') => {
    setRange(value);
    fetchSales(value);
  };

  const maxRevenue = useMemo(() => {
    if (!salesData?.daily?.length) return 1;
    return Math.max(...salesData.daily.map((d) => d.totalRevenue), 1);
  }, [salesData]);

  const maxUnits = useMemo(() => {
    if (!salesData?.daily?.length) return 1;
    return Math.max(...salesData.daily.map((d) => d.totalUnits), 1);
  }, [salesData]);

  const handleLogout = () => {
    clearAuthUser();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sales Report</h1>
                <p className="text-sm text-gray-500">Sold items and revenue insights</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/admin/reports"
                className="px-4 py-2 text-sm font-semibold text-[#FF9644] bg-[#FFF5E6] rounded-lg hover:bg-[#FFCE99]"
              >
                Inventory Reports
              </Link>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-[#FF9644] animate-spin" />
          </div>
        ) : salesData ? (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Range: {salesData.label}</h2>
                <p className="text-sm text-gray-500">View sales performance for selected period</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Filter</span>
                <select
                  value={range}
                  onChange={(e) => handleRangeChange(e.target.value as 'today' | 'yesterday' | 'last7')}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#FF9644] outline-none"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last7">Last 7 Days</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Units Sold</p>
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{salesData.summary.totalUnits}</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <Wallet className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">
                  {formatRupees(salesData.summary.totalRevenue)}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <Package className="w-5 h-5 text-[#FF9644]" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{salesData.summary.totalOrders}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Daily Revenue</h3>
                  <BarChart3 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex items-end gap-2 h-40">
                  {salesData.daily.map((point) => {
                    const height = (point.totalRevenue / maxRevenue) * 100;
                    return (
                      <div key={point.date} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-emerald-500 rounded-md transition"
                          style={{ height: `${height}%` }}
                          title={`${point.date}: ${formatRupees(point.totalRevenue)}`}
                        />
                        <span className="text-[11px] text-gray-500">
                          {point.date.slice(5)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Daily Units Sold</h3>
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex items-end gap-2 h-40">
                  {salesData.daily.map((point) => {
                    const height = (point.totalUnits / maxUnits) * 100;
                    return (
                      <div key={point.date} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full bg-blue-500 rounded-md transition"
                          style={{ height: `${height}%` }}
                          title={`${point.date}: ${point.totalUnits} units`}
                        />
                        <span className="text-[11px] text-gray-500">
                          {point.date.slice(5)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Sold Items</h3>
                {salesData.items.length === 0 ? (
                  <p className="text-sm text-gray-500">No sales in this range.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-2 font-semibold text-gray-700">Item</th>
                          <th className="text-right py-3 px-2 font-semibold text-gray-700">Units</th>
                          <th className="text-right py-3 px-2 font-semibold text-gray-700">Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesData.items.map((item) => (
                          <tr key={item.itemName} className="border-b border-gray-100">
                            <td className="py-3 px-2 text-gray-900 font-medium">{item.itemName}</td>
                            <td className="py-3 px-2 text-right text-gray-700">{item.totalUnits}</td>
                            <td className="py-3 px-2 text-right font-semibold text-emerald-700">
                              {formatRupees(item.totalRevenue)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h3>
                {salesData.sales.length === 0 ? (
                  <p className="text-sm text-gray-500">No sales in this range.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-2 font-semibold text-gray-700">Item</th>
                          <th className="text-right py-3 px-2 font-semibold text-gray-700">Qty</th>
                          <th className="text-right py-3 px-2 font-semibold text-gray-700">Total</th>
                          <th className="text-left py-3 px-2 font-semibold text-gray-700">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salesData.sales.map((sale) => (
                          <tr key={sale.id} className="border-b border-gray-100">
                            <td className="py-3 px-2 text-gray-900 font-medium">{sale.itemName}</td>
                            <td className="py-3 px-2 text-right text-gray-700">{sale.quantity}</td>
                            <td className="py-3 px-2 text-right font-semibold text-emerald-700">
                              {formatRupees(sale.totalAmount)}
                            </td>
                            <td className="py-3 px-2 text-sm text-gray-600">
                              {formatDate(sale.soldAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Failed to load sales report</p>
          </div>
        )}
      </div>
    </div>
  );
}
