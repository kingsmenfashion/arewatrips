import { cn } from "@/lib/utils";
import type { HotelRoom } from "@/types/hotel";

type RoomSelectorProps = {
  rooms: HotelRoom[];
  selectedRoom: HotelRoom | null;
  onSelect: (room: HotelRoom) => void;
};

/**
 * Displays available hotel room variants and reports the selected room.
 */
export function RoomSelector({ rooms, selectedRoom, onSelect }: RoomSelectorProps) {
  if (!rooms.length) {
    return <p className="text-sm text-muted-foreground">No rooms are currently available.</p>;
  }

  return (
    <section aria-labelledby="room-selector-heading">
      <h2 id="room-selector-heading" className="text-base font-bold text-foreground">
        Choose your room
      </h2>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-1" role="radiogroup">
        {rooms.map((room) => {
          const isSelected = room.id === selectedRoom?.id;

          return (
            <button
              key={room.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(room)}
              className={cn(
                "min-w-40 shrink-0 rounded-lg border p-3 text-left transition focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                isSelected
                  ? "border-primary bg-secondary shadow-sm"
                  : "border-border bg-card hover:border-accent",
              )}
            >
              <span className="block text-sm font-bold text-foreground">{room.name}</span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {room.capacity ? `Sleeps ${room.capacity}` : "Capacity unavailable"}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
