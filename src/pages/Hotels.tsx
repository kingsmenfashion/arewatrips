import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HotelCard, { Hotel } from "@/components/hotels/HotelCard";
import HotelBookingModal from "@/components/hotels/HotelBookingModal";
import { Shield, Banknote, MessageCircle } from "lucide-react";
import green from "@/assets/at.jpeg";
import white from "@/assets/wh.jpeg";

// Sample hotel data
const hotels: Hotel[] = [
  {
    id: "1",
    name: "Grand Palace Hotel",
    location: "GRA, Maiduguri",
    image: white,
    startingPrice: 18000,
    amenities: ["Free WiFi", "Free Parking", "Restaurant"],
    rooms: [
      { type: "Standard", price: 18000 },
      { type: "Deluxe", price: 28000 },
      { type: "Executive", price: 45000 },
    ],
  },
  {
    id: "2",
    name: "Maiduguri Comfort Inn",
    location: "Shehu Laminu Way, Maiduguri",
    image: green,
    startingPrice: 12000,
    amenities: ["Free WiFi", "Breakfast", "Air Conditioning"],
    rooms: [
      { type: "Standard", price: 12000 },
      { type: "Deluxe", price: 20000 },
      { type: "Executive", price: 32000 },
    ],
  },
  {
    id: "3",
    name: "Sahel Continental",
    location: "Bama Road, Maiduguri",
    image: white,
    startingPrice: 25000,
    amenities: ["Free WiFi", "Gym", "Restaurant"],
    rooms: [
      { type: "Standard", price: 25000 },
      { type: "Deluxe", price: 38000 },
      { type: "Executive", price: 55000 },
    ],
  },
  {
    id: "4",
    name: "Heritage Lodge",
    location: "Old GRA, Maiduguri",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=60",
    startingPrice: 15000,
    amenities: ["Free Parking", "Breakfast", "Air Conditioning"],
    rooms: [
      { type: "Standard", price: 15000 },
      { type: "Deluxe", price: 24000 },
      { type: "Executive", price: 38000 },
    ],
  },
  {
    id: "5",
    name: "Royal Crown Hotel",
    location: "Lagos Street, Maiduguri",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop&q=60",
    startingPrice: 22000,
    amenities: ["Free WiFi", "Restaurant", "Gym"],
    rooms: [
      { type: "Standard", price: 22000 },
      { type: "Deluxe", price: 35000 },
      { type: "Executive", price: 50000 },
    ],
  },
  {
    id: "6",
    name: "City View Suites",
    location: "Bulumkutu, Maiduguri",
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=60",
    startingPrice: 10000,
    amenities: ["Free WiFi", "Free Parking", "Air Conditioning"],
    rooms: [
      { type: "Standard", price: 10000 },
      { type: "Deluxe", price: 16000 },
      { type: "Executive", price: 26000 },
    ],
  },
];

const trustSignals = [
  {
    icon: Shield,
    title: "Verified Hotels",
    description: "All our partner hotels are personally vetted",
  },
  {
    icon: Banknote,
    title: "No Online Payment",
    description: "Pay directly at the hotel, no advance required",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Support",
    description: "Get instant updates and support via WhatsApp",
  },
];

const Hotels = () => {
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBookHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHotel(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-green">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-4 animate-fade-up">
              Book Trusted Hotels in Maiduguri
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-3 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Verified hotels • No online payment • Pay at hotel
            </p>
            <p className="text-sm text-primary-foreground/70 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Tap "Book Now" to complete a quick request form.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-8 border-b border-border bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustSignals.map((signal, index) => (
              <div
                key={signal.title}
                className="flex items-center gap-4 justify-center md:justify-start animate-fade-up"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                  <signal.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{signal.title}</h3>
                  <p className="text-sm text-muted-foreground">{signal.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotel Listing */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel, index) => (
              <div
                key={hotel.id}
                className="animate-fade-up"
                style={{ animationDelay: `${0.05 * index}s` }}
              >
                <HotelCard hotel={hotel} onBook={handleBookHotel} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <HotelBookingModal
        hotel={selectedHotel}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <Footer />
    </div>
  );
};

export default Hotels;
