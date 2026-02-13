'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Package, ArrowLeft, ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react';

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
  description?: string;
  image?: string;
  minStockLevel?: number;
}

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/items/${params.id}`);
        const data = await response.json();
        
        if (data.success) {
          setItem(data.data);
        } else {
          setError('Item not found');
        }
      } catch (err) {
        setError('Failed to load item details');
        console.error('Error fetching item:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchItem();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading item detail...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Item Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inStock = item.quantity > (item.minStockLevel || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="flex items-center justify-center">
            <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden shadow-lg">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No Image Available</p>
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div>
            {/* Title & Category */}
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-3">
                {item.category}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{item.name}</h1>
              {item.description && (
                <p className="text-lg text-gray-600">{item.description}</p>
              )}
            </div>

            {/* Price */}
            {item.price && item.price > 0 && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                <p className="text-sm text-gray-600">Price</p>
                <p className="text-4xl font-bold text-green-600">₹{item.price.toFixed(2)}</p>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                {inStock ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-lg font-semibold text-green-700">In Stock</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-6 h-6 text-orange-500" />
                    <span className="text-lg font-semibold text-orange-700">Low Stock</span>
                  </>
                )}
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Available Quantity</p>
                <p className="text-2xl font-bold text-gray-900">{item.quantity} units</p>
              </div>
            </div>

            {/* Location Section */}
            <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-blue-900">📍 Location in Store</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 mb-2">Floor</p>
                  <p className="text-2xl font-bold text-gray-900">{item.floor}</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 mb-2">Aisle</p>
                  <p className="text-2xl font-bold text-blue-600">{item.aisle}</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 mb-2">Rack</p>
                  <p className="text-2xl font-bold text-blue-600">{item.rack}</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 mb-2">Shelf</p>
                  <p className="text-2xl font-bold text-blue-600">{item.shelf}</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <Link href="/" className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition text-center">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
