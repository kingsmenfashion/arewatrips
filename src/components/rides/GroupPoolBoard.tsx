import React, { useState, useEffect } from "react";
import GroupCard, { Pool } from "./GroupCard";
import WaitingRoom from "./WaitingRoom";
import { Filter } from "lucide-react";

const INITIAL_POOLS: Pool[] = [
  { id: "p1", routeName: "From Muna Garage", destination: "UNIMAID Gate", maxSeats: 4, currentSeats: 3, price: 500, driverPhone: "2348000000001" },
  { id: "p2", routeName: "From Post Office", destination: "Teaching Hospital", maxSeats: 4, currentSeats: 1, price: 600, driverPhone: "2348000000002" },
  { id: "p3", routeName: "From Custom Area", destination: "Engineering Faculty", maxSeats: 4, currentSeats: 0, price: 500, driverPhone: "2348000000003" },
  { id: "p4", routeName: "From Baga Road", destination: "UNIMAID Clinic", maxSeats: 4, currentSeats: 2, price: 500, driverPhone: "2348000000004" },
  { id: "p5", routeName: "From Tashan Bama", destination: "UNIMAID Gate", maxSeats: 4, currentSeats: 3, price: 400, driverPhone: "2348000000005" },
];

const DESTINATIONS = ["All", "UNIMAID Gate", "Teaching Hospital", "Engineering Faculty", "UNIMAID Clinic"];

const GroupPoolBoard: React.FC = () => {
  const [pools, setPools] = useState<Pool[]>(INITIAL_POOLS);
  const [activeFilter, setActiveFilter] = useState("All");
  const [joinedPoolId, setJoinedPoolId] = useState<string | null>(null);

  // Simulated WebSockets for real-time updates
  useEffect(() => {
    // In a real app, this would use Supabase realtime subscription
    // Example: supabase.channel('ride_pools').on('postgres_changes', ...).subscribe()
    
    // For this mock, we'll occasionally add a member to a random pool just to show "real-time"
    const interval = setInterval(() => {
      setPools(currentPools => {
        const poolToUpdate = currentPools[Math.floor(Math.random() * currentPools.length)];
        // Create an activity if the pool isn't full, and we aren't generating activity on the pool the user joined if it's 4/4
        if (poolToUpdate.currentSeats < poolToUpdate.maxSeats && poolToUpdate.id !== joinedPoolId) {
          return currentPools.map(p => 
            p.id === poolToUpdate.id ? { ...p, currentSeats: p.currentSeats + 1 } : p
          );
        }
        return currentPools;
      });
    }, 15000); // Attempt a change every 15 seconds

    return () => clearInterval(interval);
  }, [joinedPoolId]);

  const handleJoinPool = (poolId: string) => {
    setJoinedPoolId(poolId);
    setPools(currentPools => 
      currentPools.map(p => {
        if (p.id === poolId && p.currentSeats < p.maxSeats) {
          return { ...p, currentSeats: p.currentSeats + 1 };
        }
        return p;
      })
    );
  };

  const handleLeavePool = (poolId: string) => {
    setJoinedPoolId(null);
    setPools(currentPools => 
      currentPools.map(p => {
        if (p.id === poolId && p.currentSeats > 0) {
          return { ...p, currentSeats: p.currentSeats - 1 };
        }
        return p;
      })
    );
  };

  const filteredPools = pools.filter(p => activeFilter === "All" || p.destination === activeFilter);
  const activePool = joinedPoolId ? pools.find(p => p.id === joinedPoolId) : null;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header element simulating logged-in user greeting */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Hi Ali, where are we going?</h2>
        <p className="text-muted-foreground mt-1">Join an open ride pool and split the cost.</p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-6 no-scrollbar">
        <div className="flex items-center gap-2 text-muted-foreground mr-2 shrink-0">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        {DESTINATIONS.map(dest => (
          <button
            key={dest}
            onClick={() => setActiveFilter(dest)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0 border ${
              activeFilter === dest 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-card text-foreground border-border hover:bg-secondary"
            }`}
          >
            {dest}
          </button>
        ))}
      </div>

      {/* Pools Grid */}
      {filteredPools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPools.map(pool => (
            <GroupCard 
              key={pool.id} 
              pool={pool} 
              onJoin={handleJoinPool} 
              isJoined={joinedPoolId === pool.id}
            />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center bg-card rounded-2xl border border-border">
          <p className="text-lg text-muted-foreground">No active pools found for this destination.</p>
          <button 
            onClick={() => setActiveFilter("All")}
            className="mt-4 text-primary font-medium hover:underline"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Waiting Room Overlay */}
      {activePool && (
        <WaitingRoom 
          pool={activePool} 
          onClose={() => setJoinedPoolId(null)}
          onLeave={handleLeavePool}
        />
      )}
    </div>
  );
};

export default GroupPoolBoard;
