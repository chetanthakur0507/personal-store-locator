export default function Testimonials() {
  const testimonials = [
    {
      rating: 5,
      text: '"Found my items in seconds using the map. Life-changing!"',
      author: 'Sarah Jenkins',
      role: 'Regular Customer',
    },
    {
      rating: 5,
      text: '"Real-time stock indicator saved my trip. Perfect!"',
      author: 'David Lawson',
      role: 'Busy Professional',
    },
    {
      rating: 5,
      text: '"Love the interactive map on my phone! So convenient!"',
      author: 'Elena Moreno',
      role: 'Working Mother',
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="text-center mb-10 animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-900">
          What Our Customers Say
        </h2>
        <p className="mt-2 text-gray-600">
          Thousands of happy shoppers trust Sahara Mart for their daily needs
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-white p-6 shadow-sm border border-rose-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-lg animate-fade-in-delayed"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            {/* Stars */}
            <div className="flex gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <span key={i} className="text-lg">
                  ⭐
                </span>
              ))}
            </div>

            {/* Quote */}
            <p className="text-gray-700 font-medium mb-4">
              {testimonial.text}
            </p>

            {/* Author */}
            <div className="border-t border-rose-100 pt-4">
              <p className="font-semibold text-gray-900">
                {testimonial.author}
              </p>
              <p className="text-xs text-gray-500">{testimonial.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
