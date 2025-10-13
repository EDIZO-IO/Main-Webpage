// src/types/googleEvents.ts
/**
 * Defines the structured data for a calendar event, including UI-specific properties
 * for animations and decorations, fetched from the Google Sheet.
 */
export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: string; // ISO date string, e.g., "2025-10-21"
  end: string;   // ISO date string, e.g., "2025-10-28"
  eventType: 'festival' | 'company' | 'special';
  animation: string;
  emoji: string;
  colors: string[];
  decorElements: string[];
}

/**
 * Extends the global Window interface to include the Google API client (`gapi`),
 * which is loaded from an external script. This prevents TypeScript errors
 * when accessing `window.gapi`.
 */
declare global {
  interface Window {
    gapi: any; // `any` is acceptable here as gapi has a complex, dynamic structure.
  }
}
