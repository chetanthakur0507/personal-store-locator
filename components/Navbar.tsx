import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-lg shadow-rose-200">
            SM
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">Sahara Mart</p>
            <p className="text-xs text-gray-500">Daily Needs • Fresh • Grocery</p>
          </div>
        </div>
        <div className="hidden items-center gap-6 text-sm text-gray-600 md:flex">
          <a href="#categories" className="hover:text-gray-900">Categories</a>
          <a href="#offers" className="hover:text-gray-900">Best Offers</a>
          <a href="#store" className="hover:text-gray-900">Store View</a>
        </div>
        <Link
          href="/login"
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-rose-700"
        >
          Login
        </Link>
      </div>
    </header>
  );
}
