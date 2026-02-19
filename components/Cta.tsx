import Link from 'next/link';
import { Search, MapPin, Package } from 'lucide-react';

export default function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16">
      <div className="rounded-3xl bg-gradient-to-br from-[#FF9644] to-[#E67E00] px-8 py-10 text-white shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-3">🔍 Find What You Need, Instantly!</h2>
          <p className="text-lg text-[#FFCE99]">
            Search karo aur turant pata chale ki item store mein kaha rakha hai
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-[#FF9644]" />
            </div>
            <h3 className="font-semibold mb-2">Search Items</h3>
            <p className="text-sm text-[#FFCE99]">Name ya category se search karo</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-[#FF9644]" />
            </div>
            <h3 className="font-semibold mb-2">Find Location</h3>
            <p className="text-sm text-[#FFCE99]">Floor, Aisle, Rack details instantly</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-[#FF9644]" />
            </div>
            <h3 className="font-semibold mb-2">Check Stock</h3>
            <p className="text-sm text-[#FFCE99]">Real-time availability aur price</p>
          </div>
        </div>
        
        <div className="text-center">
          <Link
            href="/search"
            className="inline-block rounded-lg bg-white px-8 py-4 text-lg font-semibold text-[#FF9644] shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Start Searching →
          </Link>
        </div>
      </div>
    </section>
  );
}
