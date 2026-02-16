# Daily View Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the all-days scrolling timeline with a swipeable single-day view controlled by a pill bar, with map syncing to the selected day.

**Architecture:** Add `selectedDayIndex` state to `ItineraryPage`. Rewrite `TimelinePanel` to show a day pill bar + horizontal scroll-snap container of day pages. Pass only the selected day's activities to `MapPanel`. No new dependencies.

**Tech Stack:** React, Tailwind CSS v4, CSS scroll-snap, existing shadcn/ui ScrollArea

---

### Task 1: Add `selectedDayIndex` state and filter map activities

**Files:**
- Modify: `components/itinerary/itinerary-page.tsx`

**Step 1: Add state and pass filtered activities**

In `itinerary-page.tsx`, add `selectedDayIndex` state and a callback to change it. Replace `allActivities` with filtered activities for `MapPanel`. Pass `selectedDayIndex` and `onDayChange` to `TimelinePanel`.

```tsx
// After existing state declarations (line 26):
const [selectedDayIndex, setSelectedDayIndex] = useState(0);

// Replace line 30:
//   const allActivities = days.flatMap((d) => d.activities);
// With:
const selectedDayActivities = days[selectedDayIndex]?.activities ?? [];
```

Update `TimelinePanel` usage (lines 125-129):
```tsx
<TimelinePanel
  days={days}
  selectedDayIndex={selectedDayIndex}
  onDayChange={setSelectedDayIndex}
  selectedActivityId={selectedActivityId}
  onSelectActivity={handleSelectActivity}
/>
```

Update `MapPanel` usage (lines 133-137):
```tsx
<MapPanel
  activities={selectedDayActivities}
  selectedActivityId={selectedActivityId}
  onSelectActivity={handleSelectActivity}
/>
```

**Step 2: Verify it builds**

Run: `bun run build`
Expected: Build fails because `TimelinePanel` doesn't accept the new props yet. That's fine — Task 2 fixes it.

**Step 3: Commit**

```bash
git add components/itinerary/itinerary-page.tsx
git commit -m "feat: add selectedDayIndex state and filter map by day"
```

---

### Task 2: Rewrite `TimelinePanel` with pill bar and swipeable day pages

**Files:**
- Modify: `components/itinerary/timeline-panel.tsx`

This is the main task. Replace the `ScrollArea` wrapping all days with:
1. A **day pill bar** at the top (horizontally scrollable)
2. A **horizontal scroll-snap container** of day pages below it
3. Each page contains a `ScrollArea` wrapping a single `TimelineDay`

**Step 1: Rewrite the component**

The component needs `"use client"` because it uses `useRef`, `useEffect`, and `useCallback`.

```tsx
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
      className="flex h-full min-h-0 w-full flex-col border-r border-border/60 bg-card/30 lg:w-[420px] lg:shrink-0"
    >
      {/* Day pill bar */}
      <div
        ref={pillBarRef}
        className="flex shrink-0 gap-1 overflow-x-auto border-b border-border/60 px-3 py-2 scrollbar-none"
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
        className="flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden scrollbar-none"
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
```

Key details:
- `scrollbar-none` (Tailwind v4) hides scrollbars on the pill bar and swipe container. Inline `scrollbarWidth: "none"` covers Firefox.
- `snap-x snap-mandatory` enables CSS scroll-snap on the horizontal container.
- `snap-start` on each page makes it snap to day boundaries.
- `isScrollingRef` prevents the scroll handler from fighting programmatic scrolls from pill taps.
- Each day page wraps `TimelineDay` in its own `ScrollArea` for independent vertical scrolling.

**Step 2: Verify it builds**

Run: `bun run build`
Expected: Builds successfully.

**Step 3: Visually verify with Playwright**

```bash
playwright-cli open http://localhost:3000
playwright-cli resize 390 844
playwright-cli screenshot --filename=daily-view-day1.png
```

Verify: Pill bar visible at top with "Mon 12" highlighted, Day 1 activities below.

**Step 4: Commit**

```bash
git add components/itinerary/timeline-panel.tsx
git commit -m "feat: rewrite timeline panel with pill bar and swipeable day pages"
```

---

### Task 3: Update Playwright tests for daily view

**Files:**
- Modify: `tests/mobile-view.spec.ts`

The existing tests assume all days are in one scroll. Update them for the daily view.

**Step 1: Rewrite timeline tests**

Replace the `Timeline scrolling` describe block with tests for the new behavior:

```ts
test.describe('Daily view navigation', () => {
  test('should show Day 1 activities on load', async ({ page }) => {
    await page.goto('/');

    const timeline = page.getByTestId('timeline-panel');
    await expect(timeline.getByText('Arrive at Narita Airport')).toBeVisible();
    // Day 2 content should NOT be visible (it's on a different page)
    await expect(timeline.getByText('Sunrise at Tsukiji Outer Market')).not.toBeVisible();
  });

  test('should show day pill bar with correct labels', async ({ page }) => {
    await page.goto('/');

    const timeline = page.getByTestId('timeline-panel');
    await expect(timeline.getByRole('button', { name: 'Mon 12' })).toBeVisible();
    await expect(timeline.getByRole('button', { name: 'Tue 13' })).toBeVisible();
  });

  test('should switch to Day 2 when tapping its pill', async ({ page }) => {
    await page.goto('/');

    const timeline = page.getByTestId('timeline-panel');
    await timeline.getByRole('button', { name: 'Tue 13' }).click();

    // Day 2 content appears
    await expect(timeline.getByText('Sunrise at Tsukiji Outer Market')).toBeVisible();
    // Day 1 content is gone
    await expect(timeline.getByText('Arrive at Narita Airport')).not.toBeVisible();
  });

  test('should switch to last day via pill', async ({ page }) => {
    await page.goto('/');

    const timeline = page.getByTestId('timeline-panel');
    await timeline.getByRole('button', { name: 'Sun 18' }).click();

    await expect(timeline.getByText('Depart from Narita Airport')).toBeVisible();
  });
});
```

Keep the `Mobile navigation`, `Chat scrolling`, and `Activity details` test groups unchanged (they still work).

Update the `Activity details` > `should show JUST ADDED badge` test — it still works since JUST ADDED is on Day 1 which loads by default.

**Step 2: Run the tests**

Run: `bun test`
Expected: All tests pass.

**Step 3: Commit**

```bash
git add tests/mobile-view.spec.ts
git commit -m "test: update playwright tests for daily view navigation"
```

---

### Task 4: Visual QA with Playwright

**Files:** None (verification only)

**Step 1: Screenshot Day 1 on mobile**

```bash
playwright-cli open http://localhost:3000
playwright-cli resize 390 844
playwright-cli screenshot --filename=daily-view-final-day1.png
```

Verify: Pill bar at top, "Mon 12" active (accent color), Day 1 activities below, bottom nav visible.

**Step 2: Navigate to Day 4 and screenshot**

```bash
playwright-cli click [the "Thu 15" pill button]
playwright-cli screenshot --filename=daily-view-final-day4.png
```

Verify: "Thu 15" pill is now active, Day 4 activities shown.

**Step 3: Check map sync**

```bash
playwright-cli click [Map nav button]
playwright-cli screenshot --filename=daily-view-final-map.png
```

Verify: Map only shows Day 4's 6 pins, not all 42.

**Step 4: Check desktop layout**

```bash
playwright-cli resize 1280 800
playwright-cli click [Timeline nav button]
playwright-cli screenshot --filename=daily-view-final-desktop.png
```

Verify: Pill bar and timeline panel render inside the 420px sidebar. Map panel visible alongside.
