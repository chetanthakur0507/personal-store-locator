import Link from 'next/link';

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pb-16 pt-2 md:grid-cols-2">
      <div>
        <p className="mb-3 inline-flex items-center rounded-full bg-[#FFCE99] px-3 py-1 text-xs font-semibold text-[#E67E00]">
          Neighborhood Supermarket
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
          Fresh, grocery, and daily essentials — all in one store
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Yahan aapko fresh fruits & vegetables, dairy, packaged grocery,
          personal care, aur home essentials sab mil jayenge. Clean aisles,
          fast service, and great prices.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/search"
            className="rounded-lg bg-[#FF9644] px-5 py-3 text-sm font-semibold text-white shadow hover:bg-[#E67E00]"
          >
            Search Items
          </Link>
          <a
            href="#categories"
            className="rounded-lg border border-[#FFCE99] px-5 py-3 text-sm font-semibold text-[#E67E00] hover:bg-[#FFF5E6]"
          >
            Dekho Kya Milta Hai
          </a>
        </div>
        <div className="mt-6 flex items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            Fresh produce daily
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#FF9644]"></span>
            Best local prices
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="absolute -inset-6 rounded-3xl bg-[#FFCE99] blur-3xl"></div>
        <div className="relative grid gap-4">
          <div className="rounded-3xl bg-white p-3 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop"
              alt="Store aisle with grocery items"
              className="h-56 w-full rounded-2xl object-cover transition duration-500 hover:scale-[1.02]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-white p-3 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=800&auto=format&fit=crop"
                alt="Fresh fruits"
                className="h-36 w-full rounded-2xl object-cover transition duration-500 hover:scale-[1.03]"
              />
            </div>
            <div className="rounded-3xl bg-white p-3 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=800&auto=format&fit=crop"
                alt="Bakery and bread"
                className="h-36 w-full rounded-2xl object-cover transition duration-500 hover:scale-[1.03]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
