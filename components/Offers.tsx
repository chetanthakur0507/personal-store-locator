export default function Offers() {
  const offers = [
    { title: 'Fresh Deals', desc: 'Daily fruits & veggie offers', tag: 'Up to 20% off' },
    { title: 'Family Packs', desc: 'Monthly grocery bundles', tag: 'Save more' },
    { title: 'Care Essentials', desc: 'Personal & home care combos', tag: 'Best value' }
  ];

  return (
    <section id="offers" className="mx-auto max-w-6xl px-6 py-10">
      <div className="grid gap-6 rounded-3xl bg-white p-8 shadow-sm border border-rose-100 md:grid-cols-3">
        {offers.map((item) => (
          <div key={item.title} className="rounded-2xl border border-rose-100 p-5 bg-gradient-to-br from-rose-50 to-white">
            <p className="text-xs font-semibold text-rose-600">{item.tag}</p>
            <h3 className="mt-2 text-lg font-semibold text-gray-900">{item.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
