import Link from 'next/link';

interface ProductCardProps {
  _id?: string;
  title?: string;
  name?: string;
  price?: string | number;
  location?: string;
  stock?: string;
  image?: string;
  quantity?: number;
  minStockLevel?: number;
  category?: string;
}

export default function ProductCard({
  _id,
  title,
  name,
  price,
  location,
  stock,
  image,
  quantity,
  minStockLevel,
  category,
}: ProductCardProps) {
  const itemName = name || title || 'Unknown Item';
  const itemId = _id;
  
  // Handle price formatting properly
  let displayPrice = 'N/A';
  if (price !== undefined && price !== null) {
    if (typeof price === 'number' && price > 0) {
      displayPrice = `₹${price.toFixed(2)}`;
    } else if (typeof price === 'string' && price) {
      displayPrice = price;
    }
  }
  
  const inStock = quantity !== undefined ? quantity > (minStockLevel || 0) : true;
  const stockText = stock || (inStock ? 'In Stock' : 'Low Stock');
  
  const itemLink = itemId ? `/item/${itemId}` : '#';

  return (
    <Link href={itemLink}>
      <div className="group rounded-2xl bg-white p-4 shadow-sm border border-[#FFCE99] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
        {/* Product Image */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#FFF5E6] to-[#FFFDF1] h-40 mb-4">
          {image ? (
            <img
              src={image}
              alt={itemName}
              className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-4xl">
              📦
            </div>
          )}

          {/* Stock Badge */}
          {stockText && (
            <span className="absolute top-2 right-2 inline-block bg-[#FF9644] text-white text-xs font-semibold px-3 py-1 rounded-full">
              {stockText}
            </span>
          )}
        </div>

        {/* Content */}
        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
          {itemName}
        </h4>

        <p className="text-lg font-bold text-[#FF9644] mt-2">{displayPrice}</p>

        {location && (
          <p className="text-xs text-gray-500 mt-2">📍 {location}</p>
        )}

        {category && (
          <p className="text-xs text-blue-600 mt-1">📁 {category}</p>
        )}

        <button className="w-full mt-4 rounded-lg bg-[#FF9644] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#E67E00]">
          View Details
        </button>
      </div>
    </Link>
  );
}
