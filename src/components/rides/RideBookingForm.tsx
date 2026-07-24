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
import { MapPin, CalendarIcon, Clock, MessageCircle, Car } from "lucide-react";
import { format, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { createRideBooking } from "@/lib/bookings";
import { isSupabaseConfigured } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";

const bookingSchema = z.object({
  pickup: z.string().trim().min(1, "Pickup location is required").max(100),
  dropoff: z.string().trim().min(1, "Dropoff location is required").max(100),
  date: z.date({ required_error: "Date is required" }),
  time: z.string().min(1, "Time is required"),
  rideType: z.string().min(1, "Please select a ride type"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface RideBookingFormProps {
  selectedRideType?: string;
  onRideTypeChange?: (type: string) => void;
}

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

const RideBookingForm = ({ selectedRideType = "City Ride", onRideTypeChange }: RideBookingFormProps) => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [vehicleType, setVehicleType] = useState<"keke" | "car">("keke");
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    date !== undefined &&
    time !== "" &&
    selectedRideType !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      pickup,
      dropoff,
      date,
      time,
      rideType: selectedRideType,
    };

    const result = bookingSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof BookingFormData, string>> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof BookingFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const vehicleLabel = vehicleType === "keke" ? "Keke (Tricycle)" : "Car";
      
      // Save to Supabase (appending vehicle label in rideType)
      await createRideBooking({
        ...result.data,
        rideType: `${selectedRideType} (${vehicleLabel})`,
      });

      if (!isSupabaseConfigured) {
        toast({
          title: "Supabase is not configured",
          description: "Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to save bookings.",
        });
      }

      const formattedDate = date ? format(date, "PPP") : "";
      const message = encodeURIComponent(
        `Hello ArewaTrips, I'd like to book a ${vehicleLabel} (${selectedRideType}) from ${pickup} to ${dropoff} on ${formattedDate} at ${time}.`
      );

      window.open(`https://wa.me/2348022444956?text=${message}`, "_blank");
    } catch (error) {
      toast({
        title: "Could not save booking",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
            className={cn("pl-10", errors.pickup && "border-destructive")}
          />
        </div>
        {errors.pickup && (
          <p className="text-sm text-destructive">{errors.pickup}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dropoff" className="text-foreground font-medium">
          Dropoff Location
        </Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="dropoff"
            placeholder="Enter dropoff address"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            className={cn("pl-10", errors.dropoff && "border-destructive")}
          />
        </div>
        {errors.dropoff && (
          <p className="text-sm text-destructive">{errors.dropoff}</p>
        )}
      </div>

      {/* Vehicle Type Switcher Toggle - Responsive classes */}
      <div className="space-y-2">
        <Label className="text-foreground font-medium">Vehicle Option</Label>
        <div className="grid grid-cols-2 gap-1.5 bg-secondary/50 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setVehicleType("keke")}
            className={cn(
              "flex items-center justify-center gap-1 sm:gap-2 py-2 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-all",
              vehicleType === "keke"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <span className="text-sm sm:text-base">🛺</span>
            <span>Keke (Tricycle)</span>
          </button>
          <button
            type="button"
            onClick={() => setVehicleType("car")}
            className={cn(
              "flex items-center justify-center gap-1 sm:gap-2 py-2 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-all",
              vehicleType === "car"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary"
            )}
          >
            <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Car</span>
          </button>
        </div>
      </div>

      {/* Date & Time Grid - Responsive column layouts to eliminate horizontal scroll */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-foreground font-medium">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                  errors.date && "border-destructive"
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
          {errors.date && (
            <p className="text-sm text-destructive">{errors.date}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-foreground font-medium">Time</Label>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger className={cn(errors.time && "border-destructive")}>
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
          {errors.time && (
            <p className="text-sm text-destructive">{errors.time}</p>
          )}
        </div>
      </div>

      {!selectedRideType && (
        <div className="space-y-2">
          <Label className="text-foreground font-medium">Ride Type</Label>
          <Select value={selectedRideType} onValueChange={onRideTypeChange}>
            <SelectTrigger className={cn(errors.rideType && "border-destructive")}>
              <SelectValue placeholder="Select ride type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Airport Transfer">Airport Transfer</SelectItem>
              <SelectItem value="City Ride">City Ride</SelectItem>
              <SelectItem value="Hourly Charter">Hourly Charter</SelectItem>
            </SelectContent>
          </Select>
          {errors.rideType && (
            <p className="text-sm text-destructive">{errors.rideType}</p>
          )}
        </div>
      )}

      {selectedRideType && (
        <div className="bg-secondary/50 rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Selected Option:</span>
          <span className="font-semibold text-foreground">{selectedRideType}</span>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        variant="gold"
        className="w-full gap-2"
        disabled={isSubmitting || !isValid}
      >
        <MessageCircle className="w-5 h-5" />
        {isSubmitting ? "Saving..." : "Book NOW via WhatsApp"}
      </Button>
    </form>
  );
};

export default RideBookingForm;
