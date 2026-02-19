'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Package, MapPin, TrendingUp } from 'lucide-react';

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
}

const categoryData = [
  {
    name: 'Fresh Produce',
    description: 'Fruits, vegetables, herbs & greens',
    color: '#4ADE80',
    image: 'https://plus.unsplash.com/premium_photo-1664527305901-a3c8bec62850?w=600&auto=format&fit=crop&q=60'
  },
  {
    name: 'Dairy & Bakery',
    description: 'Milk, paneer, butter, breads',
    color: '#FBBF24',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=900&auto=format&fit=crop'
  },
  {
    name: 'Grocery & Staples',
    description: 'Rice, flour, pulses, spices',
    color: '#F97316',
    image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?q=80&w=900&auto=format&fit=crop'
  },
  {
    name: 'Snacks & Beverages',
    description: 'Chips, biscuits, juices, tea',
    color: '#EC4899',
    image: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?q=80&w=900&auto=format&fit=crop'
  },
  {
    name: 'Personal Care',
    description: 'Shampoo, soaps, skincare',
    color: '#8B5CF6',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=900&auto=format&fit=crop'
  },
  {
    name: 'Home Care',
    description: 'Cleaners, detergents, tools',
    color: '#06B6D4',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=900&auto=format&fit=crop'
  }
];

export default function CategoriesPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/items');
      const data = await response.json();
      
      if (data.success) {
        setItems(data.data);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedItems = items.reduce((acc, item) => {
    const cat = item.category;
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, Item[]>);

  const filteredItems = selectedCategory 
    ? groupedItems[selectedCategory] || []
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF1] via-white to-[#FFF5E6]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          
          
          <div className="text-center mt-6">
            <h1 className="text-4xl font-bold mb-3" style={{ color: '#7B4019' }}>
              📦 Shop by Categories
            </h1>
            <p className="text-lg" style={{ color: '#7B4019', opacity: 0.8 }}>
              Har category mein kya kya milta hai, dekho aur select karo
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categoryData.map((category) => {
            const itemCount = groupedItems[category.name]?.length || 0;
            
            return (
              <div
                key={category.name}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.name ? null : category.name
                )}
                className="cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
                style={{ 
                  boxShadow: selectedCategory === category.name ? `0 0 0 4px ${category.color}` : undefined
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-2xl font-bold">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.description}</p>
                  </div>
                </div>
                
                <div className="bg-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5" style={{ color: category.color }} />
                    <span className="font-semibold" style={{ color: '#7B4019' }}>
                      {itemCount} items
                    </span>
                  </div>
                  <button
                    className="px-4 py-2 rounded-lg text-white font-semibold transition"
                    style={{ backgroundColor: category.color }}
                  >
                    {selectedCategory === category.name ? 'Hide' : 'View'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Category Items */}
        {selectedCategory && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6" style={{ borderTop: '4px solid #FF9644' }}>
              <h2 className="text-3xl font-bold mb-2" style={{ color: '#7B4019' }}>
                {selectedCategory}
              </h2>
              <p className="text-lg" style={{ color: '#7B4019', opacity: 0.7 }}>
                {filteredItems.length} items available
              </p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 mx-auto mb-4" style={{ borderBottomColor: '#FF7D29' }}></div>
                <p style={{ color: '#7B4019' }}>Loading items...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow">
                <Package className="w-16 h-16 mx-auto mb-4" style={{ color: '#FF7D29' }} />
                <p className="text-xl font-semibold" style={{ color: '#7B4019' }}>
                  No items found in this category
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <Link
                    key={item._id}
                    href={`/item/${item._id}`}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:scale-[1.02]"
                    style={{ borderColor: '#FFBF78' }}
                  >
                    <div className="h-40 flex items-center justify-center overflow-hidden" style={{ backgroundColor: '#FFBF78' }}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-12 h-12" style={{ color: '#FF7D29' }} />
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 line-clamp-1" style={{ color: '#7B4019' }}>
                        {item.name}
                      </h3>

                      {item.price && item.price > 0 && (
                        <div className="mb-2">
                          <span className="text-xl font-bold" style={{ color: '#FF7D29' }}>
                            ₹{item.price.toFixed(2)}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm mb-2" style={{ color: '#7B4019', opacity: 0.7 }}>
                        <MapPin className="w-4 h-4" />
                        <span>Floor {item.floor} • Aisle {item.aisle}</span>
                      </div>

                      {item.totalSoldUnits && item.totalSoldUnits > 0 && (
                        <div className="flex items-center gap-1 text-sm" style={{ color: '#FF7D29' }}>
                          <TrendingUp className="w-4 h-4" />
                          <span className="font-semibold">{item.totalSoldUnits} sold</span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!selectedCategory && (
          <div className="text-center py-12 bg-white rounded-2xl shadow">
            <Package className="w-20 h-20 mx-auto mb-4" style={{ color: '#FF7D29' }} />
            <h3 className="text-2xl font-bold mb-2" style={{ color: '#7B4019' }}>
              Select a Category
            </h3>
            <p className="text-lg" style={{ color: '#7B4019', opacity: 0.7 }}>
              Click on any category above to see available items
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
