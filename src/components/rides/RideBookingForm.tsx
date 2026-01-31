import { useState } from "react";
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
import { MapPin, CalendarIcon, Clock, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { z } from "zod";

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

const RideBookingForm = ({ selectedRideType = "", onRideTypeChange }: RideBookingFormProps) => {
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});

  const handleSubmit = (e: React.FormEvent) => {
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

    // Build WhatsApp message
    const message = encodeURIComponent(
      `Hello Arewa Trips! I'd like to book a ride:\n\n` +
      `📍 Pickup: ${pickup}\n` +
      `📍 Dropoff: ${dropoff}\n` +
      `📅 Date: ${date ? format(date, "PPP") : ""}\n` +
      `🕐 Time: ${time}\n` +
      `🚗 Ride Type: ${selectedRideType}\n\n` +
      `Please confirm availability and price.`
    );

    // Open WhatsApp
    window.open(`https://wa.me/2347034909853?text=${message}`, "_blank");
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
            className={cn("pl-10", errors.pickup && "border-destructive")}
          />
        </div>
        {errors.pickup && (
          <p className="text-sm text-destructive">{errors.pickup}</p>
        )}
      </div>

      {/* Dropoff Location */}
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

      {/* Date & Time Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Date */}
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

        {/* Time */}
        <div className="space-y-2">
          <Label className="text-foreground font-medium">Time</Label>
          <Select value={time} onValueChange={setTime}>
            <SelectTrigger className={cn(errors.time && "border-destructive")}>
              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((slot) => (
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

      {/* Ride Type (if not selected from cards) */}
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
          <span className="text-sm text-muted-foreground">Selected:</span>
          <span className="font-semibold text-foreground">{selectedRideType}</span>
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" size="lg" variant="gold" className="w-full gap-2">
        <MessageCircle className="w-5 h-5" />
        Get Quote via WhatsApp
      </Button>
    </form>
  );
};

export default RideBookingForm;
