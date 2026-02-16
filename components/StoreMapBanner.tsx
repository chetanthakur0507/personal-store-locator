import Link from 'next/link';

export default function StoreMapBanner() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FF9644] to-[#E67E00] px-8 py-16 shadow-xl">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-white animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in">
            Navigate the store
            <br />
            <span className="text-rose-100">like a pro.</span>
          </h2>

          <p className="text-lg text-rose-100 mb-6 animate-fade-in-delayed">
            Use our interactive digital map to see your current location and get
            step-by-step directions to any item. No more wandering around!
          </p>

          <Link
            href="/store-map"
            className="inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#FF9644] shadow-lg transition hover:shadow-xl hover:scale-105"
          >
            Open Full Store Map
          </Link>
        </div>
      </div>
    </section>
  );
}
