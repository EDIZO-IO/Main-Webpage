// src/hooks/useGoogleEvents.ts
import { useState, useEffect } from 'react';

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const EVENTS_SHEET_NAME = import.meta.env.VITE_EVENTS_SHEET_NAME || 'Events';

export interface CalendarEvent {
  id: number;
  summary: string;
  description: string;
  start: { date: string };
  end: { date: string };
  eventType: 'festival' | 'company' | 'special';
  animation: string;
  emoji: string;
  colors: string[];
  decorElements: string[];
}

export const useGoogleEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!SHEET_ID || !API_KEY) {
        setError('Google Sheets configuration is missing.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const range = `${EVENTS_SHEET_NAME}!A2:J`;
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.values || data.values.length === 0) {
          setEvents([]);
          setLoading(false);
          return;
        }

        const parsedEvents: CalendarEvent[] = data.values
          .map((row: string[]) => {
            const [
              id, name, description, startDate, endDate, 
              type, animation, emoji, colors, decorElements
            ] = row;

            return {
              id: parseInt(id, 10),
              summary: name || '',
              description: description || '',
              start: { date: startDate || '' },
              end: { date: endDate || '' },
              eventType: (type as 'festival' | 'company' | 'special') || 'festival',
              animation: animation || '',
              emoji: emoji || '🎉',
              colors: colors ? colors.split(',').map(c => c.trim()) : [],
              decorElements: decorElements ? decorElements.split(',').map(d => d.trim()) : []
            };
          })
          .filter((event: CalendarEvent) => event.start.date && event.end.date);

        setEvents(parsedEvents);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events from Google Sheets:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getActiveEvent = (): CalendarEvent | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeEvent = events.find((event: CalendarEvent) => {
      const startDate = new Date(event.start.date);
      const endDate = new Date(event.end.date);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);

      return today >= startDate && today <= endDate;
    });

    return activeEvent || null;
  };

  return { events, loading, error, getActiveEvent };
};
