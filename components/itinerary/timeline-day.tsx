import type { DayPlan } from "@/lib/types";
import { TimelineActivityCard } from "./timeline-activity-card";
import { CirclePlus } from "lucide-react";

export function TimelineDay({
  day,
  selectedActivityId,
  onSelectActivity,
}: {
  day: DayPlan;
  selectedActivityId: string | null;
  onSelectActivity: (id: string) => void;
}) {
  return (
    <div className="px-4 py-3">
      {/* Day header */}
      <div className="mb-4 flex items-baseline gap-2.5">
        <span className="text-xs font-bold uppercase tracking-widest text-travel">
          {day.label}
        </span>
        <span className="text-xs text-muted-foreground">{day.subtitle}</span>
      </div>

      {/* Activities */}
      <div className="flex flex-col">
        {day.activities.map((activity, i) => (
          <TimelineActivityCard
            key={activity.id}
            activity={activity}
            index={i}
            isSelected={selectedActivityId === activity.id}
            onSelect={onSelectActivity}
          />
        ))}

        {/* Add activity placeholder */}
        <div className="relative flex gap-3 pl-1">
          <div className="flex flex-col items-center">
            <div className="flex size-7 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/20 text-muted-foreground/30">
              <CirclePlus className="size-3.5" />
            </div>
          </div>
          <div className="flex flex-1 items-center rounded-xl border border-dashed border-muted-foreground/15 px-3.5 py-3">
            <span className="text-xs text-muted-foreground/50">
              Next suggested activity...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
