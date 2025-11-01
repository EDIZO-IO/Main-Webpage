// src/hooks/useGoogleEvents.ts
import { useState, useEffect, useRef } from 'react';

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

// ✅ Singleton cache to prevent multiple API calls
interface CacheEntry {
  data: CalendarEvent[];
  timestamp: number;
  loading: boolean;
  error: string | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let globalCache: CacheEntry | null = null;
let fetchPromise: Promise<CalendarEvent[]> | null = null;

export const useGoogleEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchEvents = async (): Promise<CalendarEvent[]> => {
      if (!SHEET_ID || !API_KEY) {
        throw new Error('Google Sheets configuration is missing.');
      }

      const range = `${EVENTS_SHEET_NAME}!A2:J`;
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        throw new Error(`Failed to fetch events: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.values || data.values.length === 0) {
        return [];
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

      return parsedEvents;
    };

    const loadEvents = async () => {
      // ✅ Check if cache is valid
      if (globalCache && Date.now() - globalCache.timestamp < CACHE_DURATION) {
        if (!isMountedRef.current) return;
        setEvents(globalCache.data);
        setLoading(globalCache.loading);
        setError(globalCache.error);
        return;
      }

      // ✅ If already fetching, wait for that promise
      if (fetchPromise) {
        try {
          const data = await fetchPromise;
          if (!isMountedRef.current) return;
          setEvents(data);
          setLoading(false);
          setError(null);
        } catch (err) {
          if (!isMountedRef.current) return;
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          setError(errorMessage);
          setLoading(false);
        }
        return;
      }

      // ✅ Start new fetch
      try {
        setLoading(true);
        setError(null);
        
        globalCache = {
          data: [],
          timestamp: Date.now(),
          loading: true,
          error: null
        };

        fetchPromise = fetchEvents();
        const data = await fetchPromise;
        
        globalCache = {
          data,
          timestamp: Date.now(),
          loading: false,
          error: null
        };

        if (!isMountedRef.current) return;
        setEvents(data);
        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        console.error('Error fetching events from Google Sheets:', err);
        
        globalCache = {
          data: [],
          timestamp: Date.now(),
          loading: false,
          error: errorMessage
        };

        if (!isMountedRef.current) return;
        setError(errorMessage);
        setLoading(false);
      } finally {
        fetchPromise = null;
      }
    };

    loadEvents();
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

// ✅ Utility to manually clear cache if needed
export const clearEventsCache = () => {
  globalCache = null;
  fetchPromise = null;
};
