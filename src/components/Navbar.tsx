import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "@/hooks/use-toast";
import { signInWithGoogle, signOut, type AuthUser } from "@/lib/auth";
import { LogOut, Menu, MessageCircle, X } from "lucide-react";

const getDisplayName = (user: AuthUser) =>
  user.user_metadata?.full_name ||
  user.user_metadata?.name ||
  user.email ||
  "Signed-in user";

const getAvatarUrl = (user: AuthUser) =>
  user.user_metadata?.avatar_url || user.user_metadata?.picture || "";

const getInitial = (name: string) => name.trim().charAt(0).toUpperCase() || "?";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthActionPending, setIsAuthActionPending] = useState(false);
  const { user, isLoading } = useAuth();
  const displayName = user ? getDisplayName(user) : "";
  const avatarUrl = user ? getAvatarUrl(user) : "";

  const handleGoogleSignIn = async () => {
    try {
      setIsAuthActionPending(true);
      await signInWithGoogle();
    } catch (error) {
      toast({
        title: "Could not start Google sign in",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
      setIsAuthActionPending(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsAuthActionPending(true);
      await signOut();
      toast({ title: "Signed out successfully" });
    } catch (error) {
      toast({
        title: "Could not sign out",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAuthActionPending(false);
    }
  };

  const navLinks = [
    { name: "Home", href: "/", isRoute: true },
    { name: "Hotels", href: "/hotels", isRoute: true },
    { name: "Rides", href: "/rides", isRoute: true },
    { name: "Contact", href: "/contact", isRoute: true },
  ];

  const renderAccountMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-full outline-none ring-offset-background transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Open account menu"
        >
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={displayName} />}
            <AvatarFallback className="bg-secondary text-sm font-bold text-primary">
              {user ? getInitial(displayName) : "?"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {user ? (
          <>
            <DropdownMenuLabel className="space-y-1">
              <p className="truncate font-semibold">{displayName}</p>
              {user.email && (
                <p className="truncate text-xs font-normal text-muted-foreground">
                  {user.email}
                </p>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              disabled={isAuthActionPending}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {isAuthActionPending ? "Signing out..." : "Logout"}
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            onClick={handleGoogleSignIn}
            disabled={isLoading || isAuthActionPending}
            className="cursor-pointer"
          >
            {isAuthActionPending ? "Redirecting..." : "Sign In with Google"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
  href="https://wa.me/2348022444596?text=Hello%2C%20Arewa%20Trips" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
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
  href="https://wa.me/2348022444596?text=Hello%2C%20Arewa%20Trips"
  target="_blank"
  rel="noopener noreferrer"
>
  <Button variant="outline" className="gap-2 justify-center">
    <MessageCircle className="w-4 h-4" />
    WhatsApp
  </Button>
</a>

<Button asChild className="justify-center w-full">
  <Link to="/rides">Book Now</Link>
</Button>

            {renderAccountMenu()}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            {renderAccountMenu()}
            <button
              className="p-2 text-foreground"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
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
