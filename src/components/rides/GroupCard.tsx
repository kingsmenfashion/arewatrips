import React from "react";
import { Users, MapPin, ChevronRight, AlertCircle, CheckCircle } from "lucide-react";

export interface Pool {
  id: string;
  routeName: string;
  destination: string;
  maxSeats: number;
  currentSeats: number;
  price: number;
  driverPhone?: string;
}

interface GroupCardProps {
  pool: Pool;
  onJoin: (poolId: string) => void;
  isJoined?: boolean;
}

const GroupCard: React.FC<GroupCardProps> = ({ pool, onJoin, isJoined }) => {
  const isFull = pool.currentSeats >= pool.maxSeats;
  const isHighUrgency = !isFull && pool.currentSeats === pool.maxSeats - 1;
  const progressRatio = (pool.currentSeats / pool.maxSeats) * 100;

  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 border ${
      isJoined 
        ? "border-primary bg-primary/5" 
        : isHighUrgency 
          ? "border-amber-500/50 bg-amber-50/30" 
          : "border-border bg-card"
      } shadow-sm transition-all hover:shadow-md group`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground mb-1">
            <MapPin className="w-4 h-4" />
            <span>To</span>
          </div>
          <h3 className="text-xl font-bold text-foreground">{pool.destination}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">{pool.routeName}</p>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-foreground">₦{pool.price}</div>
          <span className="text-xs text-muted-foreground">per seat</span>
        </div>
      </div>

      {/* Seats Progress */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5">
            <Users className={`w-4 h-4 ${isHighUrgency ? "text-amber-600" : "text-primary"}`} />
            <span className={`text-sm font-medium ${isHighUrgency ? "text-amber-600" : "text-foreground"}`}>
              {pool.currentSeats}/{pool.maxSeats} Seats
            </span>
          </div>
          {isHighUrgency && (
            <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
              <AlertCircle className="w-3 h-3" />
              Almost Full
            </span>
          )}
          {isJoined && (
            <span className="flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              <CheckCircle className="w-3 h-3" />
              Joined
            </span>
          )}
        </div>
        
        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              isHighUrgency ? "bg-amber-500" : isFull ? "bg-emerald-500" : "bg-primary"
            }`}
            style={{ width: `${progressRatio}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => onJoin(pool.id)}
        disabled={isFull && !isJoined}
        className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
          isJoined
            ? "bg-primary/10 text-primary hover:bg-primary/20"
            : isFull
              ? "bg-secondary text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        {isJoined ? (
           "View Waiting Room"
        ) : isFull ? (
          "Pool Full"
        ) : (
          <>
            Join Group <ChevronRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};

export default GroupCard;
