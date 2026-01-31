import { Layers, FileText, MessageCircle, Plane } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      icon: Layers,
      title: "Choose Service",
      description: "Select Hotel or Ride booking based on your travel needs",
    },
    {
      number: "02",
      icon: FileText,
      title: "Submit Details",
      description: "Tell us your dates, location, and preferences",
    },
    {
      number: "03",
      icon: MessageCircle,
      title: "Confirm via WhatsApp",
      description: "Quick confirmation and payment through WhatsApp chat",
    },
    {
      number: "04",
      icon: Plane,
      title: "Enjoy Your Trip",
      description: "Relax and enjoy verified hotels and trusted drivers",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-wider mb-3">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Simple Booking, Real Support
          </h2>
          <p className="text-muted-foreground text-lg">
            No complicated apps or hidden fees. Just straightforward booking with 
            personal WhatsApp support at every step.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-border" />
              )}
              
              <div className="relative bg-background rounded-2xl p-6 card-elevated text-center">
                {/* Step Number Badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-gradient-gold text-accent-foreground text-sm font-bold rounded-full">
                    {step.number}
                  </span>
                </div>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary mb-5 mt-4">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
