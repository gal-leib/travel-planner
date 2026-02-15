import { Map, MessageCircle, Route } from "lucide-react";

type Panel = "timeline" | "map" | "chat";

const tabs: { id: Panel; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "timeline", label: "Timeline", icon: Route },
  { id: "map", label: "Map", icon: Map },
  { id: "chat", label: "Chat", icon: MessageCircle },
];

export function MobileNav({
  activePanel,
  onChangePanel,
}: {
  activePanel: Panel;
  onChangePanel: (panel: Panel) => void;
}) {
  return (
    <nav className="flex shrink-0 border-t border-border/60 bg-card/80 backdrop-blur-sm lg:hidden">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChangePanel(id)}
          className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors ${
            activePanel === id
              ? "text-travel"
              : "text-muted-foreground"
          }`}
        >
          <Icon className="size-5" />
          {label}
        </button>
      ))}
    </nav>
  );
}
