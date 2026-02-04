import ProductCard from './ProductCard';

interface SectionProps {
  title: string;
  subtitle?: string;
  products?: Array<{
    title: string;
    price: string;
    location?: string;
    stock?: string;
    image?: string;
  }>;
}

export default function Section({
  title,
  subtitle,
  products = [
    {
      title: 'Premium Milk 1L',
      price: '₹45',
      stock: 'In Stock',
      location: 'Aisle 2, Shelf A',
      image: 'https://images.unsplash.com/photo-1553530666-ba2a8e36b570?q=80&w=400&auto=format&fit=crop',
    },
    {
      title: 'Fresh Bread Loaf',
      price: '₹35',
      stock: 'Fresh Today',
      location: 'Aisle 3, Shelf B',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400&auto=format&fit=crop',
    },
    {
      title: 'Organic Honey 500g',
      price: '₹299',
      stock: 'Hot Pick',
      location: 'Aisle 5, Shelf C',
      image: 'https://images.unsplash.com/photo-1579955259826-27ceba47da58?q=80&w=400&auto=format&fit=crop',
    },
    {
      title: 'Almonds Premium 250g',
      price: '₹499',
      stock: 'Limited',
      location: 'Aisle 4, Shelf A',
      image: 'https://images.unsplash.com/photo-1585518419759-8fd62e631b6e?q=80&w=400&auto=format&fit=crop',
    },
  ],
}: SectionProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        {subtitle && (
          <p className="mt-2 text-gray-600">{subtitle}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-4 animate-fade-in-delayed">
        {products.map((product) => (
          <ProductCard key={product.title} {...product} />
        ))}
      </div>
    </section>
  );
}
