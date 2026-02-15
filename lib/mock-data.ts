import type { Trip, DayPlan, ChatMessage } from "./types";

export const MOCK_TRIP: Trip = {
  id: "trip-1",
  title: "Summer in Tokyo 2024",
  startDate: "2024-08-12",
  endDate: "2024-08-19",
};

export const MOCK_DAYS: DayPlan[] = [
  {
    dayIndex: 0,
    date: "2024-08-12",
    label: "Day 1",
    subtitle: "Mon, Aug 12 — Arrival & Shibuya",
    activities: [
      {
        id: "a1",
        dayIndex: 0,
        orderIndex: 0,
        time: "10:30 AM",
        title: "Arrive at Narita Airport",
        description: "Terminal 1 — Pick up JR Pass & Pocket WiFi",
        category: "transport",
        mapPosition: { x: 82, y: 28 },
      },
      {
        id: "a2",
        dayIndex: 0,
        orderIndex: 1,
        time: "1:00 PM",
        title: "Check in — Shibuya Stream Hotel",
        description: "Superior Double Room, 14F — Early check-in confirmed",
        category: "hotel",
        mapPosition: { x: 38, y: 45 },
      },
      {
        id: "a3",
        dayIndex: 0,
        orderIndex: 2,
        time: "2:30 PM",
        title: "Coffee at About Life Coffee",
        description: "Specialty pour-over in Dogenzaka — Try the Kenya single origin",
        category: "food",
        mapPosition: { x: 32, y: 52 },
      },
      {
        id: "a4",
        dayIndex: 0,
        orderIndex: 3,
        time: "4:00 PM",
        title: "Shibuya Sky Observation Deck",
        description: "46F open-air rooftop — Best views at golden hour",
        category: "attraction",
        mapPosition: { x: 42, y: 40 },
      },
      {
        id: "a5",
        dayIndex: 0,
        orderIndex: 4,
        time: "7:00 PM",
        title: "Ce La Vi Tokyo",
        description: "Rooftop dining at Tokyu Plaza — Asian fusion, great sunset views",
        category: "food",
        mapPosition: { x: 36, y: 48 },
        status: "just_added",
      },
    ],
  },
];

export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    role: "user",
    content: "Can you suggest a nice dinner spot near Shibuya for tonight? Something with a view would be great.",
    timestamp: "3:42 PM",
  },
  {
    id: "m2",
    role: "assistant",
    content: "Great choice! Here's a top pick for dinner with a view in Shibuya:",
    timestamp: "3:42 PM",
    suggestion: {
      title: "Ce La Vi Tokyo",
      description: "Rooftop dining at Tokyu Plaza Shibuya. Asian fusion cuisine with panoramic city views. Perfect for sunset dinner.",
      rating: 4.6,
      imageUrl: "",
      addedToTrip: true,
    },
  },
];

export const MOCK_QUICK_ACTIONS = [
  "Optimize Route",
  "Find similar",
  "Cheaper alternatives",
];

export const CANNED_RESPONSE: ChatMessage = {
  id: "",
  role: "assistant",
  content: "I found a couple of great options! Let me know if you'd like more details or want to add any of these to your itinerary.",
  timestamp: "",
};
