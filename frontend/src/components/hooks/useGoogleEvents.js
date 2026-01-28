import { useState, useEffect, useRef } from 'react';

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const EVENTS_SHEET_NAME = import.meta.env.VITE_EVENTS_SHEET_NAME || 'Events';

export interface CalendarEvent {
  id;
  summary;
  description;
  start: { date };
  end: { date };
  eventType: 'festival' | 'company' | 'special';
  animation;
  emoji;
  colors;
  decorElements;
}

// --- Singleton cache ---

const CACHE_DURATION = 10 * 60 * 1000; // 10 min
let globalCache: CacheEntry | null = null;
let fetchPromise: Promise<CalendarEvent[]> | null = null;

export const useGoogleEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  // --- Use safe unmount guard
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // --- Visibility revalidation
  useEffect(() => {
    function onFocus() {
      // Only revalidate if cache expired
      if (!globalCache || Date.now() - globalCache.timestamp > CACHE_DURATION) {
        void loadEvents(true);
      }
    }
    window.addEventListener('visibilitychange', onFocus);
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('visibilitychange', onFocus);
      window.removeEventListener('focus', onFocus);
    };
    // eslint-disable-next-line
  }, []);

  // --- Improved fetch with timeout and background refresh
  const fetchEvents = async () => {
    //--- [All your debug/env logging here if you want] ---

    if (!SHEET_ID || !API_KEY) {
      const missingVars = [];
      if (!SHEET_ID) missingVars.push('VITE_GOOGLE_SHEET_ID');
      if (!API_KEY) missingVars.push('VITE_GOOGLE_API_KEY');
      throw new Error(`Missing Google Sheets configuration: ${missingVars.join(', ')}`);
    }

    const range = `${EVENTS_SHEET_NAME}!A2:J`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

    // --- Abort after timeout (to avoid infinite loading)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // 15s fallback

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) {
        let errorData;
        try { errorData = await response.json(); } catch { errorData = {}; }
        throw new Error(errorData.error?.message || `Failed to fetch: ${response.status}`);
      }

      const data = await response.json();
      if (!data.values) return [];
      return data.values.map((row, index) => {
        const [
          id, name, description, startDate, endDate,
          type, animation, emoji, colors, decorElements
        ] = row;
        if (!startDate || !endDate) return null;
        return {
          id: parseInt(id, 10) || index + 1,
          summary: name || 'Untitled Event',
          description: description || '',
          start: { date },
          end: { date },
          eventType: (type as 'festival' | 'company' | 'special') || 'festival',
          animation: animation || 'pulse',
          emoji: emoji || '🎉',
          colors: colors ? colors.split(',').map(c => c.trim()) : ['#ff6b6b', '#ffa500'],
          decorElements: decorElements ? decorElements.split(',').map(d => d.trim()) : ['🎉', '✨']
        };
      }).filter(Boolean) as CalendarEvent[];
    } finally {
      clearTimeout(timeout);
    }
  };

  // --- Main load function (refreshed logic)
  const loadEvents = async (revalidate = false) => {
    if (!revalidate && globalCache && Date.now() - globalCache.timestamp < CACHE_DURATION) {
      if (!isMountedRef.current) return;
      setEvents(globalCache.data);
      setLoading(false);
      setError(globalCache.error);
      return;
    }
    if (fetchPromise) {
      try {
        const data = await fetchPromise;
        if (!isMountedRef.current) return;
        setEvents(data);
        setLoading(false);
        setError(null);
      } catch (err) {
        if (!isMountedRef.current) return;
        setError(err instanceof Error ? err.message : 'Failed to fetch events');
        setLoading(false);
      }
      return;
    }
    try {
      setLoading(true);
      setError(null);
      fetchPromise = fetchEvents();
      const data = await fetchPromise;
      globalCache = {
        data,
        timestamp: Date.now(),
        loading,
        error
      };
      if (!isMountedRef.current) return;
      setEvents(data);
      setLoading(false);
    } catch (err) {
      globalCache = {
        data,
        timestamp: Date.now(),
        loading,
        error: err instanceof Error ? err.message : 'Failed to fetch events'
      };
      if (!isMountedRef.current) return;
      setError(globalCache.error);
      setLoading(false);
    } finally {
      fetchPromise = null;
    }
  };

  // --- Initial load (shows cached data immediately if present, background refresh)
  useEffect(() => {
    if (globalCache && globalCache.data.length > 0) {
      setEvents(globalCache.data);
      setLoading(globalCache.loading);
      setError(globalCache.error);
      // still do a silent refresh if cache expired
      if (Date.now() - globalCache.timestamp > CACHE_DURATION) loadEvents(true);
    } else {
      loadEvents();
    }
    // eslint-disable-next-line
  }, []);

  // --- Utility to get today's event
  const getActiveEvent = (): CalendarEvent | null => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events.find(event => {
      try {
        const start = new Date(event.start.date);
        const end = new Date(event.end.date);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return today >= start && today <= end;
      } catch {
        return false;
      }
    }) || null;
  };

  return { events, loading, error, getActiveEvent };
};

export const clearEventsCache = () => {
  globalCache = null;
  fetchPromise = null;
  console.log('🗑️ Events cache cleared');
};
