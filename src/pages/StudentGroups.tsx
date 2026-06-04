import { FormEvent, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  createTravelGroup,
  fetchTravelGroups,
  joinTravelGroup,
  leaveTravelGroup,
  type TravelGroup,
} from "@/lib/groups";
import CheckoutModal from "@/components/rides/CheckoutModal";
import { useAuth } from "@/contexts/auth-context";
import GoogleAuthPanel from "@/components/auth/GoogleAuthPanel";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Banknote,
  Clock,
  GraduationCap,
  MapPin,
  Plus,
  ShieldCheck,
  Users,
} from "lucide-react";

const campusLocations = ["Unimaid Park", "Complex", "Hostel", "Education", "Main gate, Kashim Ibrahim University", "Post Office"];
const seatOptions = [1, 2, 3, 4];

const formatDepartureTime = (date: string) =>
  new Intl.DateTimeFormat("en-NG", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));

const StudentGroups = () => {
  const [groups, setGroups] = useState<TravelGroup[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(true);
  const [groupsError, setGroupsError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [seatsReserved, setSeatsReserved] = useState("1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [joiningGroupId, setJoiningGroupId] = useState<string | null>(null);
  const [leavingGroupId, setLeavingGroupId] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutGroup, setCheckoutGroup] = useState<TravelGroup | null>(null);
  const { user: authUser, isLoading: isLoadingAuth } = useAuth();

  const loadGroups = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) {
        setIsLoadingGroups(true);
      }
      setGroupsError(null);

      const activeGroups = await fetchTravelGroups(authUser?.id);
      setGroups(activeGroups);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to load active groups right now.";

      setGroupsError(message);
    } finally {
      if (showLoading) {
        setIsLoadingGroups(false);
      }
    }
  }, [authUser?.id]);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  const handleCreateGroup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!authUser) {
      toast({
        title: "Sign in required",
        description: "Please continue with Google before creating a group.",
        variant: "destructive",
      });
      return;
    }

    if (!currentLocation || !destination) {
      toast({
        title: "Route is required",
        description: "Choose both an origin and a destination.",
        variant: "destructive",
      });
      return;
    }

    if (currentLocation === destination) {
      toast({
        title: "Choose a different destination",
        description: "Origin and destination cannot be the same.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingGroup(true);

    try {
      await createTravelGroup({
        origin: currentLocation,
        destination,
        seatsReserved: Number(seatsReserved),
      });

      toast({
        title: "Travel group created successfully",
      });

      setCurrentLocation("");
      setDestination("");
      setSeatsReserved("1");
      setIsModalOpen(false);
      await loadGroups();
    } catch (error) {
      toast({
        title: "Could not create travel group",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingGroup(false);
    }
  };

  const handleJoinGroup = async (group: TravelGroup) => {
    if (!authUser) {
      toast({
        title: "Please login first",
        variant: "destructive",
      });
      return;
    }

    if (group.currentUserMembership) {
      toast({
        title: "Already joined this group",
      });
      return;
    }

    if (group.availableSeats < 1) {
      toast({
        title: "Group is already full",
        variant: "destructive",
      });
      return;
    }

    setJoiningGroupId(group.id);

    try {
      const joinedGroup = await joinTravelGroup(group.id);

      setGroups((currentGroups) =>
        currentGroups.map((currentGroup) =>
          currentGroup.id === joinedGroup.id ? joinedGroup : currentGroup
        )
      );

      toast({
        title: "Successfully joined group",
      });

      loadGroups(false).catch((error) => {
        console.error("[groups] Could not refresh groups after join:", error);
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to join group.";
      const toastTitle = message.includes("Already joined")
        ? "Already joined this group"
        : message.includes("full")
          ? "Group is already full"
          : message.includes("sign in") || message.includes("login")
            ? "Please login first"
            : "Could not join group";

      toast({
        title: toastTitle,
        description:
          toastTitle === "Could not join group" ? message : undefined,
        variant:
          toastTitle === "Already joined this group" ? "default" : "destructive",
      });

      await loadGroups(false);
    } finally {
      setJoiningGroupId(null);
    }
  };

  const handleLeaveGroup = async (group: TravelGroup) => {
    if (!authUser) return;

    setLeavingGroupId(group.id);

    try {
      const updatedGroup = await leaveTravelGroup(group.id);

      setGroups((currentGroups) =>
        currentGroups.map((currentGroup) =>
          currentGroup.id === updatedGroup.id ? updatedGroup : currentGroup
        )
      );

      toast({
        title: "Successfully left group",
      });

      loadGroups(false).catch((error) => {
        console.error("[groups] Could not refresh groups after leave:", error);
      });
    } catch (error) {
      toast({
        title: "Could not leave group",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLeavingGroupId(null);
    }
  };

  const isCreateButtonDisabled =
    isCreatingGroup ||
    !authUser ||
    !currentLocation ||
    !destination ||
    !seatsReserved;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-green">
        <div className="container mx-auto px-4">
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-primary-foreground/70">
              <li>
                <Link to="/" className="hover:text-primary-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li className="text-primary-foreground font-medium">Student Groups</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm font-semibold text-primary-foreground mb-5">
              <GraduationCap className="w-4 h-4" />
              Student group booking
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-4">
              Travel Together With Fixed Student Pricing
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/85 max-w-2xl">
              Join an active group or create one in seconds. No complicated apps,
              just simple booking and real Arewa Trips support.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 border-b border-border bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Banknote,
                title: "Fixed Pricing",
                text: "Student-friendly fares confirmed before departure.",
              },
              {
                icon: Users,
                title: "Instant Groups",
                text: "Create a group ride and reserve your seats immediately.",
              },
              {
                icon: ShieldCheck,
                title: "Real Support",
                text: "A local Arewa Trips contact helps keep each group organized.",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground">{item.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {(!authUser || isLoadingAuth) && (
            <div className="mb-8">
              <GoogleAuthPanel />
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">
            <div>
              <p className="text-sm font-semibold uppercase text-primary mb-2">
                Active Groups
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground">
                Find students heading your way
              </h2>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                These open groups show students heading the same way right now.
              </p>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="sm:self-start"
                  disabled={!authUser || isLoadingAuth}
                >
                  <Plus className="w-5 h-5" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create a New Student Group</DialogTitle>
                  <DialogDescription>
                    Choose your route and how many seats you want to reserve.
                  </DialogDescription>
                </DialogHeader>

                <form className="space-y-5" onSubmit={handleCreateGroup}>
                  <div className="space-y-2">
                    <Label htmlFor="current-location">Current Location</Label>
                    <Select value={currentLocation} onValueChange={setCurrentLocation} required>
                      <SelectTrigger id="current-location">
                        <SelectValue placeholder="Choose departure point" />
                      </SelectTrigger>
                      <SelectContent>
                        {campusLocations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <Select value={destination} onValueChange={setDestination} required>
                      <SelectTrigger id="destination">
                        <SelectValue placeholder="Choose campus" />
                      </SelectTrigger>
                      <SelectContent>
                        {campusLocations.map((campus) => (
                          <SelectItem key={campus} value={campus}>
                            {campus}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seats-reserved">Seats Reserved</Label>
                    <Select
                      value={seatsReserved}
                      onValueChange={setSeatsReserved}
                      required
                    >
                      <SelectTrigger id="seats-reserved">
                        <SelectValue placeholder="Choose seats" />
                      </SelectTrigger>
                      <SelectContent>
                        {seatOptions.map((seats) => (
                          <SelectItem key={seats} value={String(seats)}>
                            {seats}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isCreateButtonDisabled}
                  >
                    <Plus className="w-4 h-4" />
                    {isCreatingGroup ? "Creating..." : "Create Group"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {isLoadingGroups && (
            <div className="rounded-xl border border-border bg-card p-6 text-muted-foreground">
              Loading active student groups...
            </div>
          )}

          {groupsError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-destructive">
              {groupsError}
            </div>
          )}

          {!isLoadingGroups && !groupsError && groups.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-6 text-muted-foreground">
              No active student groups are open right now.
            </div>
          )}

          {!isLoadingGroups && !groupsError && groups.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {groups.map((group) => {
                const hasJoined = Boolean(group.currentUserMembership);
                const isFull = group.availableSeats < 1;
                const isJoining = joiningGroupId === group.id;
                const joinButtonLabel = isJoining
                  ? "Joining..."
                  : hasJoined
                    ? "Joined"
                    : isFull
                      ? "Group Full"
                      : "Join Group";
                const isJoinDisabled =
                  isJoining ||
                  hasJoined ||
                  isFull ||
                  group.status !== "open" ||
                  isLoadingAuth;

                return (
                  <article
                    key={group.id}
                    className="rounded-xl border border-border bg-card p-5 card-elevated"
                  >
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                        Open
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold uppercase text-muted-foreground">
                          Origin
                        </p>
                        <h3 className="text-lg font-bold text-foreground mt-1">
                          {group.origin}
                        </h3>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase text-muted-foreground">
                          Destination
                        </p>
                        <p className="font-semibold text-foreground mt-1">
                          {group.destination}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>Departure time: {formatDepartureTime(group.expiry_date)}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-lg bg-secondary p-3">
                          <p className="text-xs font-semibold uppercase text-muted-foreground">
                            Seats left
                          </p>
                          <p className="font-bold text-foreground mt-1">
                            {group.availableSeats}
                          </p>
                        </div>
                        <div className="rounded-lg bg-secondary p-3">
                          <p className="text-xs font-semibold uppercase text-muted-foreground">
                            Members
                          </p>
                          <p className="font-bold text-foreground mt-1">
                            {group.joinedMemberCount}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Users className="w-4 h-4 text-primary" />
                        <span>
                          {group.joinedSeats}/{group.max_members} seats reserved
                        </span>
                      </div>

                      {hasJoined ? (
                        isFull ? (
                          <Button
                            type="button"
                            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-extrabold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                            onClick={() => {
                              setCheckoutGroup(group);
                              setIsCheckoutOpen(true);
                            }}
                          >
                            Proceed to Checkout
                          </Button>
                        ) : (
                          <div className="flex gap-2 w-full">
                            <Button
                              type="button"
                              className="flex-grow"
                              disabled
                              variant="secondary"
                            >
                              Joined (Waiting...)
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              disabled={leavingGroupId === group.id}
                              onClick={() => handleLeaveGroup(group)}
                            >
                              {leavingGroupId === group.id ? "Leaving..." : "Leave"}
                            </Button>
                          </div>
                        )
                      ) : isFull ? (
                        <Button
                          type="button"
                          className="w-full"
                          disabled
                          variant="secondary"
                        >
                          Group Full
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                          disabled={joiningGroupId === group.id || isLoadingAuth}
                          onClick={() => handleJoinGroup(group)}
                        >
                          {joiningGroupId === group.id ? "Joining..." : "Join Group"}
                        </Button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {checkoutGroup && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onOpenChange={(open) => {
            setIsCheckoutOpen(open);
            if (!open) setCheckoutGroup(null);
          }}
          groupId={checkoutGroup.id}
          origin={checkoutGroup.origin}
          destination={checkoutGroup.destination}
          pricePerSeat={500}
          passengerName={authUser?.user_metadata?.full_name || authUser?.user_metadata?.name || authUser?.email || "Arewa Trips Passenger"}
          onCheckoutSuccess={async () => {
            await loadGroups(false);
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default StudentGroups;
