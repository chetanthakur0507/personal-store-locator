'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

interface SectionProps {
  title: string;
  subtitle?: string;
  type?: 'trending' | 'featured' | 'custom';
  products?: Array<{
    title: string;
    price: string;
    location?: string;
    stock?: string;
    image?: string;
  }>;
}

interface DatabaseItem {
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
}

export default function Section({
  title,
  subtitle,
  type = 'custom',
  products = [],
}: SectionProps) {
  const [items, setItems] = useState<DatabaseItem[]>([]);
  const [loading, setLoading] = useState(type !== 'custom');

  useEffect(() => {
    if (type === 'custom') {
      // Custom type uses provided products prop
      return;
    }

    const fetchItems = async () => {
      try {
        setLoading(true);
        let url = '/api/items?limit=4';

        if (type === 'trending') {
          url = '/api/items?trending=true&limit=4';
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          setItems(data.data);
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [type]);

  // Determine which items to display
  const itemsToDisplay = type === 'custom' && products.length > 0 ? products : items;

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        {subtitle && (
          <p className="mt-2 text-gray-600">{subtitle}</p>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-rose-600"></div>
        </div>
      ) : itemsToDisplay && itemsToDisplay.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-4 animate-fade-in-delayed">
          {itemsToDisplay.map((product: any) => {
            const locationStr = product.floor && product.aisle ? `Floor ${product.floor}, Aisle ${product.aisle}` : product.location;
            const priceValue = product.price || 0;
            
            return (
              <ProductCard
                key={product._id || product.title || product.name}
                _id={product._id}
                name={product.name || product.title}
                price={priceValue}
                image={product.image}
                stock={product.stock}
                location={locationStr}
                quantity={product.quantity}
                minStockLevel={product.minStockLevel}
                category={product.category}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No items available</p>
        </div>
      )}
    </section>
  );
}
