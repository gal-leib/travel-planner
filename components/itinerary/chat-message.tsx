import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { ChatSuggestionCardView } from "./chat-suggestion-card";

export function ChatMessage({
  message,
  onAddSuggestion,
}: {
  message: ChatMessageType;
  onAddSuggestion?: () => void;
}) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-2.5 px-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {!isUser && (
        <Avatar size="sm" className="mt-0.5 shrink-0">
          <AvatarFallback className="bg-travel/15 text-travel">
            <Sparkles className="size-3" />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-[85%] space-y-1",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
            isUser
              ? "rounded-br-md bg-foreground/10 text-foreground"
              : "rounded-bl-md bg-travel/[0.07] text-foreground"
          )}
        >
          {message.content}
        </div>

        {message.suggestion && (
          <ChatSuggestionCardView
            suggestion={message.suggestion}
            onAddToTrip={onAddSuggestion ?? (() => {})}
          />
        )}

        <span className="block px-1 text-[10px] text-muted-foreground/40">
          {message.timestamp}
        </span>
      </div>
    </div>
  );
}
