import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Activity } from "@/lib/types";
import { cn } from "@/lib/utils";

export function MapMarker({
  activity,
  index,
  isSelected,
  onSelect,
}: {
  activity: Activity;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <Tooltip open={isSelected || undefined}>
      <TooltipTrigger asChild>
        <button
          onClick={() => onSelect(activity.id)}
          className={cn(
            "absolute z-10 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-200",
            isSelected
              ? "z-20 scale-125 border-travel bg-travel text-travel-foreground shadow-[0_0_16px_rgba(var(--travel),0.5)]"
              : activity.status === "just_added"
                ? "border-emerald-500 bg-emerald-500/90 text-white hover:scale-110"
                : "border-foreground/20 bg-card text-foreground hover:scale-110 hover:border-travel/50"
          )}
          style={{
            left: `${activity.mapPosition.x}%`,
            top: `${activity.mapPosition.y}%`,
          }}
        >
          {index + 1}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" sideOffset={8}>
        {activity.title}
      </TooltipContent>
    </Tooltip>
  );
}
