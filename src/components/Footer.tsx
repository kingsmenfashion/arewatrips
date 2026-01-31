import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: "Hotel Booking", href: "#services" },
      { name: "Ride Booking", href: "#services" },
      { name: "Airport Transfers", href: "#services" },
      { name: "City Tours", href: "#services" },
    ],
    company: [
      { name: "About Us", href: "#how-it-works" },
      { name: "How It Works", href: "#how-it-works" },
      { name: "Testimonials", href: "#testimonials" },
      { name: "Contact", href: "#contact" },
    ],
    support: [
      { name: "FAQs", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Cancellation Policy", href: "#" },
    ],
  };

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-xl">
                Arewa<span className="text-accent">Trips</span>
              </span>
            </a>
            <p className="text-primary-foreground/70 mb-6 max-w-sm">
              Your trusted travel partner in Northern Nigeria. Verified hotels, 
              reliable rides, and personal WhatsApp support.
            </p>
            <div className="space-y-3">
              <a
                href="#"
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span>+234 703 490 9853</span>
              </a>
              <a
                href="mailto:hello@arewatrips.com"
                className="flex items-center gap-3 text-primary-foreground/70 hover:text-accent transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>hello@arewatrips.com</span>
              </a>
              <div className="flex items-center gap-3 text-primary-foreground/70">
                <MapPin className="w-5 h-5" />
                <span>Maiduguri, Borno State, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {currentYear} Arewa Trips. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-primary-foreground/60 hover:text-accent transition-colors text-sm"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-primary-foreground/60 hover:text-accent transition-colors text-sm"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-primary-foreground/60 hover:text-accent transition-colors text-sm"
            >
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
