import { ScrollArea } from "@/components/ui/scroll-area";
import type { DayPlan } from "@/lib/types";
import { TimelineDay } from "./timeline-day";

export function TimelinePanel({
  days,
  selectedActivityId,
  onSelectActivity,
}: {
  days: DayPlan[];
  selectedActivityId: string | null;
  onSelectActivity: (id: string) => void;
}) {
  return (
    <div data-testid="timeline-panel" className="flex h-full min-h-0 w-full flex-col border-r border-border/60 bg-card/30 lg:w-[420px] lg:shrink-0">
      <ScrollArea className="h-full">
        {days.map((day) => (
          <TimelineDay
            key={day.dayIndex}
            day={day}
            selectedActivityId={selectedActivityId}
            onSelectActivity={onSelectActivity}
          />
        ))}
      </ScrollArea>
    </div>
  );
}
