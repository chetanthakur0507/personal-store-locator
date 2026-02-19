'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { 
  Search, 
  MapPin, 
  Package, 
  AlertCircle,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

interface Item {
  _id: string;
  name: string;
  category: string;
  floor: string;
  aisle: string;
  rack: string;
  shelf: string;
  quantity: number;
  price?: number;
  minStockLevel?: number;
  description?: string;
  image?: string;
  totalSoldUnits?: number;
}

export default function PublicSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [displayedItems, setDisplayedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllItems();
  }, []);

  const fetchAllItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/items');
      const data = await response.json();
      
      if (data.success) {
        setAllItems(data.data);
        setDisplayedItems(data.data);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Real-time search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        const filtered = allItems.filter(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setDisplayedItems(filtered);
      } else {
        setDisplayedItems(allItems);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, allItems]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF1] via-white to-[#FFF5E6]">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Home Button */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition hover:shadow-md"
            style={{ backgroundColor: '#FFBF78', color: '#7B4019' }}
          >
            ← Back to Home
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: '#FF7D29' }} />
            <input
              type="text"
              placeholder="Search for items by name, category, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg rounded-xl border-2 outline-none transition shadow-md"
              style={{ 
                borderColor: '#FFBF78',
                color: '#7B4019',
                backgroundColor: 'white'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#FF7D29';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 125, 41, 0.2)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#FFBF78';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
            />
          </div>
          <p className="text-center mt-3 text-sm" style={{ color: '#7B4019' }}>
            {searchQuery ? `Found ${displayedItems.length} item${displayedItems.length !== 1 ? 's' : ''}` : `Showing all ${allItems.length} items`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 mx-auto mb-4" style={{ borderBottomColor: '#FF7D29' }}></div>
            <p style={{ color: '#7B4019' }}>Loading items...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && displayedItems.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#FF7D29' }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#7B4019' }}>No items found</h3>
            <p style={{ color: '#7B4019' }}>Try searching with different keywords</p>
          </div>
        )}

        {/* Items Grid */}
        {!loading && displayedItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedItems.map((item) => {
              const inStock = item.quantity > (item.minStockLevel || 0);
              
              return (
                <Link
                  key={item._id}
                  href={`/item/${item._id}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:scale-[1.02]"
                  style={{ borderColor: '#FFBF78' }}
                >
                  {/* Item Image */}
                  <div className="h-48 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#FFBF78' }}>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="w-16 h-16" style={{ color: '#FF7D29' }} />
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="p-5">
                    {/* Category Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full" style={{ backgroundColor: '#FFBF78', color: '#7B4019' }}>
                        {item.category}
                      </span>
                      {item.totalSoldUnits && item.totalSoldUnits > 0 && (
                        <div className="flex items-center gap-1" style={{ color: '#FF7D29' }}>
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-xs font-semibold">{item.totalSoldUnits}</span>
                        </div>
                      )}
                    </div>

                    {/* Item Name */}
                    <h3 className="text-lg font-bold mb-2 line-clamp-1" style={{ color: '#7B4019' }}>
                      {item.name}
                    </h3>

                    {/* Description */}
                    {item.description && (
                      <p className="text-sm mb-3 line-clamp-2" style={{ color: '#7B4019', opacity: 0.8 }}>
                        {item.description}
                      </p>
                    )}

                    {/* Price */}
                    {item.price && item.price > 0 && (
                      <div className="mb-3">
                        <span className="text-2xl font-bold" style={{ color: '#FF7D29' }}>
                          ₹{item.price.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* Stock Status */}
                    <div className="flex items-center gap-2 mb-3">
                      {inStock ? (
                        <>
                          <CheckCircle className="w-4 h-4" style={{ color: '#FF7D29' }} />
                          <span className="text-sm font-semibold" style={{ color: '#FF7D29' }}>
                            In Stock ({item.quantity} units)
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4" style={{ color: '#FF7D29' }} />
                          <span className="text-sm font-semibold" style={{ color: '#FF7D29' }}>
                            Low Stock ({item.quantity} units)
                          </span>
                        </>
                      )}
                    </div>

                    {/* Location */}
                    <div className="pt-3 border-t" style={{ borderTopColor: '#FFBF78' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-4 h-4" style={{ color: '#FF7D29' }} />
                        <span className="text-sm font-semibold" style={{ color: '#7B4019' }}>Location</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div>
                          <p className="text-xs" style={{ color: '#7B4019', opacity: 0.7 }}>Floor</p>
                          <p className="text-sm font-bold" style={{ color: '#7B4019' }}>{item.floor}</p>
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: '#7B4019', opacity: 0.7 }}>Aisle</p>
                          <p className="text-sm font-bold" style={{ color: '#FF7D29' }}>{item.aisle}</p>
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: '#7B4019', opacity: 0.7 }}>Rack</p>
                          <p className="text-sm font-bold" style={{ color: '#FF7D29' }}>{item.rack}</p>
                        </div>
                        <div>
                          <p className="text-xs" style={{ color: '#7B4019', opacity: 0.7 }}>Shelf</p>
                          <p className="text-sm font-bold" style={{ color: '#FF7D29' }}>{item.shelf}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
