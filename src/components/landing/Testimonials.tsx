
const testimonials = [
  {
    quote: "PillTime keeps me on track with my heart medication – it's a lifesaver!",
    author: "Sarah Johnson",
    role: "User since 2023"
  },
  {
    quote: "I love the reminder with the pill image. It makes taking my meds easier!",
    author: "Michael Chen",
    role: "User since 2023"
  }
];

export const Testimonials = () => (
  <section className="bg-gray-50 py-20">
    <div className="container mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-12">What Users Say</h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="testimonial-card animate-fade-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="mb-4 text-lavender">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            <p className="text-lg mb-4">{testimonial.quote}</p>
            <div className="font-semibold">{testimonial.author}</div>
            <div className="text-gray-500 text-sm">{testimonial.role}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
