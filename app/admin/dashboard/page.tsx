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
  Loader,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalItems: number;
  totalStock: number;
  categories: Array<{ _id: string; count: number }>;
  dailySoldUnits: number;
  dailyRevenue: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(getAuthUser());
  const [menuOpen, setMenuOpen] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [staffUsers, setStaffUsers] = useState<any[]>([]);
  const [staffForm, setStaffForm] = useState({ name: '', username: '', password: '' });
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [adminForm, setAdminForm] = useState({ name: '', username: '', password: '', currentPassword: '' });
  const [staffMessage, setStaffMessage] = useState('');
  const [adminMessage, setAdminMessage] = useState('');
  const [staffLoading, setStaffLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [salesRange, setSalesRange] = useState<'today' | 'yesterday' | 'last7'>('today');

  const formatRupees = (amount: number) => {
    return `Rs ${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  const salesRangeLabel =
    salesRange === 'yesterday' ? 'Yesterday' : salesRange === 'last7' ? 'Last 7 Days' : 'Today';

  useEffect(() => {
    const currentUser = getAuthUser();
    
    if (!currentUser || !isAdmin(currentUser)) {
      router.push('/login');
      return;
    }

    setUser(currentUser);
    setAdminForm({
      name: currentUser.name || 'Admin',
      username: currentUser.username || '',
      password: '',
      currentPassword: '',
    });
    fetchStats('today');
    fetchStaff();
  }, [router]);

  const fetchStats = async (range: 'today' | 'yesterday' | 'last7') => {
    try {
      setLoading(true);
      
      // Fetch stats
      const response = await fetch(`/api/stats?range=${range}`);
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
          categories: [],
          dailySoldUnits: 0,
          dailyRevenue: 0,
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
        categories: [],
        dailySoldUnits: 0,
        dailyRevenue: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRangeChange = (value: 'today' | 'yesterday' | 'last7') => {
    setSalesRange(value);
    fetchStats(value);
  };

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      if (data.success) {
        setStaffUsers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleStaffCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffLoading(true);
    setStaffMessage('');

    try {
      const isEditing = Boolean(editingStaffId);
      const response = await fetch(
        isEditing ? `/api/users/${editingStaffId}` : '/api/users',
        {
          method: isEditing ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(staffForm),
        }
      );

      const data = await response.json();
      if (response.ok && data.success) {
        setStaffMessage(isEditing ? '✅ Staff updated' : '✅ Staff account created');
        setStaffForm({ name: '', username: '', password: '' });
        setEditingStaffId(null);
        fetchStaff();
      } else {
        setStaffMessage(`❌ ${data.error || 'Failed to create staff'}`);
      }
    } catch (error: any) {
      setStaffMessage(`❌ ${error.message}`);
    } finally {
      setStaffLoading(false);
    }
  };

  const handleStaffEdit = (staff: any) => {
    // Prevent editing admin users through staff form
    if (staff.role === 'admin') {
      setStaffMessage('❌ Admin accounts can only be edited via Admin Credentials section');
      setTimeout(() => setStaffMessage(''), 3000);
      return;
    }
    
    setEditingStaffId(staff.id);
    setStaffForm({ name: staff.name, username: staff.username, password: '' });
    setStaffMessage('');
    setShowStaffForm(true); // Auto-expand the form when editing
  };

  const handleStaffDelete = async (staffId: string) => {
    const confirmDelete = window.confirm('Delete this staff account?');
    if (!confirmDelete) {
      return;
    }

    setStaffLoading(true);
    setStaffMessage('');
    try {
      const response = await fetch(`/api/users/${staffId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setStaffMessage('✅ Staff deleted');
        if (editingStaffId === staffId) {
          setEditingStaffId(null);
          setStaffForm({ name: '', username: '', password: '' });
        }
        fetchStaff();
      } else {
        setStaffMessage(`❌ ${data.error || 'Failed to delete staff'}`);
      }
    } catch (error: any) {
      setStaffMessage(`❌ ${error.message}`);
    } finally {
      setStaffLoading(false);
    }
  };

  const handleStaffCancelEdit = () => {
    setEditingStaffId(null);
    setStaffForm({ name: '', username: '', password: '' });
    setStaffMessage('');
  };

  const handleAdminUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoading(true);
    setAdminMessage('');

    try {
      const response = await fetch('/api/users/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminForm),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setAdminMessage('✅ Admin credentials updated');
        setAdminForm({
          name: data.data.name,
          username: data.data.username,
          password: '',
          currentPassword: '',
        });
      } else {
        setAdminMessage(`❌ ${data.error || 'Failed to update admin'}`);
      }
    } catch (error: any) {
      setAdminMessage(`❌ ${error.message}`);
    } finally {
      setAdminLoading(false);
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
              <div className="w-10 h-10 bg-[#FF9644] rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                <p className="text-sm text-gray-500">Welcome, {user.name}</p>
              </div>
            </div>
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
              
              {/* Desktop Buttons */}
              <div className="hidden lg:flex items-center gap-2">
                <Link
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 bg-[#FFF5E6] hover:bg-[#FFCE99] text-[#FF9644] rounded-lg transition font-medium"
                >
                  🏠 Home
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-gray-50 border-t border-gray-200 px-4 py-4">
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#FF9644] hover:bg-[#FFF5E6] rounded-lg transition font-semibold"
              >
                🏠 Home
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
            </div>
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-[#FF9644] animate-spin" />
          </div>
        ) : stats ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Total Items */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalItems}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#FFCE99] rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 text-[#FF9644]" />
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

            {/* Daily Sales */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-3">
              <h2 className="text-lg font-semibold text-gray-900">Sales Snapshot</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Range</span>
                <select
                  value={salesRange}
                  onChange={(e) => handleRangeChange(e.target.value as 'today' | 'yesterday' | 'last7')}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#FF9644] outline-none"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="last7">Last 7 Days</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Sold Units ({salesRangeLabel})</p>
                    <p className="text-3xl font-bold text-blue-700 mt-2">
                      {stats.dailySoldUnits}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-700" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">Units sold in this range</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Revenue ({salesRangeLabel})</p>
                    <p className="text-3xl font-bold text-emerald-700 mt-2">
                      {formatRupees(stats.dailyRevenue)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-emerald-700" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4">Revenue earned in this range</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Link
                  href="/admin/items/add"
                  className="flex flex-col items-center justify-center p-4 bg-[#FFF5E6] hover:bg-[#FFCE99] rounded-lg transition group"
                >
                  <div className="w-12 h-12 bg-[#FF9644] rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Add Item</span>
                </Link>

                <Link
                  href="/admin/items"
                  className="flex flex-col items-center justify-center p-4 bg-[#FFF5E6] hover:bg-[#FFCE99] rounded-lg transition group"
                >
                  <div className="w-12 h-12 bg-[#E67E00] rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition">
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
                  className="flex flex-col items-center justify-center p-4 bg-[#FFF5E6] hover:bg-[#FFCE99] rounded-lg transition group"
                >
                  <div className="w-12 h-12 bg-[#FF9644] rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition">
                    <Search className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Search Items</span>
                </Link>

                <Link
                  href="/admin/sales-report"
                  className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition group"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Sales Report</span>
                </Link>
              </div>
            </div>

            {/* Admin & Staff Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Admin Credentials Section */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <button
                  onClick={() => setShowAdminForm(!showAdminForm)}
                  className="w-full flex items-center justify-between mb-4"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#FF9644]" />
                    <h2 className="text-lg font-semibold text-gray-900">Admin Credentials</h2>
                  </div>
                  <span className={`text-2xl transition-transform ${showAdminForm ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {showAdminForm && (
                  <form onSubmit={handleAdminUpdate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={adminForm.name}
                        onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Admin name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input
                        type="text"
                        value={adminForm.username}
                        onChange={(e) => setAdminForm({ ...adminForm, username: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Admin username"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Admin Password</label>
                      <input
                        type="password"
                        value={adminForm.currentPassword}
                        onChange={(e) => setAdminForm({ ...adminForm, currentPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter current password"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        value={adminForm.password}
                        onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="New password"
                        required
                      />
                    </div>
                    {adminMessage && (
                      <p className={`text-sm ${adminMessage.includes('✅') ? 'text-green-700' : 'text-red-700'}`}>
                        {adminMessage}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={adminLoading}
                      className="w-full bg-[#FF9644] hover:bg-[#E67E00] text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                    >
                      {adminLoading ? 'Saving...' : 'Save Admin Credentials'}
                    </button>
                  </form>
                )}
              </div>

              {/* Create Staff Section */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <button
                  onClick={() => setShowStaffForm(!showStaffForm)}
                  className="w-full flex items-center justify-between mb-4"
                >
                  <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      {editingStaffId ? 'Edit Staff Account' : 'Create Staff Account'}
                    </h2>
                  </div>
                  <span className={`text-2xl transition-transform ${showStaffForm ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {/* Show messages even when form is collapsed */}
                {staffMessage && !showStaffForm && (
                  <p className={`text-sm mb-4 ${staffMessage.includes('✅') ? 'text-green-700' : staffMessage.includes('ℹ️') ? 'text-[#FF9644]' : 'text-red-700'}`}>
                    {staffMessage}
                  </p>
                )}

                {showStaffForm && (
                  <form onSubmit={handleStaffCreate} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={staffForm.name}
                        onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Staff name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input
                        type="text"
                        value={staffForm.username}
                        onChange={(e) => setStaffForm({ ...staffForm, username: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Staff username"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        value={staffForm.password}
                        onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder={editingStaffId ? 'Leave blank to keep current password' : 'Staff password'}
                        required={!editingStaffId}
                      />
                    </div>
                    {staffMessage && (
                      <p className={`text-sm ${staffMessage.includes('✅') ? 'text-green-700' : 'text-red-700'}`}>
                        {staffMessage}
                      </p>
                    )}
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={staffLoading}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-50"
                      >
                        {staffLoading
                          ? editingStaffId
                            ? 'Saving...'
                            : 'Creating...'
                          : editingStaffId
                            ? 'Save Changes'
                            : 'Create Staff Account'}
                      </button>
                      {editingStaffId && (
                        <button
                          type="button"
                          onClick={handleStaffCancelEdit}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Staff List */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">User Accounts</h2>
              {staffUsers.length === 0 ? (
                <p className="text-sm text-gray-500">No staff accounts yet.</p>
              ) : (
                <div className="divide-y divide-gray-100">
                  {staffUsers.map((staff) => (
                    <div key={staff.id} className="py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{staff.name}</p>
                        <p className="text-xs text-gray-500">@{staff.username}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          staff.role === 'admin' 
                            ? 'bg-[#FFCE99] text-[#562F00] font-semibold' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {staff.role === 'admin' ? 'Store Owner' : staff.role}
                        </span>
                        {staff.role === 'admin' ? (
                          <button
                            onClick={() => {
                              setShowAdminForm(true);
                              setStaffMessage('ℹ️ Use Admin Credentials section to edit owner account');
                              setTimeout(() => setStaffMessage(''), 3000);
                            }}
                            className="text-xs px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                          >
                            Edit in Admin Section
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStaffEdit(staff)}
                              className="text-xs px-3 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleStaffDelete(staff.id)}
                              className="text-xs px-3 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                              className="bg-[#FF9644] h-2 rounded-full"
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
