 'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Package, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FFEEA9' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 mx-auto mb-4" style={{ borderBottomColor: '#FF7D29' }}></div>
          <p style={{ color: '#7B4019' }}>Loading item details...</p>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#FFEEA9' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/" className="flex items-center gap-2 mb-6" style={{ color: '#FF7D29' }}>
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: '#FF7D29' }} />
            <h1 className="text-2xl font-bold mb-2" style={{ color: '#7B4019' }}>Item Not Found</h1>
            <p className="mb-6" style={{ color: '#7B4019' }}>{error}</p>
            <Link href="/" className="inline-block px-6 py-2 text-white rounded-lg transition" style={{ backgroundColor: '#FF7D29' }}>
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inStock = item.quantity > (item.minStockLevel || 0);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FFEEA9' }}>
      {/* Header */}
      <header className="bg-white shadow-sm" style={{ borderBottom: '2px solid #FFBF78' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center gap-2" style={{ color: '#FF7D29' }}>
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="flex items-center justify-center">
            <div className="w-full aspect-square rounded-2xl flex items-center justify-center overflow-hidden shadow-lg" style={{ backgroundColor: '#FFBF78' }}>
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Package className="w-24 h-24 mx-auto mb-4" style={{ color: '#FF7D29' }} />
                  <p style={{ color: '#7B4019' }}>No Image Available</p>
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div>
            {/* Title & Category */}
            <div className="mb-6">
              <span className="inline-block px-4 py-2 text-sm font-semibold rounded-full mb-3" style={{ backgroundColor: '#FFBF78', color: '#7B4019' }}>
                {item.category}
              </span>
              <h1 className="text-4xl font-bold mb-3" style={{ color: '#7B4019' }}>{item.name}</h1>
              {item.description && (
                <p className="text-lg" style={{ color: '#7B4019' }}>{item.description}</p>
              )}
            </div>

            {/* Price */}
            {item.price && item.price > 0 && (
              <div className="mb-6 p-4 rounded-lg border-2" style={{ backgroundColor: '#FFBF78', borderColor: '#FF7D29' }}>
                <p className="text-sm" style={{ color: '#7B4019' }}>Price</p>
                <p className="text-4xl font-bold" style={{ color: '#7B4019' }}>₹{item.price.toFixed(2)}</p>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                {inStock ? (
                  <>
                    <CheckCircle className="w-6 h-6" style={{ color: '#FF7D29' }} />
                    <span className="text-lg font-semibold" style={{ color: '#FF7D29' }}>In Stock</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-6 h-6" style={{ color: '#FF7D29' }} />
                    <span className="text-lg font-semibold" style={{ color: '#FF7D29' }}>Low Stock</span>
                  </>
                )}
              </div>
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#FFBF78' }}>
                <p className="text-sm" style={{ color: '#7B4019' }}>Available Quantity</p>
                <p className="text-2xl font-bold" style={{ color: '#7B4019' }}>{item.quantity} units</p>
              </div>
            </div>

            {/* Location Section */}
            <div className="mb-6 p-6 rounded-xl border-2" style={{ backgroundColor: '#FFBF78', borderColor: '#FF7D29' }}>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-6 h-6" style={{ color: '#FF7D29' }} />
                <h2 className="text-xl font-semibold" style={{ color: '#7B4019' }}>📍 Location in Store</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm mb-2" style={{ color: '#7B4019' }}>Floor</p>
                  <p className="text-2xl font-bold" style={{ color: '#7B4019' }}>{item.floor}</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm mb-2" style={{ color: '#7B4019' }}>Aisle</p>
                  <p className="text-2xl font-bold" style={{ color: '#FF7D29' }}>{item.aisle}</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm mb-2" style={{ color: '#7B4019' }}>Rack</p>
                  <p className="text-2xl font-bold" style={{ color: '#FF7D29' }}>{item.rack}</p>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <p className="text-sm mb-2" style={{ color: '#7B4019' }}>Shelf</p>
                  <p className="text-2xl font-bold" style={{ color: '#FF7D29' }}>{item.shelf}</p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div>
              <Link 
                href="/" 
                className="block w-full px-6 py-3 font-semibold rounded-lg transition text-center shadow-md hover:shadow-lg"
                style={{ backgroundColor: '#FF7D29', color: 'white' }}
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
