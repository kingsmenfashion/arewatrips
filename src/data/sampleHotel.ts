import type { Hotel, HotelAmenity, HotelImage } from "../types/hotel";

const SAMPLE_HOTEL_ID = "e7e9b7c8-0ec2-4fe2-b2c3-9f455fdf5948";
const SAMPLE_HOTEL_SLUG = "maiduguri-grand-hotel";
const HOTEL_IMAGES_BASE_URL =
  "https://zenpclsjumslwuivbfmz.supabase.co/storage/v1/object/public/hotel-images";

/**
 * Sample Maiduguri hotel data for local development and component mock rendering.
 */
export const sampleHotel: Hotel = {
  id: SAMPLE_HOTEL_ID,
  name: "Maiduguri Grand Hotel",
  slug: SAMPLE_HOTEL_SLUG,
  city: "Maiduguri",
  address: "No. 12 Shehu Laminu Way, GRA, Maiduguri, Borno State, Nigeria",
  short_description:
    "A comfortable city hotel in Maiduguri's GRA, close to business and cultural landmarks.",
  full_description:
    "Maiduguri Grand Hotel offers thoughtfully furnished rooms, attentive service, and convenient access to the city's commercial district. Guests can relax by the pool, enjoy regional and continental dining, or use the on-site meeting facilities.",
  thumbnail: `${HOTEL_IMAGES_BASE_URL}/${SAMPLE_HOTEL_SLUG}/thumbnail.jpg`,
  phone_number: "+234 806 123 4567",
  email: "reservations@maidugurigrand.example",
  website: "https://maidugurigrand.example",
  rating: 4.3,
  price_from: 45000,
  check_in_time: "14:00:00",
  check_out_time: "12:00:00",
  is_active: true,
  created_at: "2026-01-15T09:00:00.000Z",
  updated_at: "2026-07-15T14:30:00.000Z",
};

/**
 * Sample hotel image records associated with {@link sampleHotel}.
 */
export const sampleHotelImages: HotelImage[] = [
  {
    id: "c8c2385f-1f59-4c62-b315-734e7b2cc3b7",
    hotel_id: SAMPLE_HOTEL_ID,
    image_url: `${HOTEL_IMAGES_BASE_URL}/${SAMPLE_HOTEL_SLUG}/thumbnail.jpg`,
    sort_order: 0,
    created_at: "2026-01-15T09:00:00.000Z",
  },
  {
    id: "b6fd3280-4136-4751-9e0b-986f47b8e4bc",
    hotel_id: SAMPLE_HOTEL_ID,
    image_url: `${HOTEL_IMAGES_BASE_URL}/${SAMPLE_HOTEL_SLUG}/image1.jpg`,
    sort_order: 1,
    created_at: "2026-01-15T09:00:00.000Z",
  },
  {
    id: "2727b8df-27c7-4f96-908d-d44ea1e9a9e5",
    hotel_id: SAMPLE_HOTEL_ID,
    image_url: `${HOTEL_IMAGES_BASE_URL}/${SAMPLE_HOTEL_SLUG}/image2.jpg`,
    sort_order: 2,
    created_at: "2026-01-15T09:00:00.000Z",
  },
];

/**
 * Sample amenity records associated with {@link sampleHotel}.
 */
export const sampleHotelAmenities: HotelAmenity[] = [
  {
    id: "59d07d7c-c7ea-4d75-b65b-0ab55c490e22",
    hotel_id: SAMPLE_HOTEL_ID,
    amenity_name: "Complimentary Wi-Fi",
    created_at: "2026-01-15T09:00:00.000Z",
  },
  {
    id: "3abc4e1a-4664-444e-9902-9378e879b1d6",
    hotel_id: SAMPLE_HOTEL_ID,
    amenity_name: "Swimming pool",
    created_at: "2026-01-15T09:00:00.000Z",
  },
  {
    id: "a5aa7bf9-1c1d-4e2a-84aa-94825b7e91c5",
    hotel_id: SAMPLE_HOTEL_ID,
    amenity_name: "24-hour front desk",
    created_at: "2026-01-15T09:00:00.000Z",
  },
  {
    id: "0b7e16d6-8a83-4788-bf7a-75a66ec355b4",
    hotel_id: SAMPLE_HOTEL_ID,
    amenity_name: "On-site restaurant",
    created_at: "2026-01-15T09:00:00.000Z",
  },
  {
    id: "c7654cc1-85bb-4682-abba-dbbec476f2ae",
    hotel_id: SAMPLE_HOTEL_ID,
    amenity_name: "Secure parking",
    created_at: "2026-01-15T09:00:00.000Z",
  },
];
