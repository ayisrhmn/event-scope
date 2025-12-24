"use client";

import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { useState } from "react";

export function SimulationBadge() {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      {isMinimized ? (
        <button onClick={() => setIsMinimized(false)} className="group relative">
          <div className="w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6 text-primary-foreground animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
          </span>
        </button>
      ) : (
        <div className="bg-card border shadow-xl rounded-2xl p-4 max-w-xs animate-bounce-in">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-sm">UI Simulation Mode</p>
                  <Badge variant="secondary" className="text-xs mt-1">
                    Demo Only
                  </Badge>
                </div>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This is a UI simulation with mock data. AI integration is currently in progress.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
