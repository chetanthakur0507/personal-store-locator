'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthUser, isAdmin, clearAuthUser } from '@/lib/auth';
import { 
  Store, 
  LogOut, 
  Edit, 
  Trash2, 
  Search,
  Package,
  AlertCircle,
  ArrowLeft,
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
  description?: string;
}

export default function ManageItemsPage() {
  const router = useRouter();
  const [user, setUser] = useState(getAuthUser());
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const currentUser = getAuthUser();
    
    if (!currentUser || !isAdmin(currentUser)) {
      router.push('/login');
      return;
    }

    setUser(currentUser);
    fetchItems();
  }, [router]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/items');
      const data = await response.json();
      
      if (data.success) {
        setItems(data.data);
        setFilteredItems(data.data);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.data.map((item: Item) => item.category))];
        setCategories(uniqueCategories as string[]);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      alert('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = items;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  }, [searchQuery, selectedCategory, items]);

  const handleLogout = () => {
    clearAuthUser();
    router.push('/login');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const response = await fetch(`/api/items/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setItems(items.filter(item => item._id !== id));
          alert('Item deleted successfully!');
        } else {
          alert('Failed to delete item');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item');
      }
    }
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
                <h1 className="text-xl font-bold text-gray-900">Manage Items</h1>
                <p className="text-sm text-gray-500">View, edit, and delete items</p>
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
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9644] focus:border-transparent outline-none"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF9644] focus:border-transparent outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Add New Button */}
            <Link
              href="/admin/items/add"
              className="px-6 py-2.5 bg-[#FF9644] hover:bg-[#E67E00] text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              Add New Item
            </Link>
          </div>
        </div>

        {/* Items List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-[#FF9644] animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <span className="px-3 py-1 bg-[#FFCE99] text-[#562F00] text-xs font-medium rounded-full">
                        {item.category}
                      </span>
                      {item.quantity <= (item.minStockLevel || 0) && (
                        <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Low Stock
                        </span>
                      )}
                    </div>
                    
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    )}
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Floor:</span>
                        <span className="ml-2 font-medium text-gray-900">{item.floor}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Aisle:</span>
                        <span className="ml-2 font-medium text-gray-900">{item.aisle}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Rack:</span>
                        <span className="ml-2 font-medium text-gray-900">{item.rack}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Shelf:</span>
                        <span className="ml-2 font-medium text-gray-900">{item.shelf}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-4">
                      <div className="text-sm">
                        <span className="text-gray-500">Quantity:</span>
                        <span className="ml-2 font-bold text-lg text-green-600">{item.quantity}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Price:</span>
                        <span className="ml-2 font-semibold text-gray-900">₹{(item as any).price ?? 0}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Min Level: {item.minStockLevel || 0}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/items/edit/${item._id}`}
                      className="px-4 py-2 bg-[#FFF5E6] hover:bg-[#FFCE99] text-[#FF9644] rounded-lg transition flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
