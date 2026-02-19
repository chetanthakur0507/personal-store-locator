'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Package, MapPin, TrendingUp, Star, Zap, Flame } from 'lucide-react';

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
  image?: string;
  totalSoldUnits?: number;
  minStockLevel?: number;
  description?: string;
}

export default function BestOffersPage() {
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [trendingItems, setTrendingItems] = useState<Item[]>([]);
  const [newArrivals, setNewArrivals] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/items');
      const data = await response.json();
      
      if (data.success) {
        const items = data.data;
        setAllItems(items);
        
        // Trending items (with sales)
        const trending = items
          .filter((item: Item) => (item.totalSoldUnits || 0) > 0)
          .sort((a: Item, b: Item) => (b.totalSoldUnits || 0) - (a.totalSoldUnits || 0))
          .slice(0, 8);
        setTrendingItems(trending);
        
        // New arrivals (recently added - simulating with random selection for now)
        const shuffled = [...items].sort(() => 0.5 - Math.random());
        setNewArrivals(shuffled.slice(0, 6));
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItemCard = (item: Item, badgeIcon: any, badgeText: string, badgeColor: string) => (
    <Link
      key={item._id}
      href={`/item/${item._id}`}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:scale-[1.02] relative"
      style={{ borderColor: '#FFBF78' }}
    >
      {/* Badge */}
      <div 
        className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-white text-xs font-bold flex items-center gap-1 shadow-lg"
        style={{ backgroundColor: badgeColor }}
      >
        {badgeIcon}
        {badgeText}
      </div>

      <div className="h-48 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#FFBF78' }}>
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <Package className="w-16 h-16" style={{ color: '#FF7D29' }} />
        )}
      </div>

      <div className="p-5">
        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-2" style={{ backgroundColor: '#FFBF78', color: '#7B4019' }}>
          {item.category}
        </span>

        <h3 className="font-bold text-lg mb-2 line-clamp-2" style={{ color: '#7B4019' }}>
          {item.name}
        </h3>

        {item.description && (
          <p className="text-sm mb-3 line-clamp-2" style={{ color: '#7B4019', opacity: 0.7 }}>
            {item.description}
          </p>
        )}

        {item.price && item.price > 0 && (
          <div className="mb-3">
            <span className="text-2xl font-bold" style={{ color: '#FF7D29' }}>
              ₹{item.price.toFixed(2)}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1" style={{ color: '#7B4019', opacity: 0.7 }}>
            <MapPin className="w-4 h-4" />
            <span>Floor {item.floor}</span>
          </div>
          
          {item.totalSoldUnits && item.totalSoldUnits > 0 && (
            <div className="flex items-center gap-1" style={{ color: '#FF7D29' }}>
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold">{item.totalSoldUnits} sold</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF1] via-white to-[#FFF5E6]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
         
          
          <div className="text-center mt-6 mb-8">
            <div className="inline-block mb-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-xl" style={{ backgroundColor: '#FF9644' }}>
                <Star className="w-10 h-10 text-white" fill="white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-3" style={{ color: '#7B4019' }}>
              🎁 Best Offers & Deals
            </h1>
            <p className="text-lg" style={{ color: '#7B4019', opacity: 0.8 }}>
              Trending items aur best deals - sab ek jagah!
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto mb-4" style={{ borderBottomColor: '#FF7D29' }}></div>
            <p className="text-xl" style={{ color: '#7B4019' }}>Loading best offers...</p>
          </div>
        ) : (
          <>
            {/* Trending Items Section */}
            {trendingItems.length > 0 && (
              <div className="mb-12">
                <div className="bg-gradient-to-r from-[#FF9644] to-[#E67E00] rounded-2xl shadow-xl p-6 mb-6 text-white">
                  <div className="flex items-center gap-3">
                    <Flame className="w-8 h-8" />
                    <div>
                      <h2 className="text-3xl font-bold">🔥 Trending Now</h2>
                      <p className="text-sm opacity-90">Most popular items flying off the shelves!</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {trendingItems.map((item) => 
                    renderItemCard(
                      item, 
                      <Flame className="w-4 h-4" />, 
                      'Hot', 
                      '#EF4444'
                    )
                  )}
                </div>
              </div>
            )}

            {/* New Arrivals Section */}
            {newArrivals.length > 0 && (
              <div className="mb-12">
                <div className="bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] rounded-2xl shadow-xl p-6 mb-6 text-white">
                  <div className="flex items-center gap-3">
                    <Zap className="w-8 h-8" />
                    <div>
                      <h2 className="text-3xl font-bold">⚡ Fresh Picks</h2>
                      <p className="text-sm opacity-90">Naye items jo abhi store mein aaye hain</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {newArrivals.map((item) => 
                    renderItemCard(
                      item, 
                      <Zap className="w-4 h-4" />, 
                      'New', 
                      '#8B5CF6'
                    )
                  )}
                </div>
              </div>
            )}

            {/* Special Offers Banner */}
            <div className="bg-gradient-to-br from-[#FF9644] via-[#FFBF78] to-[#FFCE99] rounded-2xl shadow-2xl p-8 text-center">
              <Star className="w-16 h-16 mx-auto mb-4 text-white" fill="white" />
              <h3 className="text-3xl font-bold mb-3" style={{ color: '#562F00' }}>
                More Deals Coming Soon! 🎉
              </h3>
              <p className="text-lg mb-6" style={{ color: '#562F00' }}>
                Weekly offers aur seasonal discounts ke liye check karte raho
              </p>
              <Link
                href="/search"
                className="inline-block px-8 py-3 bg-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                style={{ color: '#FF9644' }}
              >
                Browse All Items →
              </Link>
            </div>

            {/* Empty State */}
            {trendingItems.length === 0 && newArrivals.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl shadow">
                <Package className="w-20 h-20 mx-auto mb-4" style={{ color: '#FF7D29' }} />
                <h3 className="text-2xl font-bold mb-2" style={{ color: '#7B4019' }}>
                  No Offers Available
                </h3>
                <p className="text-lg mb-6" style={{ color: '#7B4019', opacity: 0.7 }}>
                  Check back soon for exciting deals!
                </p>
                <Link
                  href="/search"
                  className="inline-block px-6 py-3 rounded-lg font-semibold transition"
                  style={{ backgroundColor: '#FF9644', color: 'white' }}
                >
                  Browse All Items
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
