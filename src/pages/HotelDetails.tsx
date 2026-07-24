import { useCallback, useEffect, useMemo, useState } from "react";
import { MapPin, Users } from "lucide-react";
import { useParams } from "react-router-dom";
import { HotelCarousel } from "@/components/hotels/HotelCarousel";
import { RoomSelector } from "@/components/hotels/RoomSelector";
import { supabase } from "@/lib/supabase";
import type { Hotel, HotelAmenity, HotelImage, HotelRoom } from "@/types/hotel";

const formatNaira = (price: number) => `₦${price.toLocaleString("en-NG")}`;
const formatTime = (time: string | null) => (time ? time.slice(0, 5) : "Not specified");

export default function HotelDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [hotelImages, setHotelImages] = useState<HotelImage[]>([]);
  const [amenities, setAmenities] = useState<HotelAmenity[]>([]);
  const [hotelRooms, setHotelRooms] = useState<HotelRoom[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<HotelRoom | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const imageUrls = useMemo(
    () => hotelImages.map((image) => image.image_url).filter(Boolean),
    [hotelImages],
  );

  const selectRoom = useCallback(
    (room: HotelRoom) => {
      setSelectedRoom(room);
      setExpanded(false);

      const imageIndex = room.image_url
        ? imageUrls.findIndex((imageUrl) => imageUrl === room.image_url)
        : -1;
      if (imageIndex >= 0) setCurrentImage(imageIndex);
    },
    [imageUrls],
  );

  const selectImage = useCallback(
    (index: number) => {
      setCurrentImage(index);
      const matchingRoom = hotelRooms.find((room) => room.image_url === imageUrls[index]);

      if (matchingRoom) {
        setSelectedRoom(matchingRoom);
        setExpanded(false);
      }
    },
    [hotelRooms, imageUrls],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadHotel() {
      if (!slug) {
        setError("A valid hotel link is required.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setHotel(null);
      setHotelImages([]);
      setAmenities([]);
      setHotelRooms([]);
      setSelectedRoom(null);
      setExpanded(false);
      setCurrentImage(0);

      try {
        const { data: hotelData, error: hotelError } = await supabase
          .from("hotels")
          .select("*")
          .eq("slug", slug)
          .single();

        if (hotelError) {
          if (hotelError.code === "PGRST116") return;
          throw hotelError;
        }

        const [imagesResult, amenitiesResult, roomsResult] = await Promise.all([
          supabase.from("hotel_images").select("*").eq("hotel_id", hotelData.id).order("sort_order"),
          supabase.from("hotel_amenities").select("*").eq("hotel_id", hotelData.id),
          supabase
            .from("hotel_rooms")
            .select("*")
            .eq("hotel_id", hotelData.id)
            .eq("is_available", true),
        ]);
        const relatedError = [imagesResult.error, amenitiesResult.error, roomsResult.error].find(
          Boolean,
        );
        if (relatedError) throw relatedError;
        if (cancelled) return;

        const fetchedImages = (imagesResult.data ?? []) as HotelImage[];
        const fetchedRooms = (roomsResult.data ?? []) as HotelRoom[];
        const initialRoom = fetchedRooms[0] ?? null;
        const initialImageIndex = initialRoom?.image_url
          ? fetchedImages.findIndex((image) => image.image_url === initialRoom.image_url)
          : -1;

        setHotel(hotelData as Hotel);
        setHotelImages(fetchedImages);
        setAmenities((amenitiesResult.data ?? []) as HotelAmenity[]);
        setHotelRooms(fetchedRooms);
        setSelectedRoom(initialRoom);
        setCurrentImage(initialImageIndex >= 0 ? initialImageIndex : 0);
      } catch (loadError) {
        console.error("[HotelDetails] Failed to load hotel:", loadError);
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load this hotel.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadHotel();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleBookNow = useCallback(() => {
    if (!hotel || !selectedRoom) return;
    const formattedPrice = selectedRoom.price.toLocaleString("en-NG");
    const message = `Hello Arewa Trips,\n\nI would like to book a hotel.\n\nHotel: ${hotel.name}\nRoom: ${selectedRoom.name}\nPrice: ₦${formattedPrice}\n \nper night \n\n\nThank you.`;
    window.open(`https://wa.me/2348022444956?text=${encodeURIComponent(message)}`, "_blank");
  }, [hotel, selectedRoom]);

  if (isLoading) return <main className="p-6 text-center text-muted-foreground">Loading hotel...</main>;
  if (error) return <main className="p-6 text-center text-destructive" role="alert">{error}</main>;
  if (!hotel) return <main className="p-6 text-center text-muted-foreground">Hotel not found.</main>;

  const roomDescription = expanded
    ? selectedRoom?.full_description ?? selectedRoom?.short_description
    : selectedRoom?.short_description;


  return (
    <main className="min-h-screen bg-background pb-24 font-sans">
      <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 sm:py-8">
        <HotelCarousel
          images={imageUrls}
          currentImage={currentImage}
          onImageChange={selectImage}
        />

        <section className="mt-6 rounded-lg bg-card p-5 shadow-sm sm:p-6">
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {hotel.city}, Nigeria
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {hotel.name}
          </h1>

          <div className="mt-5 border-y border-border py-4">
            <p className="text-sm font-medium text-muted-foreground">{selectedRoom?.name ?? "Room rate"}</p>
            <p className="mt-1 text-3xl font-extrabold text-accent">
              {selectedRoom ? formatNaira(selectedRoom.price) : "Rate unavailable"}
              {selectedRoom && <span className="text-sm font-medium text-muted-foreground"> / Night</span>}
            </p>
          </div>

          <div className="mt-6">
            <RoomSelector rooms={hotelRooms} selectedRoom={selectedRoom} onSelect={selectRoom} />
          </div>

          {selectedRoom && (
            <section className="mt-6" aria-labelledby="room-description-heading">
              <h2 id="room-description-heading" className="text-base font-bold text-foreground">Room details</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {roomDescription || "Room description is not available."}
              </p>
              {selectedRoom.full_description && (
                <button
                  type="button"
                  onClick={() => setExpanded((value) => !value)}
                  className="mt-2 text-sm font-bold text-primary hover:text-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {expanded ? "See less" : "See more"}
                </button>
              )}
              <p className="mt-4 flex items-center gap-2 text-sm font-medium text-foreground">
                <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                {selectedRoom.capacity
                  ? `Sleeps ${selectedRoom.capacity} ${selectedRoom.capacity === 1 ? "Guest" : "Guests"}`
                  : "Capacity not specified"}
              </p>
            </section>
          )}

          <section className="mt-6 border-t border-border pt-6" aria-labelledby="amenities-heading">
            <h2 id="amenities-heading" className="text-base font-bold text-foreground">Hotel amenities</h2>
            {amenities.length ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {amenities.map((amenity) => (
                  <li key={amenity.id} className="rounded-full bg-secondary px-3 py-1.5 text-sm text-secondary-foreground">
                    {amenity.name}
                  </li>
                ))}
              </ul>
            ) : <p className="mt-2 text-sm text-muted-foreground">Amenities are not listed yet.</p>}
          </section>

          <section className="mt-6 border-t border-border pt-6" aria-labelledby="policies-heading">
            <h2 id="policies-heading" className="text-base font-bold text-foreground">Hotel policies</h2>
            <dl className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-muted-foreground">Check-in</dt><dd className="mt-1 font-semibold text-foreground">{formatTime(hotel.check_in_time)}</dd></div>
              <div><dt className="text-muted-foreground">Check-out</dt><dd className="mt-1 font-semibold text-foreground">{formatTime(hotel.check_out_time)}</dd></div>
            </dl>
          </section>
        </section>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <p className="text-lg font-extrabold text-accent">{selectedRoom ? formatNaira(selectedRoom.price) : "Unavailable"}</p>
          <button
            type="button"
            disabled={!selectedRoom}
            onClick={handleBookNow}
            className="rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Book now
          </button>
        </div>
      </footer>
    </main>
  );
}
