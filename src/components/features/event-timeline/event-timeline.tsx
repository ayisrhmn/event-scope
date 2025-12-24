"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useEventTrackingStore } from "@/stores/event-tracking-store";
import type { EventInstance, EventStatus } from "@/types/event-tracking";
import { AlertCircle, AlertTriangle, CheckCircle, Clock, Copy, Trash2, X } from "lucide-react";
import { useState } from "react";

const statusConfig: Record<
  EventStatus,
  { icon: React.ReactNode; label: string; className: string }
> = {
  valid: {
    icon: <CheckCircle className="size-4" />,
    label: "Valid",
    className: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  },
  warning: {
    icon: <AlertTriangle className="size-4" />,
    label: "Warning",
    className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  },
  error: {
    icon: <AlertCircle className="size-4" />,
    label: "Error",
    className: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  },
};

function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function formatFullTimestamp(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

interface EventDetailPanelProps {
  event: EventInstance;
  onClose: () => void;
}

function EventDetailPanel({ event, onClose }: EventDetailPanelProps) {
  const [copied, setCopied] = useState(false);
  const status = statusConfig[event.status];

  const handleCopyPayload = async () => {
    await navigator.clipboard.writeText(JSON.stringify(event.payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-mono">{event.eventName}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Clock className="size-3" />
              {formatFullTimestamp(event.timestamp)}
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Badge variant="outline" className={status.className}>
            {status.icon}
            {status.label}
          </Badge>
        </div>

        {/* Schema */}
        {event.schemaName && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Schema:</span>
            <Badge variant="outline">{event.schemaName}</Badge>
          </div>
        )}

        {/* Validation Errors */}
        {event.validationErrors.length > 0 && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Validation Issues:</span>
            <div className="space-y-2">
              {event.validationErrors.map((error, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex items-start gap-2 text-sm p-2 rounded-lg",
                    error.severity === "error"
                      ? "bg-red-500/10 text-red-600 dark:text-red-400"
                      : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
                  )}
                >
                  {error.severity === "error" ? (
                    <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-medium">{error.message}</p>
                    {error.expected && error.received && (
                      <p className="text-xs mt-0.5 opacity-80">
                        Expected: {error.expected}, Got: {error.received}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payload */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Payload:</span>
            <Button variant="ghost" size="sm" onClick={handleCopyPayload}>
              <Copy className="size-3" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
          <pre className="text-xs font-mono bg-muted/50 p-3 rounded-lg overflow-auto max-h-64">
            {JSON.stringify(event.payload, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}

export function EventTimeline() {
  const { events, clearEvents, deleteEvent, ui, setSelectedEvent } = useEventTrackingStore();
  const selectedEventId = ui.selectedEventId;
  const selectedEvent = events.find((e) => e.id === selectedEventId);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
      {/* Timeline */}
      <div className="space-y-4">
        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {events.length} event{events.length !== 1 ? "s" : ""} recorded
          </p>
          {events.length > 0 && (
            <Button variant="outline" size="sm" onClick={clearEvents}>
              <Trash2 className="size-4" />
              Clear All
            </Button>
          )}
        </div>

        {/* Event List */}
        {events.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Clock className="size-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-2">No events recorded yet</p>
              <p className="text-sm text-muted-foreground">
                Send an event from the Simulator to see it here
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {events.map((event) => {
              const status = statusConfig[event.status];
              const isSelected = selectedEventId === event.id;

              return (
                <div
                  key={event.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedEvent(isSelected ? null : event.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedEvent(isSelected ? null : event.id);
                    }
                  }}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border transition-all cursor-pointer",
                    "hover:bg-muted/50",
                    isSelected ? "border-primary bg-primary/5" : "border-border bg-card/50",
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={cn(
                          "shrink-0 p-1.5 rounded-full",
                          event.status === "valid" && "bg-green-500/10",
                          event.status === "warning" && "bg-yellow-500/10",
                          event.status === "error" && "bg-red-500/10",
                        )}
                      >
                        <div className={status.className}>{status.icon}</div>
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono font-medium truncate">{event.eventName}</p>
                        {event.schemaName && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Schema: {event.schemaName}
                          </p>
                        )}
                        {event.validationErrors.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {event.validationErrors.length} validation issue
                            {event.validationErrors.length !== 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground font-mono">
                        {formatTimestamp(event.timestamp)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteEvent(event.id);
                        }}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Panel (Desktop) */}
      <div className="hidden lg:block lg:sticky lg:top-0 self-start">
        {selectedEvent ? (
          <EventDetailPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Select an event to view details</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Mobile Detail Overlay */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm p-4 flex items-center justify-center lg:hidden">
          <div className="w-full max-w-2xl">
            <EventDetailPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
