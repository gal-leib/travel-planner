"use client";

import { useRef, useEffect, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DayPlan } from "@/lib/types";
import { TimelineDay } from "./timeline-day";

export function TimelinePanel({
  days,
  selectedDayIndex,
  onDayChange,
  selectedActivityId,
  onSelectActivity,
}: {
  days: DayPlan[];
  selectedDayIndex: number;
  onDayChange: (index: number) => void;
  selectedActivityId: string | null;
  onSelectActivity: (id: string) => void;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const pillBarRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);

  // Format pill label from date string: "Mon 12"
  const formatPillLabel = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    const day = date.getDate();
    return `${weekday} ${day}`;
  };

  // Scroll to selected day when pill is tapped
  const scrollToDay = useCallback((index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    isScrollingRef.current = true;
    container.scrollTo({ left: index * container.clientWidth, behavior: "smooth" });
    onDayChange(index);
    // Reset flag after scroll animation completes
    setTimeout(() => { isScrollingRef.current = false; }, 350);
  }, [onDayChange]);

  // Sync pill bar scroll to keep active pill visible
  useEffect(() => {
    const pillBar = pillBarRef.current;
    if (!pillBar) return;
    const activePill = pillBar.children[selectedDayIndex] as HTMLElement | undefined;
    if (activePill) {
      activePill.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [selectedDayIndex]);

  // Listen for scroll-snap settling to update selectedDayIndex
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (isScrollingRef.current) return;
        const index = Math.round(container.scrollLeft / container.clientWidth);
        if (index !== selectedDayIndex && index >= 0 && index < days.length) {
          onDayChange(index);
        }
      }, 50);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [selectedDayIndex, onDayChange, days.length]);

  return (
    <div
      data-testid="timeline-panel"
      className="flex h-full min-h-0 min-w-0 w-full flex-col border-r border-border/60 bg-card/30 lg:w-[420px] lg:shrink-0"
    >
      {/* Day pill bar */}
      <div
        ref={pillBarRef}
        className="flex shrink-0 gap-1 overflow-x-scroll border-b border-border/60 px-3 py-2 no-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {days.map((day, i) => (
          <button
            key={day.dayIndex}
            onClick={() => scrollToDay(i)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              i === selectedDayIndex
                ? "bg-travel text-travel-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {formatPillLabel(day.date)}
          </button>
        ))}
      </div>

      {/* Swipeable day pages */}
      <div
        ref={scrollContainerRef}
        className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden no-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {days.map((day) => (
          <div key={day.dayIndex} className="h-full w-full shrink-0 snap-start">
            <ScrollArea className="h-full">
              <TimelineDay
                day={day}
                selectedActivityId={selectedActivityId}
                onSelectActivity={onSelectActivity}
              />
            </ScrollArea>
          </div>
        ))}
      </div>
    </div>
  );
}
