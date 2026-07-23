/**
 * Represents a hotel record returned from the `hotels` table.
 */
export interface Hotel {
  id: string;
  name: string;
  slug: string;
  city: string;
  address: string;
  short_description: string | null;
  full_description: string | null;
  thumbnail: string | null;
  phone_number: string | null;
  email: string | null;
  website: string | null;
  rating: number | null;
  price_from: number | null;
  check_in_time: string | null;
  check_out_time: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

/**
 * Represents an image associated with a hotel in the `hotel_images` table.
 */
export interface HotelImage {
  id: string;
  hotel_id: string | null;
  image_url: string;
  sort_order: number | null;
  created_at: string | null;
}

/**
 * Represents an amenity associated with a hotel in the `hotel_amenities` table.
 */
export interface HotelAmenity {
  id: string;
  hotel_id: string | null;
  name: string;
  created_at: string | null;
}

/**
 * Represents an available room variant associated with a hotel.
 */
export interface HotelRoom {
  id: string;
  hotel_id: string | null;
  name: string;
  short_description: string | null;
  full_description: string | null;
  price: number;
  capacity: number | null;
  image_url: string | null;
  image_index: number | null;
  is_available: boolean | null;
}

/**
 * Represents a hotel together with its related images and amenities.
 */
export interface HotelDetails {
  hotel: Hotel;
  images: HotelImage[];
  amenities: HotelAmenity[];
}
