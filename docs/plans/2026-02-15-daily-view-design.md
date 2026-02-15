# Daily View Design

## Problem

The timeline panel shows all 7 days in one long scroll. On mobile, this means ~42 activity cards with no way to jump to a specific day quickly.

## Solution

Replace the scrolling all-days list with a **single-day view** controlled by a **pill bar + horizontal swipe**.

## UX

### Day Pill Bar

- Horizontally scrollable row between header and timeline content
- Each pill: `"Mon 12"` format (3-letter weekday + day number)
- Active pill: filled `travel` accent color, white text
- Inactive pills: transparent bg, muted text
- Auto-scrolls to keep active pill visible on day change

### Day Content

- Single day's subtitle + activity cards, vertically scrollable
- Reuses existing `TimelineDay` component as-is
- "Next suggested activity..." placeholder at bottom of each day

### Swipe Navigation

- CSS `scroll-snap-type: x mandatory` on a horizontal container of day "pages"
- Each page is `100%` width, `scroll-snap-align: start`
- Scroll event listener syncs `selectedDayIndex` state with pill bar and map
- No external library needed

### Map Sync

- Map receives only the selected day's activities
- Selecting a day filters both timeline and map pins

## State

New state in `ItineraryPage`:
- `selectedDayIndex: number` (default `0`)

Derived:
- `currentDay = days[selectedDayIndex]` feeds TimelineDay
- `currentActivities = currentDay.activities` feeds MapPanel

## Component Changes

| Component | Change |
|---|---|
| `itinerary-page.tsx` | Add `selectedDayIndex` state, pass filtered activities to MapPanel |
| `timeline-panel.tsx` | Replace ScrollArea over all days with pill bar + swipeable single-day view |
| `timeline-day.tsx` | No change |
| `map-panel.tsx` | Receives only selected day's activities (already props-driven) |

## Desktop

Pill bar + swipe works inside the 420px sidebar. Same UX, just narrower.
