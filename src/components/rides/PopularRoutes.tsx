import { MapPin, ArrowRight } from "lucide-react";

const popularRoutes = [
  {
    from: "Maiduguri Airport",
    to: "City Center",
    estimate: "From NGN 5,000",
    duration: "~25 mins",
  },
  {
    from: "Maiduguri",
    to: "Yola",
    estimate: "From NGN 18,000",
    duration: "~4 hours",
  },
  {
    from: "Maiduguri",
    to: "Kano",
    estimate: "From NGN 25,000",
    duration: "~6 hours",
  },
  {
    from: "Custom Route",
    to: "Your Destination",
    estimate: "Get a Quote",
    duration: "Contact us",
  },
];

const PopularRoutes = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3">
            Popular Routes
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Common Destinations
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {popularRoutes.map((route, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-5 card-elevated border border-border"
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground truncate">
                  {route.from}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground truncate">
                  {route.to}
                </span>
              </div>
              <div className="pt-3 border-t border-border">
                <p className="text-accent font-bold">{route.estimate}</p>
                <p className="text-xs text-muted-foreground">{route.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRoutes;
