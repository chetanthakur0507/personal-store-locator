export default function Categories() {
  const categories = [
    {
      title: 'Fresh Produce',
      desc: 'Fruits, vegetables, herbs & greens',
      img: 'https://plus.unsplash.com/premium_photo-1664527305901-a3c8bec62850?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnJlc2glMjBwcm9kdWNlfGVufDB8fDB8fHww'
    },
    {
      title: 'Dairy & Bakery',
      desc: 'Milk, paneer, butter, breads',
      img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=900&auto=format&fit=crop'
    },
    {
      title: 'Grocery & Staples',
      desc: 'Rice, flour, pulses, spices',
      img: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?q=80&w=900&auto=format&fit=crop'
    },
    {
      title: 'Snacks & Beverages',
      desc: 'Chips, biscuits, juices, tea',
      img: 'https://images.unsplash.com/photo-1511689660979-10d2b1aada49?q=80&w=900&auto=format&fit=crop'
    },
    {
      title: 'Personal Care',
      desc: 'Shampoo, soaps, skincare',
      img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=900&auto=format&fit=crop'
    },
    {
      title: 'Home Cares',
      desc: 'Cleaners, detergents, tools',
      img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=900&auto=format&fit=crop'
    }
  ];

  return (
    <section id="categories" className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Kis type ka saman milta hai</h2>
          <p className="text-sm text-gray-600">Har aisle ke liye dedicated sections</p>
        </div>
        <div className="hidden md:block text-xs text-gray-500">Daily • Weekly • Monthly</div>
      </div>
      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {categories.map((item) => (
          <div key={item.title} className="group rounded-3xl bg-white p-4 shadow-sm border border-[#FFCE99] transition hover:-translate-y-1 hover:shadow-lg">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={item.img}
                alt={item.title}
                className="h-40 w-full object-cover transition duration-500 group-hover:scale-[1.05]"
              />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
