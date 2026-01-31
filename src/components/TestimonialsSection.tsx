import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Aisha Mohammed",
      role: "Business Traveler",
      content:
        "Arewa Trips made my Maiduguri trip stress-free. The hotel was exactly as described, and the driver was waiting right on time. Their WhatsApp support is amazing!",
      rating: 5,
      service: "Hotel + Ride",
    },
    {
      name: "Ibrahim Yusuf",
      role: "Frequent Visitor",
      content:
        "I've used many booking services, but none understand Northern Nigeria like Arewa Trips. Fair prices, verified hotels, and drivers who know every corner of the city.",
      rating: 5,
      service: "Hotel Booking",
    },
    {
      name: "Fatima Bello",
      role: "Family Vacation",
      content:
        "Traveled with my family and needed reliable transport from the airport. The fixed pricing meant no surprises, and the driver helped with our luggage too!",
      rating: 5,
      service: "Ride Booking",
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by Travelers
          </h2>
          <p className="text-muted-foreground text-lg">
            Don't just take our word for it. Here's what our customers say about 
            their experience with Arewa Trips.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-card border border-border rounded-2xl p-8 card-elevated"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6">
                <Quote className="w-8 h-8 text-accent/30" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-accent text-accent"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                  {testimonial.service}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
