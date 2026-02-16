export default function StoreView() {
  return (
    <section id="store" className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 shadow-sm border border-[#FFCE99]">
          <img
            src="/store-shelves.png"
            alt="Store shelves"
            className="h-72 w-full rounded-2xl object-cover"
          />
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-[#FFCE99]">
          <h3 className="text-xl font-semibold text-gray-900">Clean & Organized Aisles</h3>
          <p className="mt-3 text-sm text-gray-600">
            Easy navigation, clear labels, and helpful staff. Aapko jo chahiye
            woh turant mil jata hai. Smart locator se staff ko bhi items ka
            exact location milta hai.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-2xl bg-[#FFF5E6] p-4">
              <p className="font-semibold text-[#562F00]">30+ Aisles</p>
              <p className="text-xs text-gray-600">Well-organized sections</p>
            </div>
            <div className="rounded-2xl bg-[#FFF5E6] p-4">
              <p className="font-semibold text-[#562F00]">5k+ Items</p>
              <p className="text-xs text-gray-600">Always in stock</p>
            </div>
            <div className="rounded-2xl bg-[#FFF5E6] p-4">
              <p className="font-semibold text-[#562F00]">Fast Billing</p>
              <p className="text-xs text-gray-600">Quick checkout</p>
            </div>
            <div className="rounded-2xl bg-[#FFF5E6] p-4">
              <p className="font-semibold text-[#562F00]">Home Delivery</p>
              <p className="text-xs text-gray-600">Nearby areas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
