import type {
  EventInstance,
  EventSchema,
  EventTrackingState,
  PropertyType,
  ValidationError,
} from "@/types/event-tracking";
import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Helper: Generate unique ID
 */
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Helper: Get JavaScript type from value
 */
const getValueType = (value: unknown): PropertyType => {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  const type = typeof value;
  if (type === "string" || type === "number" || type === "boolean" || type === "object") {
    return type as PropertyType;
  }
  return "string"; // fallback
};

/**
 * Helper: Validate event payload against schema
 */
const validateEventPayload = (
  payload: Record<string, unknown>,
  schema: EventSchema | null,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!schema) {
    // No schema - cannot validate, return empty
    return errors;
  }

  // Check required properties
  for (const prop of schema.properties) {
    const value = payload[prop.name];

    // Check if required property is missing
    if (prop.required && (value === undefined || value === null)) {
      errors.push({
        type: "missing_required",
        propertyName: prop.name,
        message: `Required property "${prop.name}" is missing`,
        severity: "error",
      });
      continue;
    }

    // Skip validation if property is not present and not required
    if (value === undefined) continue;

    // Check type mismatch
    const actualType = getValueType(value);
    if (actualType !== prop.type && value !== null) {
      errors.push({
        type: "type_mismatch",
        propertyName: prop.name,
        message: `Property "${prop.name}" has wrong type`,
        severity: "error",
        expected: prop.type,
        received: actualType,
      });
    }
  }

  // Check for unknown properties (warning only)
  const schemaPropertyNames = new Set(schema.properties.map((p) => p.name));
  for (const key of Object.keys(payload)) {
    if (!schemaPropertyNames.has(key)) {
      errors.push({
        type: "unknown_property",
        propertyName: key,
        message: `Property "${key}" is not defined in schema`,
        severity: "warning",
      });
    }
  }

  return errors;
};

/**
 * Determine event status based on validation errors
 */
const getEventStatus = (errors: ValidationError[]): EventInstance["status"] => {
  if (errors.some((e) => e.severity === "error")) return "error";
  if (errors.some((e) => e.severity === "warning")) return "warning";
  return "valid";
};

/**
 * Sample schemas untuk demo
 */
const sampleSchemas: EventSchema[] = [
  {
    id: "sample-button-click",
    name: "button_click",
    description: "Fired when user clicks a button",
    properties: [
      {
        id: "prop-1",
        name: "button_id",
        type: "string",
        required: true,
        description: "Unique button identifier",
      },
      {
        id: "prop-2",
        name: "button_text",
        type: "string",
        required: false,
        description: "Button label text",
      },
      {
        id: "prop-3",
        name: "page",
        type: "string",
        required: true,
        description: "Page where button is located",
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "sample-page-view",
    name: "page_view",
    description: "Fired when user views a page",
    properties: [
      {
        id: "prop-4",
        name: "page_name",
        type: "string",
        required: true,
        description: "Name of the page",
      },
      {
        id: "prop-5",
        name: "page_url",
        type: "string",
        required: true,
        description: "Full URL of the page",
      },
      {
        id: "prop-6",
        name: "referrer",
        type: "string",
        required: false,
        description: "Referrer URL",
      },
      {
        id: "prop-7",
        name: "load_time_ms",
        type: "number",
        required: false,
        description: "Page load time in milliseconds",
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

/**
 * Event Tracking Store
 * Uses Zustand with persist middleware to store data in localStorage
 */
export const useEventTrackingStore = create<EventTrackingState>()(
  persist(
    (set, get) => ({
      // Initial Data
      schemas: sampleSchemas,
      events: [],

      // Initial UI State
      ui: {
        activeView: "schema-builder",
        selectedSchemaId: null,
        selectedEventId: null,
        sidebarCollapsed: false,
        mobileSidebarOpen: false,
      },

      // Schema Actions
      addSchema: (schema) => {
        const newSchema: EventSchema = {
          ...schema,
          id: generateId(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({
          schemas: [...state.schemas, newSchema],
        }));
      },

      updateSchema: (id, updates) => {
        set((state) => ({
          schemas: state.schemas.map((schema) =>
            schema.id === id ? { ...schema, ...updates, updatedAt: new Date() } : schema,
          ),
        }));
      },

      deleteSchema: (id) => {
        set((state) => ({
          schemas: state.schemas.filter((schema) => schema.id !== id),
          ui: state.ui.selectedSchemaId === id ? { ...state.ui, selectedSchemaId: null } : state.ui,
        }));
      },

      getSchemaById: (id) => {
        return get().schemas.find((schema) => schema.id === id);
      },

      // Event Actions
      sendEvent: (eventData) => {
        const schema = eventData.schemaId ? get().getSchemaById(eventData.schemaId) : null;
        const validationErrors = validateEventPayload(eventData.payload, schema ?? null);

        const newEvent: EventInstance = {
          ...eventData,
          id: generateId(),
          schemaName: schema?.name,
          timestamp: new Date(),
          status: getEventStatus(validationErrors),
          validationErrors,
        };

        set((state) => ({
          events: [newEvent, ...state.events], // Newest first
        }));
      },

      clearEvents: () => {
        set({ events: [] });
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
          ui: state.ui.selectedEventId === id ? { ...state.ui, selectedEventId: null } : state.ui,
        }));
      },

      // UI Actions
      setActiveView: (view) => {
        set((state) => ({
          ui: { ...state.ui, activeView: view },
        }));
      },

      setSelectedSchema: (id) => {
        set((state) => ({
          ui: { ...state.ui, selectedSchemaId: id },
        }));
      },

      setSelectedEvent: (id) => {
        set((state) => ({
          ui: { ...state.ui, selectedEventId: id },
        }));
      },

      toggleSidebar: () => {
        set((state) => ({
          ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed },
        }));
      },

      setMobileSidebarOpen: (open) => {
        set((state) => ({
          ui: { ...state.ui, mobileSidebarOpen: open },
        }));
      },

      // Validation Helper
      validateEvent: validateEventPayload,
    }),
    {
      name: "event-tracking-storage",
      // Custom serialization for Date objects
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          // Convert date strings back to Date objects
          if (parsed.state?.schemas) {
            parsed.state.schemas = parsed.state.schemas.map((s: EventSchema) => ({
              ...s,
              createdAt: new Date(s.createdAt),
              updatedAt: new Date(s.updatedAt),
            }));
          }
          if (parsed.state?.events) {
            parsed.state.events = parsed.state.events.map((e: EventInstance) => ({
              ...e,
              timestamp: new Date(e.timestamp),
            }));
          }
          return parsed;
        },
        setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);
