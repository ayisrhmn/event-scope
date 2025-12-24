"use client";

import { EventSimulator, EventTimeline, SchemaBuilder, WelcomeScreen } from "@/components/features";
import { AppLayout } from "@/components/layout";
import { useEventTrackingStore } from "@/stores/event-tracking-store";
import { useEffect, useState } from "react";

export function PlaygroundPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const activeView = useEventTrackingStore((state) => state.ui.activeView);

  // Wait for hydration to complete before rendering content
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (showWelcome) {
    return <WelcomeScreen onGetStarted={() => setShowWelcome(false)} />;
  }

  return (
    <AppLayout>
      {activeView === "schema-builder" && <SchemaBuilder />}
      {activeView === "simulator" && <EventSimulator />}
      {activeView === "timeline" && <EventTimeline />}
    </AppLayout>
  );
}
