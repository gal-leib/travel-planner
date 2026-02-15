import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatMessage as ChatMessageType } from "@/lib/types";
import { Bot } from "lucide-react";
import { ChatInput } from "./chat-input";
import { ChatMessage } from "./chat-message";

export function ChatPanel({
  messages,
  chatInput,
  onChatInputChange,
  onSendMessage,
  onAddSuggestion,
  quickActions,
  messagesEndRef,
}: {
  messages: ChatMessageType[];
  chatInput: string;
  onChatInputChange: (v: string) => void;
  onSendMessage: () => void;
  onAddSuggestion: (messageId: string) => void;
  quickActions: string[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="flex h-full w-full flex-col border-l border-border/60 bg-card/30 lg:w-[420px] lg:shrink-0">
      {/* Header */}
      <div className="flex h-12 shrink-0 items-center gap-2.5 border-b border-border/60 px-4">
        <div className="flex size-6 items-center justify-center rounded-md bg-travel/15 text-travel">
          <Bot className="size-3.5" />
        </div>
        <span className="text-sm font-medium text-foreground">
          AI Trip Assistant
        </span>
        <span className="relative ml-auto flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50" />
          <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
        </span>
      </div>

      {/* Quick actions */}
      <div className="flex shrink-0 gap-1.5 border-b border-border/40 px-4 py-2.5">
        {quickActions.map((action) => (
          <Button key={action} variant="outline" size="xs" className="text-[11px]">
            {action}
          </Button>
        ))}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="space-y-4 py-4 pb-16 lg:pb-4">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onAddSuggestion={
                msg.suggestion ? () => onAddSuggestion(msg.id) : undefined
              }
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="mb-16 lg:mb-0">
        <ChatInput
          value={chatInput}
          onChange={onChatInputChange}
          onSend={onSendMessage}
        />
      </div>
    </div>
  );
}
