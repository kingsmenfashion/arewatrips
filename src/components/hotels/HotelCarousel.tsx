import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type HotelCarouselProps = {
  images: string[];
  currentImage: number;
  onImageChange: (index: number) => void;
};

const SWIPE_THRESHOLD = 48;

/**
 * Controlled hotel image carousel with thumbnail, navigation, and swipe support.
 */
export function HotelCarousel({
  images,
  currentImage,
  onImageChange,
}: HotelCarouselProps) {
  const touchStartX = useRef<number | null>(null);
  const activeIndex = Math.min(Math.max(currentImage, 0), Math.max(images.length - 1, 0));
  const hasMultipleImages = images.length > 1;

  const changeImage = (index: number) => {
    if (!images.length) return;
    onImageChange((index + images.length) % images.length);
  };

  const handlePointerUp = (clientX: number) => {
    if (touchStartX.current === null) return;

    const distance = clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(distance) < SWIPE_THRESHOLD) return;
    changeImage(distance > 0 ? activeIndex - 1 : activeIndex + 1);
  };

  if (!images.length) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-lg bg-muted text-sm font-medium text-muted-foreground">
        No hotel images available.
      </div>
    );
  }

  return (
    <section className="w-full font-sans" aria-label="Hotel image gallery">
      <div
        className="group relative aspect-[4/3] touch-pan-y overflow-hidden rounded-lg bg-muted sm:aspect-[16/10]"
        onPointerDown={(event) => {
          touchStartX.current = event.clientX;
        }}
        onPointerUp={(event) => handlePointerUp(event.clientX)}
        onPointerCancel={() => {
          touchStartX.current = null;
        }}
      >
        <img
          src={images[activeIndex]}
          alt={`Hotel image ${activeIndex + 1} of ${images.length}`}
          className="h-full w-full object-cover transition-transform duration-300 motion-reduce:transition-none"
        />

        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={() => changeImage(activeIndex - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-primary p-2 text-primary-foreground shadow-md transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Show previous image"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => changeImage(activeIndex + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-primary p-2 text-primary-foreground shadow-md transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Show next image"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Choose a hotel image">
        {images.map((image, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => changeImage(index)}
              className={`h-16 w-20 shrink-0 overflow-hidden rounded-md border-2 transition sm:h-20 sm:w-28 ${
                isActive
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-transparent hover:border-accent focus:border-primary"
              } focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`}
              aria-label={`Show hotel image ${index + 1}`}
              aria-current={isActive ? "true" : undefined}
            >
              <img
                src={image}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
