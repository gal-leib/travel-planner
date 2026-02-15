import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal, Sparkles } from "lucide-react";

export function ChatInput({
  value,
  onChange,
  onSend,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="flex items-center gap-2 border-t border-border/60 px-4 py-3">
      <div className="relative flex-1">
        <Sparkles className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-travel/50" />
        <Input
          placeholder="Ask about your trip..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim()) onSend();
          }}
          className="pl-8 text-[13px]"
        />
      </div>
      <Button
        size="icon-sm"
        onClick={onSend}
        disabled={!value.trim()}
        className="shrink-0 bg-travel text-travel-foreground hover:bg-travel/80"
      >
        <SendHorizontal className="size-3.5" />
      </Button>
    </div>
  );
}
