"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEventTrackingStore } from "@/stores/event-tracking-store";
import type { EventPropertySchema, EventSchema, PropertyType } from "@/types/event-tracking";
import { ChevronDown, ChevronUp, GripVertical, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useState } from "react";

const propertyTypes: PropertyType[] = ["string", "number", "boolean", "array", "object", "null"];

const typeColors: Record<PropertyType, string> = {
  string: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  number: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  boolean: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  array: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  object: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  null: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
};

// Generate unique ID for properties
const generatePropertyId = () => `prop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

interface SchemaFormData {
  name: string;
  description: string;
  properties: EventPropertySchema[];
}

const emptyFormData: SchemaFormData = {
  name: "",
  description: "",
  properties: [],
};

export function SchemaBuilder() {
  const { schemas, addSchema, updateSchema, deleteSchema, ui, setSelectedSchema } =
    useEventTrackingStore();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SchemaFormData>(emptyFormData);
  const [expandedSchemas, setExpandedSchemas] = useState<Set<string>>(new Set());

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData(emptyFormData);
  };

  const handleStartEdit = (schema: EventSchema) => {
    setIsCreating(false);
    setEditingId(schema.id);
    setFormData({
      name: schema.name,
      description: schema.description || "",
      properties: [...schema.properties],
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData(emptyFormData);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    if (isCreating) {
      addSchema({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        properties: formData.properties,
      });
    } else if (editingId) {
      updateSchema(editingId, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        properties: formData.properties,
      });
    }

    handleCancel();
  };

  const handleAddProperty = () => {
    const newProperty: EventPropertySchema = {
      id: generatePropertyId(),
      name: "",
      type: "string",
      required: false,
    };
    setFormData((prev) => ({
      ...prev,
      properties: [...prev.properties, newProperty],
    }));
  };

  const handleUpdateProperty = (id: string, updates: Partial<EventPropertySchema>) => {
    setFormData((prev) => ({
      ...prev,
      properties: prev.properties.map((prop) => (prop.id === id ? { ...prop, ...updates } : prop)),
    }));
  };

  const handleRemoveProperty = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      properties: prev.properties.filter((prop) => prop.id !== id),
    }));
  };

  const toggleExpanded = (schemaId: string) => {
    setExpandedSchemas((prev) => {
      const next = new Set(prev);
      if (next.has(schemaId)) {
        next.delete(schemaId);
      } else {
        next.add(schemaId);
      }
      return next;
    });
  };

  const isEditing = isCreating || editingId !== null;

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            {schemas.length} schema{schemas.length !== 1 ? "s" : ""} defined
          </p>
        </div>
        {!isEditing && (
          <Button onClick={handleStartCreate}>
            <Plus className="size-4" />
            New Schema
          </Button>
        )}
      </div>

      {/* Schema Form */}
      {isEditing && (
        <Card className="border-primary/50">
          <CardHeader>
            <CardTitle className="text-lg">
              {isCreating ? "Create New Schema" : "Edit Schema"}
            </CardTitle>
            <CardDescription>Define the event name and its properties</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Event Name */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Event Name *</label>
              <input
                type="text"
                placeholder="e.g., button_click, page_view"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Description */}
            <div className="grid gap-2">
              <label className="text-sm font-medium">Description</label>
              <textarea
                placeholder="Describe when this event should be fired..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>

            {/* Properties */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Properties</label>
                <Button variant="outline" size="sm" onClick={handleAddProperty}>
                  <Plus className="size-3" />
                  Add Property
                </Button>
              </div>

              {formData.properties.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                  No properties defined. Click "Add Property" to start.
                </div>
              ) : (
                <div className="space-y-2">
                  {formData.properties.map((prop, index) => (
                    <div
                      key={prop.id}
                      className="flex items-start gap-2 p-3 rounded-lg border bg-muted/30"
                    >
                      <GripVertical className="size-4 text-muted-foreground mt-2.5 shrink-0" />

                      <div className="flex-1 grid gap-3 sm:grid-cols-[1fr_auto_auto_auto] sm:items-center">
                        {/* Property Name */}
                        <div className="grid gap-1.5">
                          <label className="text-[10px] font-bold uppercase text-muted-foreground sm:hidden">
                            Property Name
                          </label>
                          <input
                            type="text"
                            placeholder="property_name"
                            value={prop.name}
                            onChange={(e) =>
                              handleUpdateProperty(prop.id, { name: e.target.value })
                            }
                            className="px-2 py-1.5 rounded border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>

                        {/* Type Selector */}
                        <div className="grid gap-1.5">
                          <label className="text-[10px] font-bold uppercase text-muted-foreground sm:hidden">
                            Type
                          </label>
                          <select
                            value={prop.type}
                            onChange={(e) =>
                              handleUpdateProperty(prop.id, {
                                type: e.target.value as PropertyType,
                              })
                            }
                            className="px-2 py-1.5 rounded border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                          >
                            {propertyTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Required Toggle */}
                        <div className="flex items-center gap-2 sm:mt-0">
                          <input
                            type="checkbox"
                            id={`req-${prop.id}`}
                            checked={prop.required}
                            onChange={(e) =>
                              handleUpdateProperty(prop.id, { required: e.target.checked })
                            }
                            className="rounded border-input"
                          />
                          <label
                            htmlFor={`req-${prop.id}`}
                            className="text-sm cursor-pointer whitespace-nowrap"
                          >
                            Required
                          </label>
                        </div>

                        {/* Remove Button */}
                        <div className="flex justify-end sm:block">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveProperty(prop.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <Button onClick={handleSave} disabled={!formData.name.trim()}>
                <Save className="size-4" />
                Save Schema
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schema List */}
      <div className="space-y-3">
        {schemas.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No event schemas defined yet.</p>
              <Button onClick={handleStartCreate}>
                <Plus className="size-4" />
                Create Your First Schema
              </Button>
            </CardContent>
          </Card>
        ) : (
          schemas.map((schema) => (
            <Card key={schema.id} className={editingId === schema.id ? "opacity-50" : ""}>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <button
                    onClick={() => toggleExpanded(schema.id)}
                    className="flex items-start gap-2 text-left min-w-0"
                  >
                    {expandedSchemas.has(schema.id) ? (
                      <ChevronUp className="size-4 text-muted-foreground mt-1 shrink-0" />
                    ) : (
                      <ChevronDown className="size-4 text-muted-foreground mt-1 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <CardTitle className="text-base font-mono truncate">{schema.name}</CardTitle>
                      {schema.description && (
                        <CardDescription className="mt-1 line-clamp-2">
                          {schema.description}
                        </CardDescription>
                      )}
                    </div>
                  </button>
                  <div className="flex items-center gap-1 self-end sm:self-start shrink-0">
                    <Badge variant="outline" className="text-xs">
                      {schema.properties.length} prop{schema.properties.length !== 1 ? "s" : ""}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartEdit(schema)}
                      disabled={isEditing}
                      className="size-8"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteSchema(schema.id)}
                      disabled={isEditing}
                      className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedSchemas.has(schema.id) && (
                <CardContent className="pt-0">
                  {schema.properties.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic">No properties defined</p>
                  ) : (
                    <div className="space-y-2">
                      {schema.properties.map((prop) => (
                        <div key={prop.id} className="flex items-center gap-3 text-sm">
                          <code className="font-mono text-foreground">{prop.name}</code>
                          <Badge variant="outline" className={typeColors[prop.type]}>
                            {prop.type}
                          </Badge>
                          {prop.required && (
                            <Badge variant="destructive" className="text-xs">
                              required
                            </Badge>
                          )}
                          {prop.description && (
                            <span className="text-muted-foreground">— {prop.description}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
