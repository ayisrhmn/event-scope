"use client";

import { cn } from "@/lib/utils";
import { useEventTrackingStore } from "@/stores/event-tracking-store";
import type { ActiveView } from "@/types/event-tracking";
import { ChevronLeft, ChevronRight, Clock, FileCode2, Play, X, Zap } from "lucide-react";

interface NavItem {
  id: ActiveView;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const navItems: NavItem[] = [
  {
    id: "schema-builder",
    label: "Schema Builder",
    icon: <FileCode2 className="size-5" />,
    description: "Define event schemas",
  },
  {
    id: "simulator",
    label: "Event Simulator",
    icon: <Play className="size-5" />,
    description: "Send test events",
  },
  {
    id: "timeline",
    label: "Event Timeline",
    icon: <Clock className="size-5" />,
    description: "View event history",
  },
];

export function Sidebar() {
  const { ui, setActiveView, toggleSidebar, setMobileSidebarOpen } = useEventTrackingStore();
  const { activeView, sidebarCollapsed, mobileSidebarOpen } = ui;

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    setMobileSidebarOpen(false);
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 lg:relative flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-16" : "w-64",
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div
            className={cn(
              "flex items-center gap-2 overflow-hidden transition-all duration-300",
              sidebarCollapsed && "opacity-0 w-0",
            )}
          >
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Zap className="size-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-sidebar-foreground whitespace-nowrap">
                EventScope
              </h1>
              <p className="text-xs text-muted-foreground whitespace-nowrap">Tracking Playground</p>
            </div>
          </div>
          {sidebarCollapsed && (
            <div className="p-1.5 rounded-lg bg-primary/10 mx-auto">
              <Zap className="size-5 text-primary" />
            </div>
          )}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-1 lg:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              activeView === item.id
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent",
            )}
            title={sidebarCollapsed ? item.label : undefined}
          >
            <span className="shrink-0">{item.icon}</span>
            <div
              className={cn(
                "flex flex-col items-start overflow-hidden transition-all duration-300",
                sidebarCollapsed && "opacity-0 w-0",
              )}
            >
              <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
              <span
                className={cn(
                  "text-xs whitespace-nowrap",
                  activeView === item.id
                    ? "text-sidebar-primary-foreground/70"
                    : "text-muted-foreground",
                )}
              >
                {item.description}
              </span>
            </div>
          </button>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-sidebar-border hidden lg:block">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="size-5" />
          ) : (
            <>
              <ChevronLeft className="size-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
