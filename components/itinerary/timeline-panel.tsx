import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DayPlan } from "@/lib/types";
import { TimelineDay } from "./timeline-day";

export function TimelinePanel({
  days,
  selectedActivityId,
  onSelectActivity,
  activeTab,
  onTabChange,
}: {
  days: DayPlan[];
  selectedActivityId: string | null;
  onSelectActivity: (id: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  return (
    <div className="flex h-full w-full flex-col border-r border-border/60 bg-card/30 lg:w-[420px] lg:shrink-0">
      <Tabs value={activeTab} onValueChange={onTabChange} className="flex flex-1 flex-col overflow-hidden">
        <div className="shrink-0 border-b border-border/60 px-4 pt-3 pb-0">
          <TabsList variant="line" className="w-full justify-start">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="timeline" className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="pb-16 lg:pb-0">
              {days.map((day) => (
                <TimelineDay
                  key={day.dayIndex}
                  day={day}
                  selectedActivityId={selectedActivityId}
                  onSelectActivity={onSelectActivity}
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="expenses" className="flex-1">
          <div className="flex h-full items-center justify-center pb-16 text-sm text-muted-foreground/50 lg:pb-0">
            Expense tracking coming soon
          </div>
        </TabsContent>

        <TabsContent value="notes" className="flex-1">
          <div className="flex h-full items-center justify-center pb-16 text-sm text-muted-foreground/50 lg:pb-0">
            Trip notes coming soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
