/**
 * Event Tracking Playground - Type Definitions
 *
 * Data structure for Event Tracking Playground including:
 * - Event Schema: Event structure definition (name, properties, data types)
 * - Event Instance: Sent/simulated events
 * - Validation: Event validation results
 */

// ============================================
// Property Types - Supported data types for event properties
// ============================================

export type PropertyType = "string" | "number" | "boolean" | "array" | "object" | "null";

/**
 * Define property in event schema
 * Example: { name: "user_id", type: "string", required: true, description: "Unique user identifier" }
 */
export interface EventPropertySchema {
  id: string;
  name: string;
  type: PropertyType;
  required: boolean;
  description?: string;
  defaultValue?: unknown;
}

// ============================================
// Event Schema - Blueprint/template for events
// ============================================

/**
 * Event schema defining the event structure
 * Users can create multiple schemas (e.g., "button_click", "page_view", "purchase")
 */
export interface EventSchema {
  id: string;
  name: string; // e.g., "button_click", "page_view"
  description?: string;
  properties: EventPropertySchema[];
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// Event Instance - Sent/simulated events
// ============================================

export type EventStatus = "valid" | "warning" | "error";

/**
 * Event sent to the timeline
 * Contains actual payload and validation results
 */
export interface EventInstance {
  id: string;
  schemaId: string | null; // null if event is sent without schema (raw JSON)
  schemaName?: string; // Cached schema name for display
  eventName: string;
  payload: Record<string, unknown>;
  timestamp: Date;
  status: EventStatus;
  validationErrors: ValidationError[];
}

// ============================================
// Validation - Event validation results
// ============================================

export type ValidationErrorType =
  | "missing_required" // Required property is missing
  | "type_mismatch" // Data type mismatch
  | "unknown_property"; // Property not in schema (warning)

export interface ValidationError {
  type: ValidationErrorType;
  propertyName: string;
  message: string;
  severity: "error" | "warning";
  expected?: string;
  received?: string;
}

// ============================================
// UI State Types
// ============================================

export type ActiveView = "schema-builder" | "simulator" | "timeline";

export interface UIState {
  activeView: ActiveView;
  selectedSchemaId: string | null;
  selectedEventId: string | null;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
}

// ============================================
// Store State - Zustand store type
// ============================================

export interface EventTrackingState {
  // Data
  schemas: EventSchema[];
  events: EventInstance[];

  // UI State
  ui: UIState;

  // Schema Actions
  addSchema: (schema: Omit<EventSchema, "id" | "createdAt" | "updatedAt">) => void;
  updateSchema: (id: string, schema: Partial<Omit<EventSchema, "id" | "createdAt">>) => void;
  deleteSchema: (id: string) => void;
  getSchemaById: (id: string) => EventSchema | undefined;

  // Event Actions
  sendEvent: (
    event: Omit<EventInstance, "id" | "timestamp" | "status" | "validationErrors">,
  ) => void;
  clearEvents: () => void;
  deleteEvent: (id: string) => void;

  // UI Actions
  setActiveView: (view: ActiveView) => void;
  setSelectedSchema: (id: string | null) => void;
  setSelectedEvent: (id: string | null) => void;
  toggleSidebar: () => void;
  setMobileSidebarOpen: (open: boolean) => void;

  // Validation
  validateEvent: (
    payload: Record<string, unknown>,
    schema: EventSchema | null,
  ) => ValidationError[];
}
