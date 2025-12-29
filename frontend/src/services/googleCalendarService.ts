// src/services/googleCalendarService.ts

import type { CalendarEvent } from '../types/googleEvents';

// Consolidates environment variables for easier access and validation.
const GOOGLE_CONFIG = {
  SHEET_ID: import.meta.env.VITE_GOOGLE_SHEET_ID,
  API_KEY: import.meta.env.VITE_GOOGLE_API_KEY,
};

class GoogleCalendarService {
  /**
   * Fetches and parses events from a public Google Sheet.
   * This function assumes a specific column order in the 'Events' tab.
   * @returns A promise that resolves to an array of CalendarEvent objects.
   */
  async getSheetEvents(): Promise<CalendarEvent[]> {
    if (!GOOGLE_CONFIG.SHEET_ID || !GOOGLE_CONFIG.API_KEY) {
      const errorMessage = 'Missing VITE_GOOGLE_SHEET_ID or VITE_GOOGLE_API_KEY. Please check your .env file.';
      console.error(`❌ Configuration Error: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    // Fetches all rows from column A to J in the 'Events' sheet, starting from row 2.
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_CONFIG.SHEET_ID}/values/Events!A2:J?key=${GOOGLE_CONFIG.API_KEY}`;

    try {
      console.log('📊 Fetching events from Google Sheet...');
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData.error?.message || 'An unknown error occurred while fetching from the Sheets API.';
        throw new Error(`Google Sheets API Error: ${message}`);
      }

      const data = await response.json();
      const rows: string[][] = data.values || [];

      if (rows.length === 0) {
        console.warn('⚠️ No data found in the "Events" tab of the Google Sheet.');
        return [];
      }

      const events = rows
        .map(this.parseEventRow)
        .filter((event): event is CalendarEvent => event !== null);

      console.log(`✅ Successfully fetched and parsed ${events.length} events.`);
      return events;

    } catch (error) {
      console.error('❌ An error occurred during the fetch operation:', error);
      // Re-throw the error so it can be caught by the calling hook and reflected in the UI.
      throw error;
    }
  }

  /**
   * Parses a single row from the Google Sheet into a CalendarEvent object.
   * @param row An array of strings representing a row's cell values.
   * @param index The index of the row, used for logging and generating fallback IDs.
   * @returns A CalendarEvent object or null if the row is invalid.
   */
  private parseEventRow(row: string[], index: number): CalendarEvent | null {
    const [
      id, summary, description, start, end,
      eventType, animation, emoji, colors, decorElements
    ] = row;

    // A row is invalid if it's missing the essential title, start, or end date.
    if (!summary || !start || !end) {
      console.warn(`⚠️ Skipping sheet row ${index + 2}: Missing required fields (Summary, Start, or End Date).`);
      return null;
    }

    return {
      id: id || `sheet-event-${index}`,
      summary,
      description: description || '',
      start,
      end,
      eventType: (eventType || 'festival') as CalendarEvent['eventType'],
      animation: animation || 'default-glow',
      emoji: emoji || '🎉',
      colors: colors ? colors.split(',').map(c => c.trim()) : ['#FFD700', '#FF6B35'],
      decorElements: decorElements ? decorElements.split(',').map(d => d.trim()) : [],
    };
  }
}

// Export a singleton instance so the same service is used throughout the app.
export const googleCalendarService = new GoogleCalendarService();
