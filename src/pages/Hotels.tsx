import { useEffect, useState } from "react";
import { Banknote, MapPin, MessageCircle, Shield, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import type { Hotel } from "@/types/hotel";


type HotelListItem = Pick<
  Hotel,
  "id" | "name" | "slug" | "city" | "thumbnail" | "rating" | "price_from"
>;

const trustSignals = [
  { icon: Shield, title: "Verified Hotels", description: "All our partner hotels are personally vetted" },
  { icon: Banknote, title: "No Online Payment", description: "Pay directly at the hotel, no advance required" },
  { icon: MessageCircle, title: "WhatsApp Support", description: "Get instant updates and support via WhatsApp" },
];

const formatNaira = (price: number) => `₦${price.toLocaleString("en-NG")}`;

const Hotels = () => {

  const [hotels, setHotels] = useState<HotelListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHotels() {
      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase
          .from("hotels")
          .select(`
            id,
            name,
            slug,
            city,
            thumbnail,
            rating,
            price_from
          `)
          .eq("is_active", true)
          .order("created_at", { ascending: false });

        if (cancelled) return;

        if (fetchError) {
          console.error("[Hotels] Failed to load hotels:", fetchError);
          setError("Unable to load hotels right now. Please try again shortly.");
        } else {
          setHotels((data ?? []) as HotelListItem[]);
        }
      } catch (fetchError) {
        console.error("[Hotels] Failed to load hotels:", fetchError);
        if (!cancelled) setError("Unable to load hotels right now. Please try again shortly.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadHotels();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
  <>
    <Helmet>
      <title>Hotels in Maiduguri | Arewa Trips</title>

      <meta
        name="description"
        content="Browse verified hotels in Maiduguri. Compare rooms, check prices and book on WhatsApp easily with Arewa Trips."
      />

      <link
        rel="canonical"
        href="https://arewatrips.netlify.app/hotels"
      />
    </Helmet>

    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="bg-gradient-green pb-12 pt-24 md:pb-16 md:pt-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 animate-fade-up text-3xl font-extrabold text-primary-foreground md:text-4xl lg:text-5xl">
              Book Trusted Hotels in Maiduguri
            </h1>
            <p className="mb-3 animate-fade-up text-lg text-primary-foreground/90 md:text-xl" style={{ animationDelay: "0.1s" }}>
              Verified hotels • No online payment • Pay at hotel
            </p>
            <p className="animate-fade-up text-sm text-primary-foreground/70" style={{ animationDelay: "0.2s" }}>
              Select a hotel to explore its rooms and availability.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background py-8">
        <div className="container mx-auto grid grid-cols-1 gap-6 px-4 md:grid-cols-3">
          {trustSignals.map((signal, index) => (
            <div key={signal.title} className="flex items-center justify-center gap-4 animate-fade-up md:justify-start" style={{ animationDelay: `${0.1 * index}s` }}>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
                <signal.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{signal.title}</h2>
                <p className="text-sm text-muted-foreground">{signal.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {isLoading && <p className="text-center text-muted-foreground">Loading hotels...</p>}
          {error && <p className="text-center text-destructive" role="alert">{error}</p>}
          {!isLoading && !error && !hotels.length && (
            <p className="text-center text-muted-foreground">No hotels are available right now.</p>
          )}

          {!isLoading && !error && hotels.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {hotels.map((hotel, index) => (
                <Link
                  key={hotel.id}
                  to={`/hotels/${hotel.slug}`}
                  className="group block animate-fade-up overflow-hidden rounded-xl bg-card text-left card-elevated focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  style={{ animationDelay: `${0.05 * index}s` }}
                  aria-label={`View ${hotel.name}`}
                >
                  <div className="relative h-52 overflow-hidden bg-muted">
                    {hotel.thumbnail ? (
                      <img src={hotel.thumbnail} alt={hotel.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm font-medium text-muted-foreground">Image unavailable</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h2 className="text-lg font-bold text-foreground">{hotel.name}</h2>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-4 w-4" aria-hidden="true" />{hotel.city}</p>
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Starting from</p>
                        <p className="text-xl font-extrabold text-accent">
                          {hotel.price_from === null ? "Rate unavailable" : formatNaira(hotel.price_from)}
                          {hotel.price_from !== null && <span className="text-sm font-medium text-muted-foreground"> / night</span>}
                        </p>
                      </div>
                      <p className="flex items-center gap-1 text-sm font-semibold text-foreground">
                        <Star className="h-4 w-4 fill-accent text-accent" aria-hidden="true" />
                        {hotel.rating === null ? "New" : hotel.rating.toFixed(1)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  </>
  );
};

export default Hotels;
