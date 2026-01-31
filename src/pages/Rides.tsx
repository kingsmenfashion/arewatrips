import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RideBookingForm from "@/components/rides/RideBookingForm";
import RideTypeCard from "@/components/rides/RideTypeCard";
import PopularRoutes from "@/components/rides/PopularRoutes";
import RideFAQ from "@/components/rides/RideFAQ";
import { Plane, Car, Clock, Shield, Banknote, MessageCircle, MapPin, CheckCircle } from "lucide-react";

const rideTypes = [
  {
    id: "Airport Transfer",
    icon: Plane,
    title: "Airport Transfer",
    description: "Professional pickup and dropoff at Maiduguri Airport",
    price: "From NGN 5,000",
  },
  {
    id: "City Ride",
    icon: Car,
    title: "City Ride",
    description: "Comfortable rides within Maiduguri city",
    price: "From NGN 2,000",
  },
  {
    id: "Hourly Charter",
    icon: Clock,
    title: "Hourly Charter",
    description: "A dedicated driver at your disposal for the day",
    price: "From NGN 8,000/hr",
  },
];

const trustFeatures = [
  { icon: Shield, text: "Verified Drivers" },
  { icon: Banknote, text: "Fixed Pricing" },
  { icon: MessageCircle, text: "WhatsApp Updates" },
  { icon: Clock, text: "24/7 Availability" },
  { icon: MapPin, text: "Local Knowledge" },
  { icon: CheckCircle, text: "Clean Vehicles" },
];

const Rides = () => {
  const [selectedRideType, setSelectedRideType] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-green">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-primary-foreground/70">
              <li>
                <Link to="/" className="hover:text-primary-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-primary-foreground font-medium">Rides</li>
            </ol>
          </nav>

          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Book Your Ride
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Trusted drivers, fixed prices, and WhatsApp confirmation. 
              Travel around Maiduguri with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Booking Form - Sticky on Desktop */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="lg:sticky lg:top-24">
                <div className="bg-card rounded-2xl p-6 card-elevated border border-border">
                  <h2 className="text-xl font-bold text-foreground mb-6">
                    Request a Ride
                  </h2>
                  <RideBookingForm
                    selectedRideType={selectedRideType}
                    onRideTypeChange={setSelectedRideType}
                  />
                </div>
              </div>
            </div>

            {/* Ride Types */}
            <div className="lg:col-span-2 order-2 lg:order-1 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Choose Your Ride Type
                </h2>
                <p className="text-muted-foreground mb-6">
                  Select the service that best fits your needs
                </p>

                <div className="space-y-4">
                  {rideTypes.map((ride) => (
                    <RideTypeCard
                      key={ride.id}
                      icon={ride.icon}
                      title={ride.title}
                      description={ride.description}
                      price={ride.price}
                      isSelected={selectedRideType === ride.id}
                      onSelect={() => setSelectedRideType(ride.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Trust Features */}
              <div className="bg-secondary/30 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Why Choose Our Rides
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {trustFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <feature.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <PopularRoutes />

      {/* FAQ */}
      <RideFAQ />

      <Footer />
    </div>
  );
};

export default Rides;
