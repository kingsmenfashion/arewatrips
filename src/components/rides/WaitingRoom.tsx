import React from "react";
import { Users, X, Share2, MessageCircle, AlertCircle, Phone } from "lucide-react";
import { Pool } from "./GroupCard";

interface WaitingRoomProps {
  pool: Pool;
  onClose: () => void;
  onLeave: (poolId: string) => void;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ pool, onClose, onLeave }) => {
  const isConfirmed = pool.currentSeats >= pool.maxSeats;
  const seatsNeeded = pool.maxSeats - pool.currentSeats;
  
  // Dummy users to simulate avatars
  const avatars = [
    "https://api.dicebear.com/7.x/notionists/svg?seed=Ali&backgroundColor=ffdfbf",
    "https://api.dicebear.com/7.x/notionists/svg?seed=Fatima&backgroundColor=c0aede",
    "https://api.dicebear.com/7.x/notionists/svg?seed=Zainab&backgroundColor=b6e3f4",
    "https://api.dicebear.com/7.x/notionists/svg?seed=Umar&backgroundColor=d1d4f9",
  ];

  const handleShare = () => {
    const text = `Need ${seatsNeeded} more to fill our Arewa Trip to ${pool.destination}. Join here: https://arewatrips.com/rides?pool=${pool.id}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  const handleNotifyDriver = () => {
    const driverNumber = pool.driverPhone || "2348000000000";
    const text = `Hello Driver, our pool to ${pool.destination} is confirmed with ${pool.maxSeats} passengers. We are ready!`;
    const url = `https://wa.me/${driverNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="bg-card w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl border border-border shadow-2xl overflow-hidden animate-fade-up">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-border/50 bg-secondary/30">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-foreground">Waiting Room</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-background hover:bg-secondary transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-foreground mb-1">{pool.destination}</h3>
            <p className="text-muted-foreground">{pool.routeName}</p>
          </div>

          {/* Status Alert */}
          <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 ${
            isConfirmed 
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800" 
              : "bg-amber-50 border border-amber-200 text-amber-800"
          }`}>
            {isConfirmed ? (
              <Phone className="w-5 h-5 text-emerald-600 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            )}
            <div>
              <p className="font-semibold mb-0.5">
                {isConfirmed ? "Ride Confirmed!" : "Finding Passengers..."}
              </p>
              <p className="text-sm opacity-90">
                {isConfirmed 
                  ? "All seats are filled. You can now notify your driver." 
                  : `Waiting for ${seatsNeeded} more student${seatsNeeded !== 1 ? 's' : ''} to join the group.`}
              </p>
            </div>
          </div>

          {/* Avatars */}
          <div className="flex justify-center gap-3 mb-8">
            {Array.from({ length: pool.maxSeats }).map((_, index) => {
              const isFilled = index < pool.currentSeats;
              return (
                <div 
                  key={index} 
                  className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isFilled ? "bg-primary/10 border-2 border-primary" : "bg-secondary border-2 border-dashed border-border"
                  }`}
                >
                  {isFilled ? (
                    <img 
                      src={avatars[index % avatars.length]} 
                      alt={`Passenger ${index + 1}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Users className="w-6 h-6 text-muted-foreground/50" />
                  )}
                  {index === 0 && (
                     <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded border border-background">
                       You
                     </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {isConfirmed ? (
              <button 
                onClick={handleNotifyDriver}
                className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-500/20"
              >
                <MessageCircle className="w-5 h-5" />
                Notify Driver
              </button>
            ) : (
              <button 
                onClick={handleShare}
                className="w-full py-3.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Share2 className="w-5 h-5" />
                Share to WhatsApp
              </button>
            )}
            
            <button 
              onClick={() => onLeave(pool.id)}
              className="w-full py-3 px-4 bg-transparent hover:bg-secondary text-muted-foreground font-medium rounded-xl transition-colors"
            >
              Cancel & Leave Pool
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingRoom;
