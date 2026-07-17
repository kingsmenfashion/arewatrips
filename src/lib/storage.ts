import { supabase } from "./supabase";

const HOTEL_IMAGES_BUCKET = "hotel-images";

/**
 * Returns the public URL for an image stored in the hotel-images bucket.
 *
 * @param path - Object path relative to the bucket, for example `arewa-grand/thumbnail.jpg`.
 */
export function getHotelImageUrl(path: string): string {
  if (!path.trim()) {
    throw new Error("A hotel image path is required.");
  }

  const { data } = supabase.storage
    .from(HOTEL_IMAGES_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
}

/**
 * Uploads a hotel image and returns its public URL.
 *
 * @param file - The image file to upload.
 * @param hotelSlug - The hotel's URL-safe slug, used as its storage folder.
 * @param fileName - The filename to use in the hotel's storage folder.
 */
export async function uploadHotelImage(
  file: File,
  hotelSlug: string,
  fileName: string,
): Promise<string> {
  if (!file) {
    throw new Error("A hotel image file is required.");
  }

  if (!hotelSlug.trim() || !fileName.trim()) {
    throw new Error("Both hotel slug and image filename are required.");
  }

  const path = `${hotelSlug.trim()}/${fileName.trim()}`;
  const { error } = await supabase.storage.from(HOTEL_IMAGES_BUCKET).upload(path, file, {
    cacheControl: "3600",
    contentType: file.type || undefined,
    upsert: true,
  });

  if (error) {
    console.error("[storage] Failed to upload hotel image:", error.message);
    throw new Error(`Unable to upload hotel image: ${error.message}`);
  }

  return getHotelImageUrl(path);
}

/**
 * Deletes an image from the hotel-images bucket.
 *
 * @param path - Object path relative to the bucket, for example `arewa-grand/image1.jpg`.
 */
export async function deleteHotelImage(path: string): Promise<void> {
  if (!path.trim()) {
    throw new Error("A hotel image path is required.");
  }

  const { error } = await supabase.storage
    .from(HOTEL_IMAGES_BUCKET)
    .remove([path]);

  if (error) {
    console.error("[storage] Failed to delete hotel image:", error.message);
    throw new Error(`Unable to delete hotel image: ${error.message}`);
  }
}
