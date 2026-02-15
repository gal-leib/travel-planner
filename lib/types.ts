export interface Trip {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
}

export interface Activity {
  id: string;
  dayIndex: number;
  orderIndex: number;
  time: string;
  title: string;
  description: string;
  category: "transport" | "hotel" | "food" | "attraction" | "activity";
  mapPosition: { x: number; y: number };
  status?: "just_added";
}

export interface DayPlan {
  dayIndex: number;
  date: string;
  label: string;
  subtitle: string;
  activities: Activity[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  suggestion?: SuggestionCard;
}

export interface SuggestionCard {
  title: string;
  description: string;
  rating: number;
  imageUrl: string;
  addedToTrip: boolean;
}
