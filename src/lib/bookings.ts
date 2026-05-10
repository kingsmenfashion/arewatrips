import { format } from "date-fns";
import { supabase } from "@/lib/supabase";

export type RideBookingInput = {
  pickup: string;
  dropoff: string;
  date: Date;
  time: string;
  rideType: string;
};

export type HotelBookingInput = {
  hotelName: string;
  roomType: string;
  pricePerNight: number;
  checkInDate: Date;
  checkOutDate: Date;
};

export const createRideBooking = async (booking: RideBookingInput) => {
  if (!supabase) {
    return;
  }

  const { error } = await supabase.from("ride_bookings").insert({
    pickup: booking.pickup,
    dropoff: booking.dropoff,
    booking_date: format(booking.date, "yyyy-MM-dd"),
    booking_time: booking.time,
    ride_type: booking.rideType,
    status: "new",
  });

  if (error) {
    throw error;
  }
};

export const createHotelBooking = async (booking: HotelBookingInput) => {
  if (!supabase) {
    return;
  }

  const { error } = await supabase.from("hotel_bookings").insert({
    hotel_name: booking.hotelName,
    room_type: booking.roomType,
    price_per_night: booking.pricePerNight,
    check_in_date: format(booking.checkInDate, "yyyy-MM-dd"),
    check_out_date: format(booking.checkOutDate, "yyyy-MM-dd"),
    status: "new",
  });

  if (error) {
    throw error;
  }
};
