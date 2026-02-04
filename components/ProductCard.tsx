interface ProductCardProps {
  title: string;
  price: string;
  location?: string;
  stock?: string;
  image?: string;
}

export default function ProductCard({
  title,
  price,
  location,
  stock,
  image,
}: ProductCardProps) {
  return (
    <div className="group rounded-2xl bg-white p-4 shadow-sm border border-rose-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-rose-50 to-amber-50 h-40 mb-4">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-4xl">
            📦
          </div>
        )}

        {/* Stock Badge */}
        {stock && (
          <span className="absolute top-2 right-2 inline-block bg-rose-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {stock}
          </span>
        )}
      </div>

      {/* Content */}
      <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
        {title}
      </h4>

      <p className="text-lg font-bold text-rose-600 mt-2">{price}</p>

      {location && (
        <p className="text-xs text-gray-500 mt-2">📍 {location}</p>
      )}

      <button className="w-full mt-4 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-700">
        Find in Store
      </button>
    </div>
  );
}
