import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageCircle } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", href: "/", isRoute: true },
    { name: "Hotels", href: "/hotels", isRoute: true },
    { name: "Rides", href: "/rides", isRoute: true },
    { name: "Contact", href: "/contact", isRoute: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
  href="https://wa.me/2347034909853?text=Hello%2C%20Arewa%20Trips" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-green flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-xl text-foreground">
              Arewa<span className="text-accent">Trips</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {link.name}
                </a>
              )
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
  href="https://wa.me/2347034909853?text=Hello%2C%20Arewa%20Trips"
  target="_blank"
  rel="noopener noreferrer"
>
  <Button variant="outline" className="gap-2 justify-center">
    <MessageCircle className="w-4 h-4" />
    WhatsApp
  </Button>
</a>

<a
  href="https://wa.me/2347034909853?text=Hello%2C%20I%20want%20to%20book%20a%20ride%20with%20Arewa%20Trips"
  target="_blank"
  rel="noopener noreferrer"
>
  <Button className="justify-center w-full">
    Book Now
  </Button>
</a>

          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-6 animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) =>
                link.isRoute ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </a>
                )
              )}
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                <Button variant="outline" className="gap-2 justify-center">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Us
                </Button>
                <Link to="/rides" onClick={() => setIsOpen(false)}>
                  <Button className="justify-center w-full">Book Now</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
