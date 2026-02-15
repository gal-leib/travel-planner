"use client";

import { useCallback, useRef, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Activity, ChatMessage, DayPlan } from "@/lib/types";
import {
  CANNED_RESPONSE,
  MOCK_DAYS,
  MOCK_MESSAGES,
  MOCK_QUICK_ACTIONS,
  MOCK_TRIP,
} from "@/lib/mock-data";
import { ChatPanel } from "./chat-panel";
import { ItineraryHeader } from "./itinerary-header";
import { MapPanel } from "./map-panel";
import { TimelinePanel } from "./timeline-panel";

export function ItineraryPage() {
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("timeline");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [chatInput, setChatInput] = useState("");
  const [days, setDays] = useState<DayPlan[]>(MOCK_DAYS);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const allActivities = days.flatMap((d) => d.activities);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSelectActivity = useCallback((id: string) => {
    setSelectedActivityId((prev) => (prev === id ? null : id));
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      role: "user",
      content: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    setTimeout(() => {
      scrollToBottom();
    }, 50);

    // Canned AI response after 1s
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        ...CANNED_RESPONSE,
        id: `m-${Date.now()}-ai`,
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      };
      setChatMessages((prev) => [...prev, aiMsg]);
      setTimeout(scrollToBottom, 50);
    }, 1000);
  }, [chatInput, scrollToBottom]);

  const handleAddSuggestion = useCallback(
    (messageId: string) => {
      // Toggle addedToTrip on the suggestion
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId && msg.suggestion
            ? {
                ...msg,
                suggestion: { ...msg.suggestion, addedToTrip: true },
              }
            : msg
        )
      );

      // Find the suggestion to add
      const msg = chatMessages.find((m) => m.id === messageId);
      if (!msg?.suggestion || msg.suggestion.addedToTrip) return;

      // Add new activity to Day 1
      const newActivity: Activity = {
        id: `a-${Date.now()}`,
        dayIndex: 0,
        orderIndex: days[0].activities.length,
        time: "7:00 PM",
        title: msg.suggestion.title,
        description: msg.suggestion.description,
        category: "food",
        mapPosition: { x: 36, y: 48 },
        status: "just_added",
      };

      setDays((prev) =>
        prev.map((day) =>
          day.dayIndex === 0
            ? { ...day, activities: [...day.activities, newActivity] }
            : day
        )
      );
    },
    [chatMessages, days]
  );

  return (
    <TooltipProvider>
      <div className="flex h-screen min-w-[1260px] flex-col bg-background">
        <ItineraryHeader trip={MOCK_TRIP} />

        <div className="flex flex-1 overflow-hidden">
          <TimelinePanel
            days={days}
            selectedActivityId={selectedActivityId}
            onSelectActivity={handleSelectActivity}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <MapPanel
            activities={allActivities}
            selectedActivityId={selectedActivityId}
            onSelectActivity={handleSelectActivity}
          />

          <ChatPanel
            messages={chatMessages}
            chatInput={chatInput}
            onChatInputChange={setChatInput}
            onSendMessage={handleSendMessage}
            onAddSuggestion={handleAddSuggestion}
            quickActions={MOCK_QUICK_ACTIONS}
            messagesEndRef={messagesEndRef}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
