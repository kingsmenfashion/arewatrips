import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Car, Shield, BadgeCheck, Headphones, MapPin, Clock, Banknote } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      title: "Hotel Booking",
      description: "Find the perfect stay in Maiduguri and across Northern Nigeria",
      icon: Building2,
      benefits: [
        { icon: BadgeCheck, text: "Verified Hotels" },
        { icon: Banknote, text: "Fair Pricing" },
        { icon: Headphones, text: "Local Support" },
      ],
      cta: "Find Hotels",
      primary: true,
    },
    {
      title: "Ride Booking",
      description: "Reliable transportation for airport transfers and city rides",
      icon: Car,
      benefits: [
        { icon: Shield, text: "Trusted Drivers" },
        { icon: MapPin, text: "Airport & City Rides" },
        { icon: Clock, text: "Fixed Pricing" },
      ],
      cta: "Request a Ride",
      primary: false,
    },
  ];

  return (
    <section id="services" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3">
            Our Services
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Two Ways to Travel Better
          </h2>
          <p className="text-muted-foreground text-lg">
            Whether you need a place to stay or a ride to get there, we've got you covered 
            with trusted local partners.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`relative group card-elevated rounded-2xl p-8 md:p-10 transition-all duration-300 ${
                service.primary
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border"
              }`}
            >
              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 ${
                  service.primary
                    ? "bg-primary-foreground/15"
                    : "bg-gradient-green"
                }`}
              >
                <service.icon
                  className={`w-7 h-7 ${
                    service.primary ? "text-primary-foreground" : "text-primary-foreground"
                  }`}
                />
              </div>

              {/* Title & Description */}
              <h3
                className={`text-2xl font-bold mb-3 ${
                  service.primary ? "text-primary-foreground" : "text-foreground"
                }`}
              >
                {service.title}
              </h3>
              <p
                className={`mb-8 ${
                  service.primary
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                }`}
              >
                {service.description}
              </p>

              {/* Benefits */}
              <ul className="space-y-4 mb-8">
                {service.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        service.primary
                          ? "bg-primary-foreground/15"
                          : "bg-secondary"
                      }`}
                    >
                      <benefit.icon
                        className={`w-4 h-4 ${
                          service.primary ? "text-accent" : "text-primary"
                        }`}
                      />
                    </div>
                    <span
                      className={`font-medium ${
                        service.primary
                          ? "text-primary-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {benefit.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link to={service.title === "Ride Booking" ? "/rides" : "/hotels"}>
                <Button
                  size="lg"
                  variant={service.primary ? "gold" : "default"}
                  className="w-full justify-center"
                >
                  {service.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
