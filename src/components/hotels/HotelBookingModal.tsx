import { useState, useEffect } from "react";
import { format, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Hotel, HotelRoom } from "./HotelCard";

interface HotelBookingModalProps {
  hotel: Hotel | null;
  isOpen: boolean;
  onClose: () => void;
}

const HotelBookingModal = ({ hotel, isOpen, onClose }: HotelBookingModalProps) => {
  const [roomType, setRoomType] = useState<string>("");
  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  const today = startOfDay(new Date());

  // Reset form when hotel changes
  useEffect(() => {
    if (hotel) {
      setRoomType("");
      setCheckInDate(undefined);
      setCheckOutDate(undefined);
      setCurrentPrice(hotel.startingPrice);
    }
  }, [hotel]);

  // Update price when room type changes
  useEffect(() => {
    if (hotel && roomType) {
      const selectedRoom = hotel.rooms.find((room) => room.type === roomType);
      if (selectedRoom) {
        setCurrentPrice(selectedRoom.price);
      }
    }
  }, [roomType, hotel]);

  const isFormValid = roomType && checkInDate && checkOutDate && checkOutDate > checkInDate;

  const handleContinue = () => {
    if (!hotel || !isFormValid) return;

    const message = 
      `Hello Arewa Trips, I would like to request a reservation.\n\n` +
      `Hotel: ${hotel.name}\n\n` +
      `Room Type: ${roomType}\n\n` +
      `Price: ₦${currentPrice.toLocaleString()} / night\n\n` +
      `Check-in: ${checkInDate ? format(checkInDate, "PPP") : ""}\n\n` +
      `Check-out: ${checkOutDate ? format(checkOutDate, "PPP") : ""}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/2347034909853?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    onClose();
  };

  if (!hotel) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Complete booking request details</DialogTitle>
          <DialogDescription>
            Fill these details to continue on WhatsApp.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-5">
            {/* Hotel Name (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="hotel-name">Hotel Name</Label>
              <Input
                id="hotel-name"
                value={hotel.name}
                readOnly
                className="bg-muted cursor-not-allowed"
              />
            </div>

            {/* Room Type */}
            <div className="space-y-2">
              <Label htmlFor="room-type">Room Type *</Label>
              <Select value={roomType} onValueChange={setRoomType}>
                <SelectTrigger id="room-type">
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {hotel.rooms.map((room) => (
                    <SelectItem key={room.type} value={room.type}>
                      {room.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price per Night (Read-only) */}
            <div className="space-y-2">
              <Label>Price per Night</Label>
              <div className="flex items-center h-10 px-3 rounded-md border border-input bg-muted">
                <span className="text-foreground font-medium">
                  ₦{currentPrice.toLocaleString()} / night
                </span>
              </div>
            </div>

            {/* Check-in Date */}
            <div className="space-y-2">
              <Label>Check-in Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkInDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkInDate ? format(checkInDate, "PPP") : "Select check-in date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover" align="start">
                  <Calendar
                    mode="single"
                    selected={checkInDate}
                    onSelect={setCheckInDate}
                    disabled={(date) => startOfDay(date) < today}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Check-out Date */}
            <div className="space-y-2">
              <Label>Check-out Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !checkOutDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOutDate ? format(checkOutDate, "PPP") : "Select check-out date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-popover" align="start">
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    disabled={(date) => 
                      startOfDay(date) < today || (checkInDate ? date <= checkInDate : false)
                    }
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {checkOutDate && checkInDate && checkOutDate <= checkInDate && (
                <p className="text-destructive text-sm">
                  Check-out must be after check-in date
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sticky footer with actions */}
        <div className=" bg-background border-t px-6 py-4">
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleContinue}
              disabled={!isFormValid}
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HotelBookingModal;
