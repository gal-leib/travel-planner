import { Badge } from "@/components/ui/badge";
import type { Activity } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Camera,
  Clock,
  Coffee,
  GripVertical,
  Hotel,
  MapPin,
  Plane,
} from "lucide-react";

const categoryIcon: Record<Activity["category"], React.ReactNode> = {
  transport: <Plane className="size-3.5" />,
  hotel: <Hotel className="size-3.5" />,
  food: <Coffee className="size-3.5" />,
  attraction: <Camera className="size-3.5" />,
  activity: <MapPin className="size-3.5" />,
};

export function TimelineActivityCard({
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
  const isJustAdded = activity.status === "just_added";

  return (
    <div className="relative flex gap-3 pl-1">
      {/* Timeline connector line */}
      <div className="flex flex-col items-center pt-1">
        <button
          onClick={() => onSelect(activity.id)}
          className={cn(
            "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-all",
            isSelected
              ? "border-travel bg-travel text-travel-foreground scale-110 shadow-[0_0_12px_rgba(var(--travel),0.4)]"
              : isJustAdded
                ? "border-emerald-500 bg-emerald-500/20 text-emerald-400"
                : "border-muted-foreground/30 bg-muted/80 text-muted-foreground hover:border-travel/50 hover:bg-travel/10"
          )}
        >
          {index + 1}
        </button>
        <div
          className={cn(
            "w-px flex-1",
            isJustAdded
              ? "bg-gradient-to-b from-emerald-500/40 to-transparent"
              : "bg-gradient-to-b from-border to-transparent"
          )}
        />
      </div>

      {/* Card */}
      <button
        onClick={() => onSelect(activity.id)}
        className={cn(
          "group mb-3 flex flex-1 cursor-pointer flex-col gap-1.5 rounded-xl border px-3.5 py-3 text-left transition-all",
          isSelected
            ? "border-travel/40 bg-travel/5 ring-2 ring-travel/30 shadow-[0_0_20px_rgba(var(--travel),0.08)]"
            : isJustAdded
              ? "border-emerald-500/30 bg-emerald-500/5 shadow-[0_0_24px_rgba(16,185,129,0.08)]"
              : "border-border/60 bg-card/60 hover:border-border hover:bg-card"
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={cn(
                "gap-1 font-mono text-[10px]",
                isJustAdded && "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              )}
            >
              <Clock className="size-2.5" />
              {activity.time}
            </Badge>
            {isJustAdded && (
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px] font-semibold tracking-wider">
                JUST ADDED
              </Badge>
            )}
          </div>
          <GripVertical className="size-3.5 shrink-0 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-muted-foreground/60",
              isSelected && "text-travel/70"
            )}
          >
            {categoryIcon[activity.category]}
          </span>
          <span className="text-sm font-medium text-foreground">
            {activity.title}
          </span>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground/80">
          {activity.description}
        </p>
      </button>
    </div>
  );
}
