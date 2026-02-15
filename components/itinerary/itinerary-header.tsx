import type { Trip } from "@/lib/types";
import { MapPin } from "lucide-react";

export function ItineraryHeader({ trip }: { trip: Trip }) {
  const start = new Date(trip.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const end = new Date(trip.endDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-border/60 bg-card/50 px-5 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-lg bg-travel/15 text-travel">
          <MapPin className="size-4" />
        </div>
        <div className="flex min-w-0 flex-col">
          <h1 className="truncate text-sm font-semibold tracking-tight text-foreground">
            {trip.title}
          </h1>
          <span className="hidden text-xs text-muted-foreground sm:block">
            {start} – {end}
          </span>
        </div>
      </div>
    </header>
  );
}
