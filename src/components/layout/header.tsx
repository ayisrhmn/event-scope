"use client";

import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useEventTrackingStore } from "@/stores/event-tracking-store";
import { Menu } from "lucide-react";

const viewTitles = {
  "schema-builder": {
    title: "Event Schema Builder",
    description: "Define and manage your event schemas",
  },
  simulator: {
    title: "Event Simulator",
    description: "Send test events to validate implementation",
  },
  timeline: {
    title: "Event Timeline",
    description: "View chronological history of all events",
  },
};

export function Header() {
  const { ui, setMobileSidebarOpen } = useEventTrackingStore();
  const { activeView } = ui;
  const currentView = viewTitles[activeView];

  return (
    <header className="h-16 md:h-18 border-b border-border bg-background/80 backdrop-blur-sm px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="p-2 -ml-2 lg:hidden text-muted-foreground hover:text-foreground"
        >
          <Menu className="size-5" />
        </button>
        <div>
          <h2 className="text-base md:text-lg font-semibold text-foreground line-clamp-1">
            {currentView.title}
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-1 hidden sm:block">
            {currentView.description}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
