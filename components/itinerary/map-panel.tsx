import { Button } from "@/components/ui/button";
import type { Activity } from "@/lib/types";
import { LocateFixed, Minus, Plus } from "lucide-react";
import { MapMarker } from "./map-marker";

export function MapPanel({
  activities,
  selectedActivityId,
  onSelectActivity,
}: {
  activities: Activity[];
  selectedActivityId: string | null;
  onSelectActivity: (id: string) => void;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-background lg:flex-1">
      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Subtle gradient atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-br from-travel/[0.03] via-transparent to-travel/[0.02]" />

      {/* SVG connecting lines */}
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <polyline
          points={activities
            .map((a) => `${a.mapPosition.x},${a.mapPosition.y}`)
            .join(" ")}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
          strokeDasharray="1 0.7"
          className="text-travel/25"
        />
      </svg>

      {/* Markers */}
      {activities.map((activity, i) => (
        <MapMarker
          key={activity.id}
          activity={activity}
          index={i}
          isSelected={selectedActivityId === activity.id}
          onSelect={onSelectActivity}
        />
      ))}

      {/* Map controls */}
      <div className="absolute right-4 bottom-4 flex flex-col gap-1.5">
        <Button variant="outline" size="icon-sm" className="bg-card/80 backdrop-blur-sm">
          <Plus className="size-3.5" />
        </Button>
        <Button variant="outline" size="icon-sm" className="bg-card/80 backdrop-blur-sm">
          <Minus className="size-3.5" />
        </Button>
        <Button variant="outline" size="icon-sm" className="mt-1 bg-card/80 backdrop-blur-sm">
          <LocateFixed className="size-3.5" />
        </Button>
      </div>

      {/* "Map" label */}
      <div className="absolute left-4 bottom-4 rounded-md bg-card/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50 backdrop-blur-sm">
        Map View — Tokyo
      </div>
    </div>
  );
}
