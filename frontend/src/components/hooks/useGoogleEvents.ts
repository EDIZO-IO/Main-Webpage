// src/hooks/useGoogleEvents.ts
import { useState, useEffect, useCallback } from 'react';
import { googleCalendarService } from '../../services/googleCalendarService';
import type { CalendarEvent } from '../../types/googleEvents';

export const useGoogleEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    // Prevent setting loading state on background refreshes if desired,
    // but for now, we show loading for clarity on each fetch.
    setLoading(true);
    setError(null);
    try {
      const sheetEvents = await googleCalendarService.getSheetEvents();
      setEvents(sheetEvents);
    } catch (err: any) {
      console.error('❌ Hook caught an error while fetching events:', err);
      setError(err.message || 'Failed to load event data.');
      setEvents([]); // Ensure events are cleared on error.
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on component mount and set up a periodic refresh.
  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 1800000); // Refresh every 30 minutes
    return () => clearInterval(interval); // Cleanup interval on unmount.
  }, [fetchEvents]);

  /**
   * Memoized function to find the event that is currently active.
   * It normalizes dates to midnight to ensure accurate day-based comparisons.
   */
  const getActiveEvent = useCallback((): CalendarEvent | null => {
    if (events.length === 0) return null;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // FIX: Explicitly type the 'event' parameter to resolve TypeScript error ts(7006).
    const activeEvent = events.find((event: CalendarEvent) => {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999); // Set to end of day to be inclusive
      
      return today >= startDate && today <= endDate;
    });
    
    return activeEvent || null;
  }, [events]);

  return {
    events,
    loading,
    error,
    getActiveEvent,
    refreshEvents: fetchEvents,
  };
};
