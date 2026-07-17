import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import type { Hotel, HotelAmenity, HotelImage } from "@/types/hotel";
import { HotelCarousel } from "../components/hotels/HotelCarousel";
type HotelRoom = Record<string, unknown>;

export default function HotelDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [images, setImages] = useState<HotelImage[]>([]);
  const [amenities, setAmenities] = useState<HotelAmenity[]>([]);
  const [rooms, setRooms] = useState<HotelRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function fetchHotelDetails() {
      if (!slug) {
        if (isMounted) {
          setError("A hotel slug is required.");
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setError(null);
      setHotel(null);

      try {
        const { data: hotelData, error: hotelError } = await supabase
          .from("hotels")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (hotelError) throw hotelError;
        if (!hotelData) return;

        const [imagesResult, amenitiesResult, roomsResult] = await Promise.all([
          supabase.from("hotel_images").select("*").eq("hotel_id", hotelData.id),
          supabase.from("hotel_amenities").select("*").eq("hotel_id", hotelData.id),
          supabase.from("hotel_rooms").select("*").eq("hotel_id", hotelData.id),
        ]);

        const relatedError = [imagesResult.error, amenitiesResult.error, roomsResult.error].find(
          Boolean,
        );
        if (relatedError) throw relatedError;

        const fetchedHotel = hotelData as Hotel;
        const fetchedImages = (imagesResult.data ?? []) as HotelImage[];
        const fetchedAmenities = (amenitiesResult.data ?? []) as HotelAmenity[];
        const fetchedRooms = (roomsResult.data ?? []) as HotelRoom[];

        console.log("[HotelDetails] Fetched hotel data:", {
          hotel: fetchedHotel,
          images: fetchedImages,
          amenities: fetchedAmenities,
          rooms: fetchedRooms,
        });

        if (isMounted) {
          setHotel(fetchedHotel);
          setImages(fetchedImages);
          setAmenities(fetchedAmenities);
          setRooms(fetchedRooms);
        }
      } catch (fetchError) {
        console.error("[HotelDetails] Failed to fetch hotel data:", fetchError);
        if (isMounted) {
          setError(fetchError instanceof Error ? fetchError.message : "Unable to load hotel.");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void fetchHotelDetails();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) return <p>Loading hotel...</p>;
  if (error) return <p role="alert">{error}</p>;
  if (!hotel) return <p>Hotel not found.</p>;

  return <HotelCarousel
   images={images.map((img) => img.image_url)}
    currentImage={currentImage}
    onImageChange={setCurrentImage}
/>;
}
