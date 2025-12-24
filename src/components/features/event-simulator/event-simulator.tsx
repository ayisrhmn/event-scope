"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEventTrackingStore } from "@/stores/event-tracking-store";
import type { ValidationError } from "@/types/event-tracking";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Code,
  FileJson,
  FormInput,
  Play,
} from "lucide-react";
import { useMemo, useState } from "react";

type InputMode = "form" | "json";

const validationStatusConfig = {
  valid: {
    icon: <CheckCircle className="size-4" />,
    className: "text-green-600 dark:text-green-400",
  },
  warning: {
    icon: <AlertTriangle className="size-4" />,
    className: "text-yellow-600 dark:text-yellow-400",
  },
  error: {
    icon: <AlertCircle className="size-4" />,
    className: "text-red-600 dark:text-red-400",
  },
};

export function EventSimulator() {
  const { schemas, sendEvent, validateEvent, setActiveView } = useEventTrackingStore();
  const [inputMode, setInputMode] = useState<InputMode>("form");
  const [selectedSchemaId, setSelectedSchemaId] = useState<string | null>(null);
  const [eventName, setEventName] = useState("");
  const [jsonInput, setJsonInput] = useState("{\n  \n}");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [previewErrors, setPreviewErrors] = useState<ValidationError[]>([]);
  const [jsonError, setJsonError] = useState<string | null>(null);

  const selectedSchema = selectedSchemaId ? schemas.find((s) => s.id === selectedSchemaId) : null;

  const handleSchemaChange = (schemaId: string | null) => {
    setSelectedSchemaId(schemaId);
    setFormValues({});
    setPreviewErrors([]);

    if (schemaId) {
      const schema = schemas.find((s) => s.id === schemaId);
      if (schema) {
        setEventName(schema.name);
        // Generate sample JSON
        const samplePayload: Record<string, unknown> = {};
        for (const prop of schema.properties) {
          if (prop.type === "string") samplePayload[prop.name] = "";
          else if (prop.type === "number") samplePayload[prop.name] = 0;
          else if (prop.type === "boolean") samplePayload[prop.name] = false;
          else if (prop.type === "array") samplePayload[prop.name] = [];
          else if (prop.type === "object") samplePayload[prop.name] = {};
          else samplePayload[prop.name] = null;
        }
        setJsonInput(JSON.stringify(samplePayload, null, 2));
      }
    } else {
      setEventName("");
      setJsonInput("{\n  \n}");
    }
  };

  const parsePayload = (): Record<string, unknown> | null => {
    if (inputMode === "json") {
      try {
        const parsed = JSON.parse(jsonInput);
        return parsed;
      } catch (e) {
        return null;
      }
    } else {
      // Convert form values to payload
      const payload: Record<string, unknown> = {};
      if (selectedSchema) {
        for (const prop of selectedSchema.properties) {
          const value = formValues[prop.name];
          if (value === undefined || value === "") continue;

          // Type conversion
          if (prop.type === "number") {
            payload[prop.name] = Number(value);
          } else if (prop.type === "boolean") {
            payload[prop.name] = value === "true";
          } else if (prop.type === "array" || prop.type === "object") {
            try {
              payload[prop.name] = JSON.parse(value);
            } catch {
              payload[prop.name] = value;
            }
          } else {
            payload[prop.name] = value;
          }
        }
      }
      return payload;
    }
  };

  // Memoized payload for preview to avoid calling parsePayload during render
  const previewPayload = useMemo(() => {
    return parsePayload() || {};
  }, [inputMode, jsonInput, formValues, selectedSchema]);

  const handleValidate = () => {
    if (inputMode === "json") {
      try {
        JSON.parse(jsonInput);
        setJsonError(null);
      } catch (e) {
        setJsonError("Invalid JSON format");
        return;
      }
    }

    const payload = parsePayload();
    if (!payload) return;

    const errors = validateEvent(payload, selectedSchema ?? null);
    setPreviewErrors(errors);
  };

  const handleSendEvent = () => {
    if (inputMode === "json") {
      try {
        JSON.parse(jsonInput);
        setJsonError(null);
      } catch (e) {
        setJsonError("Invalid JSON format");
        return;
      }
    }

    const payload = parsePayload();
    if (!payload) return;
    if (!eventName.trim()) return;

    sendEvent({
      schemaId: selectedSchemaId,
      eventName: eventName.trim(),
      payload,
    });

    // Navigate to timeline
    setActiveView("timeline");
  };

  const handleFormValueChange = (propName: string, value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [propName]: value,
    }));
    setPreviewErrors([]);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
      {/* Main Form */}
      <div className="space-y-6 min-w-0">
        {/* Schema Selection */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg">Select Schema</CardTitle>
            <CardDescription>Choose an existing schema or send a raw event</CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
            <select
              value={selectedSchemaId || ""}
              onChange={(e) => handleSchemaChange(e.target.value || null)}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">No schema (raw event)</option>
              {schemas.map((schema) => (
                <option key={schema.id} value={schema.id}>
                  {schema.name}
                </option>
              ))}
            </select>

            {schemas.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                No schemas available.{" "}
                <button
                  onClick={() => setActiveView("schema-builder")}
                  className="text-primary hover:underline"
                >
                  Create one first
                </button>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Event Name */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg">Event Name</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
            <input
              type="text"
              placeholder="e.g., button_click"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring font-mono"
            />
          </CardContent>
        </Card>

        {/* Input Mode Toggle */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg">Event Payload</CardTitle>
                <CardDescription className="hidden sm:block">
                  Enter data using form or JSON
                </CardDescription>
              </div>
              <div className="flex items-center gap-1 p-1 bg-muted rounded-lg self-start sm:self-center">
                <button
                  onClick={() => setInputMode("form")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                    inputMode === "form"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <FormInput className="size-4" />
                  Form
                </button>
                <button
                  onClick={() => setInputMode("json")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                    inputMode === "json"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Code className="size-4" />
                  JSON
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
            {inputMode === "form" ? (
              <div className="space-y-4">
                {selectedSchema ? (
                  selectedSchema.properties.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic py-4 text-center">
                      This schema has no properties defined
                    </p>
                  ) : (
                    selectedSchema.properties.map((prop) => (
                      <div key={prop.id} className="grid gap-1.5">
                        <label className="text-sm font-medium flex flex-wrap items-center gap-2">
                          <span className="font-mono">{prop.name}</span>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-[10px] px-1 py-0 font-normal">
                              {prop.type}
                            </Badge>
                            {prop.required && (
                              <Badge variant="destructive" className="text-[10px] px-1 py-0">
                                required
                              </Badge>
                            )}
                          </div>
                        </label>
                        {prop.type === "boolean" ? (
                          <select
                            value={formValues[prop.name] || ""}
                            onChange={(e) => handleFormValueChange(prop.name, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          >
                            <option value="">-- Select --</option>
                            <option value="true">true</option>
                            <option value="false">false</option>
                          </select>
                        ) : prop.type === "array" || prop.type === "object" ? (
                          <textarea
                            placeholder={
                              prop.type === "array" ? '["item1", "item2"]' : '{"key": "value"}'
                            }
                            value={formValues[prop.name] || ""}
                            onChange={(e) => handleFormValueChange(prop.name, e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                          />
                        ) : (
                          <input
                            type={prop.type === "number" ? "number" : "text"}
                            placeholder={prop.description || `Enter ${prop.name}`}
                            value={formValues[prop.name] || ""}
                            onChange={(e) => handleFormValueChange(prop.name, e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        )}
                      </div>
                    ))
                  )
                ) : (
                  <p className="text-sm text-muted-foreground italic py-4 text-center">
                    Select a schema to use form mode
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={jsonInput}
                  onChange={(e) => {
                    setJsonInput(e.target.value);
                    setJsonError(null);
                    setPreviewErrors([]);
                  }}
                  rows={10}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder='{"property": "value"}'
                />
                {jsonError && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="size-4" />
                    {jsonError}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            onClick={handleSendEvent}
            disabled={!eventName.trim()}
            className="flex-1 sm:flex-none"
          >
            <Play className="size-4" />
            Send Event
          </Button>
          <Button variant="outline" onClick={handleValidate} className="flex-1 sm:flex-none">
            <FileJson className="size-4" />
            Validate
          </Button>
        </div>
      </div>

      {/* Validation Preview */}
      <div className="space-y-4 lg:sticky lg:top-0 self-start">
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg">Validation Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
            {previewErrors.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <FileJson className="size-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Click "Validate" to check</p>
              </div>
            ) : (
              <div className="space-y-3">
                {previewErrors.map((error, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-2 text-sm ${
                      error.severity === "error"
                        ? "text-red-600 dark:text-red-400"
                        : "text-yellow-600 dark:text-yellow-400"
                    }`}
                  >
                    {error.severity === "error" ? (
                      <AlertCircle className="size-4 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">{error.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* JSON Preview */}
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg">Payload Preview</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
            <pre className="text-xs font-mono bg-muted/50 p-3 rounded-lg overflow-auto max-h-48 sm:max-h-64">
              {JSON.stringify(previewPayload, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
