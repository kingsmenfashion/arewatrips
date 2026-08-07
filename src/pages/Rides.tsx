import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import RideBookingForm from "@/components/rides/RideBookingForm";
import DeliveryBookingForm from "@/components/rides/DeliveryBookingForm";
import RideTypeCard from "@/components/rides/RideTypeCard";
import PopularRoutes from "@/components/rides/PopularRoutes";
import RideFAQ from "@/components/rides/RideFAQ";
import { Helmet } from "react-helmet-async";
import { cn } from "@/lib/utils";
import {
  Plane,
  Car,
  Clock,
  Shield,
  Banknote,
  MessageCircle,
  MapPin,
  CheckCircle,
  Users,
  Package,
} from "lucide-react";

type ServiceType = "ride" | "delivery";

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
    title: "In-City Ride",
    description: "Get an instant ride in Maiduguri within 30 minutes",
    price: "From NGN 1,200",
  },
  {
    id: "Hourly Charter",
    icon: Clock,
    title: "Hourly Charter",
    description: "A dedicated driver at your disposal for the day",
    price: "From NGN 8,000/hr",
  },
];

const deliveryCategories = [
  {
    id: "Small (Documents/Keys)",
    icon: Shield,
    title: "Small Packages",
    description: "Documents, keys, books, or small envelopes. Delivered swiftly.",
    price: "From NGN 500",
  },
  {
    id: "Medium (Box/Food)",
    icon: Package,
    title: "Medium Packages",
    description: "Boxed parcels, food delivery, apparel, and standard items.",
    price: "From NGN 1,000",
  },
  {
    id: "Large (Bulky Items)",
    icon: Car,
    title: "Bulky / Large Packages",
    description: "Heavy or bulky boxes, luggage, or multiple bags requiring careful transport.",
    price: "From NGN 2,000",
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

const deliveryTrustFeatures = [
  { icon: Shield, text: "Verified Couriers" },
  { icon: Banknote, text: "Fixed Pricing" },
  { icon: MessageCircle, text: "WhatsApp Updates" },
  { icon: Clock, text: "24/7 Availability" },
  { icon: MapPin, text: "Local Knowledge" },
  { icon: CheckCircle, text: "Safe & Secure" },
];

const Rides = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const serviceType = (searchParams.get("service") as ServiceType) || "ride";

  // Set "City Ride" as default ride type state
  const [selectedRideType, setSelectedRideType] = useState("City Ride");
  const [selectedDeliveryCategory, setSelectedDeliveryCategory] = useState("");

  const handleServiceChange = (type: ServiceType) => {
    setSearchParams({ service: type });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
  <title>
    Ride Booking & Delivery Services in Maiduguri | Arewa Trips
  </title>

  <meta
    name="description"
    content="Book reliable rides, airport transfers, and package delivery services in Maiduguri with Arewa Trips. Fixed pricing, verified drivers, WhatsApp booking, and fast local transportation."
  />

  <link
    rel="canonical"
    href="https://arewatrips.netlify.app/rides"
  />

  <meta
    property="og:title"
    content="Ride Booking & Delivery Services in Maiduguri | Arewa Trips"
  />

  <meta
    property="og:description"
    content="Book airport transfers, city rides, and package delivery services across Maiduguri. Trusted drivers, transparent pricing, and easy WhatsApp booking."
  />

  <meta
    property="og:url"
    content="https://arewatrips.netlify.app/rides"
  />

  <meta
    property="og:type"
    content="website"
  />

  <meta
    property="og:image"
    content="https://arewatrips.netlify.app/favicon.ico"
  />
</Helmet>
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
              <li className="text-primary-foreground font-medium">Rides & Deliveries</li>
            </ol>
          </nav>

          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Book Your Ride / Request a Ride
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Trusted transport and secure courier services across Maiduguri.
              Confirm details and book directly via WhatsApp.
            </p>

            {/* Segmented Tab Control */}
            <div className="bg-primary-foreground/10 p-1 rounded-xl flex w-full max-w-md border border-primary-foreground/10 backdrop-blur-sm">
              <button
                onClick={() => handleServiceChange("ride")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-1 sm:px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all",
                  serviceType === "ride"
                    ? "bg-gradient-gold text-accent-foreground shadow-sm"
                    : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/5"
                )}
              >
                <span>🚗 Book a Ride</span>
              </button>
              <button
                onClick={() => handleServiceChange("delivery")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-1 sm:px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all",
                  serviceType === "delivery"
                    ? "bg-gradient-gold text-accent-foreground shadow-sm"
                    : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/5"
                )}
              >
                <span>📦 Send a Delivery</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Booking Form - Sticky on Desktop */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="lg:sticky lg:top-24">
                <div className="bg-card rounded-2xl p-6 card-elevated border border-border">
                  <h2 className="text-xl font-bold text-foreground mb-6">
                    {serviceType === "ride" ? "Request a Ride" : "Request a Delivery"}
                  </h2>
                  {serviceType === "ride" ? (
                    <RideBookingForm
                      selectedRideType={selectedRideType}
                      onRideTypeChange={setSelectedRideType}
                    />
                  ) : (
                    <DeliveryBookingForm
                      selectedCategory={selectedDeliveryCategory}
                      onCategoryChange={setSelectedDeliveryCategory}
                    />
                  )}

                  {serviceType === "ride" && (
                    <div className="mt-6 rounded-xl border border-primary/20 bg-secondary/50 p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground">Ride in Group</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Join students moving between Unimaid Park, Complex,
                            Hostel, and Education.
                          </p>
                        </div>
                      </div>
                      <Button asChild className="mt-4 w-full">
                        <Link to="/student-groups">Ride in Group</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Service Details / Categories */}
            <div className="lg:col-span-2 order-2 lg:order-1 space-y-8">
              {serviceType === "ride" ? (
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
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Choose Delivery Category
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Select the package size for your delivery request
                  </p>

                  <div className="space-y-4">
                    {deliveryCategories.map((category) => (
                      <RideTypeCard
                        key={category.id}
                        icon={category.icon}
                        title={category.title}
                        description={category.description}
                        price={category.price}
                        isSelected={selectedDeliveryCategory === category.id}
                        onSelect={() => setSelectedDeliveryCategory(category.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Trust Features */}
              <div className="bg-secondary/30 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  {serviceType === "ride" ? "Why Choose Our Rides" : "Why Choose Our Deliveries"}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {(serviceType === "ride" ? trustFeatures : deliveryTrustFeatures).map((feature, index) => (
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
