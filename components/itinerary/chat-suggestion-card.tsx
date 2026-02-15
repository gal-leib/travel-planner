import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { SuggestionCard } from "@/lib/types";
import { Check, MapPin, Star } from "lucide-react";

export function ChatSuggestionCardView({
  suggestion,
  onAddToTrip,
}: {
  suggestion: SuggestionCard;
  onAddToTrip: () => void;
}) {
  return (
    <Card size="sm" className="mt-2 border-border/40 bg-card/80">
      {/* Image placeholder */}
      <div className="mx-3 h-28 overflow-hidden rounded-lg bg-gradient-to-br from-travel/10 via-muted/50 to-muted/30">
        <div className="flex h-full items-center justify-center text-muted-foreground/30">
          <MapPin className="size-8" />
        </div>
      </div>

      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-foreground">
            {suggestion.title}
          </h4>
          <div className="flex shrink-0 items-center gap-0.5 text-amber-400">
            <Star className="size-3 fill-current" />
            <span className="text-xs font-medium">{suggestion.rating}</span>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-muted-foreground">
          {suggestion.description}
        </p>

        {suggestion.addedToTrip ? (
          <Button
            variant="secondary"
            size="sm"
            disabled
            className="w-full gap-1.5 text-emerald-400 opacity-80"
          >
            <Check className="size-3" />
            In Timeline
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-1.5 border-travel/30 text-travel hover:bg-travel/10 hover:text-travel"
            onClick={onAddToTrip}
          >
            Add to Trip
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
