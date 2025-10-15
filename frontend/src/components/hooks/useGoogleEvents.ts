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

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes (events don't change often)
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
      // ✅ DETAILED ENVIRONMENT DEBUG
      console.log('🔍 ========================================');
      console.log('   GOOGLE EVENTS CONFIGURATION CHECK');
      console.log('🔍 ========================================');
      console.log('MODE:', import.meta.env.MODE);
      console.log('DEV:', import.meta.env.DEV);
      console.log('PROD:', import.meta.env.PROD);
      console.log('---');
      console.log('VITE_GOOGLE_SHEET_ID:', SHEET_ID || '❌ MISSING');
      console.log('VITE_GOOGLE_API_KEY:', API_KEY ? `✅ Present (${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 4)})` : '❌ MISSING');
      console.log('VITE_EVENTS_SHEET_NAME:', EVENTS_SHEET_NAME);
      console.log('🔍 ========================================\n');

      if (!SHEET_ID || !API_KEY) {
        const missingVars = [];
        if (!SHEET_ID) missingVars.push('VITE_GOOGLE_SHEET_ID');
        if (!API_KEY) missingVars.push('VITE_GOOGLE_API_KEY');
        
        const errorMsg = `❌ Missing environment variables for Events: ${missingVars.join(', ')}`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      const range = `${EVENTS_SHEET_NAME}!A2:J`;
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

      console.log('📅 Fetching events from:', `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=***`);

      const response = await fetch(url);
      console.log('📡 Events Response status:', response.status, response.statusText);

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }

        let errorData;
        try {
          errorData = await response.json();
          console.error('❌ Events API Error:', errorData);
        } catch {
          errorData = {};
        }

        // Detailed error messages
        if (response.status === 403) {
          throw new Error('Access denied to Events sheet. Check if: 1) Google Sheet is public, 2) API key is valid');
        } else if (response.status === 404) {
          throw new Error(`Events sheet not found. Check if sheet ID "${SHEET_ID}" and tab "${EVENTS_SHEET_NAME}" are correct`);
        } else if (response.status === 400) {
          throw new Error('Invalid request. Check if API key and Sheet ID are correct');
        }

        throw new Error(errorData.error?.message || `Failed to fetch events: ${response.status}`);
      }

      const data = await response.json();
      console.log('📄 Events data received');
      console.log('- Rows:', data.values?.length || 0);
      console.log('- First row sample:', data.values?.[0]?.slice(0, 3));

      if (!data.values || data.values.length === 0) {
        console.log('⚠️ No events found in sheet');
        return [];
      }

      const parsedEvents: CalendarEvent[] = data.values
        .map((row: string[], index: number) => {
          try {
            const [
              id, name, description, startDate, endDate, 
              type, animation, emoji, colors, decorElements
            ] = row;

            // Skip rows with missing dates
            if (!startDate || !endDate) {
              console.warn(`⚠️ Skipping event row ${index + 2}: missing dates`);
              return null;
            }

            return {
              id: parseInt(id, 10) || index + 1,
              summary: name || 'Untitled Event',
              description: description || '',
              start: { date: startDate },
              end: { date: endDate },
              eventType: (type as 'festival' | 'company' | 'special') || 'festival',
              animation: animation || 'pulse',
              emoji: emoji || '🎉',
              colors: colors ? colors.split(',').map(c => c.trim()) : ['#ff6b6b', '#ffa500'],
              decorElements: decorElements ? decorElements.split(',').map(d => d.trim()) : ['🎉', '✨']
            };
          } catch (err) {
            console.error(`❌ Error parsing event row ${index + 2}:`, err);
            return null;
          }
        })
        .filter((event: CalendarEvent | null): event is CalendarEvent => event !== null);

      console.log(`✅ Successfully parsed ${parsedEvents.length} events`);
      if (parsedEvents.length > 0) {
        console.log('Sample event:', {
          summary: parsedEvents[0].summary,
          start: parsedEvents[0].start.date,
          end: parsedEvents[0].end.date,
          type: parsedEvents[0].eventType
        });
      }

      return parsedEvents;
    };

    const loadEvents = async () => {
      // ✅ Check if cache is valid
      if (globalCache && Date.now() - globalCache.timestamp < CACHE_DURATION) {
        if (!isMountedRef.current) return;
        setEvents(globalCache.data);
        setLoading(globalCache.loading);
        setError(globalCache.error);
        console.log('📦 Using cached events data');
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
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
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
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch events';
        console.error('❌ Error fetching events from Google Sheets:', errorMessage);
        
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
      try {
        const startDate = new Date(event.start.date);
        const endDate = new Date(event.end.date);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        const isActive = today >= startDate && today <= endDate;

        if (isActive) {
          console.log('🎉 Active event found:', {
            summary: event.summary,
            start: event.start.date,
            end: event.end.date,
            emoji: event.emoji,
            type: event.eventType
          });
        }

        return isActive;
      } catch (err) {
        console.error('❌ Error checking event dates:', event.summary, err);
        return false;
      }
    });

    if (!activeEvent && events.length > 0) {
      console.log('ℹ️ No active events today (checked', events.length, 'events)');
    }

    return activeEvent || null;
  };

  return { events, loading, error, getActiveEvent };
};

// ✅ Utility to manually clear cache if needed
export const clearEventsCache = () => {
  globalCache = null;
  fetchPromise = null;
  console.log('🗑️ Events cache cleared');
};
