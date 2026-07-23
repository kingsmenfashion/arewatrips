import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, CalendarIcon, Clock, MessageCircle, Package, User, Phone } from "lucide-react";
import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const timeSlots = [
  "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
  "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM",
];

const parseTimeSlot = (slot: string) => {
  const [timePart, ampm] = slot.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);
  if (ampm === "PM" && hours !== 12) {
    hours += 12;
  } else if (ampm === "AM" && hours === 12) {
    hours = 0;
  }
  return { hours, minutes };
};

interface DeliveryBookingFormProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const DeliveryBookingForm = ({ selectedCategory = "", onCategoryChange }: DeliveryBookingFormProps) => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [localCategory, setLocalCategory] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync prop category and local state category
  const activeCategory = selectedCategory || localCategory;
  const handleCategoryChange = onCategoryChange || setLocalCategory;

  // Filter time slots dynamically if the selected date is today
  const filteredTimeSlots = timeSlots.filter((slot) => {
    if (!date || !isToday(date)) return true;
    const { hours: slotHours, minutes: slotMinutes } = parseTimeSlot(slot);
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    if (slotHours > currentHours) return true;
    if (slotHours === currentHours && slotMinutes > currentMinutes) return true;
    return false;
  });

  // If the currently selected time becomes invalid (e.g. user changes date to today), clear it
  useEffect(() => {
    if (date && time && isToday(date)) {
      const { hours: slotHours, minutes: slotMinutes } = parseTimeSlot(time);
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const isPast = slotHours < currentHours || (slotHours === currentHours && slotMinutes <= currentMinutes);
      if (isPast) {
        setTime("");
      }
    }
  }, [date, time]);

  const isValid =
    pickup.trim() !== "" &&
    dropoff.trim() !== "" &&
    activeCategory !== "" &&
    receiverName.trim() !== "" &&
    receiverPhone.trim() !== "" &&
    date !== undefined &&
    time !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const formattedDate = date ? format(date, "PPP") : "";
      
      // Construct WhatsApp link message:
      const message = encodeURIComponent(
        `Hello ArewaTrips, I'd like to request a delivery for a ${activeCategory} from ${pickup} to ${dropoff}. Recipient: ${receiverName} (${receiverPhone}) on ${formattedDate} at ${time}.`
      );

      toast({
        title: "Booking Initiated",
        description: "Redirecting to WhatsApp to complete your request.",
      });

      window.open(`https://wa.me/2348022444596?text=${message}`, "_blank");
    } catch (error) {
      toast({
        title: "Error submitting request",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Pickup Location */}
      <div className="space-y-2">
        <Label htmlFor="pickup" className="text-foreground font-medium">
          Pickup Location
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="pickup"
            placeholder="Enter pickup address"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Delivery Destination */}
      <div className="space-y-2">
        <Label htmlFor="dropoff" className="text-foreground font-medium">
          Delivery Destination
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="dropoff"
            placeholder="Enter destination address"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Package Category Dropdown */}
      <div className="space-y-2">
        <Label htmlFor="category" className="text-foreground font-medium">
          Package Category
        </Label>
        <Select value={activeCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger>
            <Package className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Select package category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Small (Documents/Keys)">Small (Documents/Keys)</SelectItem>
            <SelectItem value="Medium (Box/Food)">Medium (Box/Food)</SelectItem>
            <SelectItem value="Large (Bulky Items)">Large (Bulky Items)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Receiver Name */}
      <div className="space-y-2">
        <Label htmlFor="receiverName" className="text-foreground font-medium">
          Receiver Name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="receiverName"
            placeholder="Enter recipient full name"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Receiver Phone */}
      <div className="space-y-2">
        <Label htmlFor="receiverPhone" className="text-foreground font-medium">
          Receiver Phone Number
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="receiverPhone"
            type="tel"
            placeholder="Enter recipient phone number"
            value={receiverPhone}
            onChange={(e) => setReceiverPhone(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Date & Time Pickers - Responsive column layouts to eliminate horizontal scroll */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-foreground font-medium">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label className="text-foreground font-medium">Time</Label>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger>
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {filteredTimeSlots.map((slot) => (
                <SelectItem key={slot} value={slot}>
                  {slot}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        variant="gold"
        className="w-full gap-2"
        disabled={isSubmitting || !isValid}
      >
        <MessageCircle className="w-5 h-5" />
        {isSubmitting ? "Submitting..." : "Book NOW via WhatsApp"}
      </Button>
    </form>
  );
};

export default DeliveryBookingForm;
