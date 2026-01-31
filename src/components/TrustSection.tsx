import { MapPin, Users, Shield, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const TrustSection = () => {
  const trustItems = [
    {
      icon: MapPin,
      title: "Local Presence",
      description: "Based in Maiduguri with deep knowledge of Northern Nigeria",
    },
    {
      icon: Users,
      title: "Verified Partners",
      description: "Every hotel and driver is personally vetted by our team",
    },
    {
      icon: Shield,
      title: "Secure Booking",
      description: "Your travel plans are protected with our booking guarantee",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Support",
      description: "Real humans available to help via WhatsApp, anytime",
    },
  ];

  return (
    <section id="contact" className="py-20 md:py-28 bg-gradient-green text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">
                Proudly Serving Maiduguri & Northern Nigeria
              </span>
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Arewa Trips?
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
              We're not just a booking platform. We're your local travel partners 
              who understand the region like no one else.
            </p>
          </div>

          {/* Trust Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {trustItems.map((item, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/20 mb-4">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-primary-foreground/70 text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-primary-foreground/80 mb-6">
              Ready to plan your next trip? Get in touch with us directly.
            </p>
            <Button size="xl" variant="gold" className="gap-3">
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
