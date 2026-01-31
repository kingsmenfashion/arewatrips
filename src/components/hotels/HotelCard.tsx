import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wifi, Car, Coffee, Utensils, Dumbbell, Snowflake } from "lucide-react";

export interface HotelRoom {
  type: "Standard" | "Deluxe" | "Executive";
  price: number;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  image: string;
  startingPrice: number;
  amenities: string[];
  rooms: HotelRoom[];
}

interface HotelCardProps {
  hotel: Hotel;
  onBook: (hotel: Hotel) => void;
}

const amenityIcons: Record<string, React.ElementType> = {
  "Free WiFi": Wifi,
  "Free Parking": Car,
  "Breakfast": Coffee,
  "Restaurant": Utensils,
  "Gym": Dumbbell,
  "Air Conditioning": Snowflake,
};

const HotelCard = ({ hotel, onBook }: HotelCardProps) => {
  return (
    <Card className="overflow-hidden card-elevated group transition-all duration-300 hover:shadow-lg">
      {/* Hotel Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <CardContent className="p-5">
        {/* Hotel Name & Location */}
        <h3 className="text-lg font-bold text-foreground mb-1">{hotel.name}</h3>
        <p className="text-sm text-muted-foreground mb-3">{hotel.location}</p>

        {/* Starting Price */}
        <div className="mb-4">
          <span className="text-accent font-bold text-xl">
            ₦{hotel.startingPrice.toLocaleString()}
          </span>
          <span className="text-muted-foreground text-sm"> / night</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-5">
          {hotel.amenities.slice(0, 3).map((amenity) => {
            const Icon = amenityIcons[amenity] || Coffee;
            return (
              <div
                key={amenity}
                className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary px-2.5 py-1.5 rounded-full"
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{amenity}</span>
              </div>
            );
          })}
        </div>

        {/* Book Button */}
        <Button
          onClick={() => onBook(hotel)}
          className="w-full"
          size="lg"
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default HotelCard;
