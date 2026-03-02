import { useState, useEffect } from 'react';
import { eventsAPI } from '../api/api';

const CACHE_KEY = 'edizo_events_cache';
const CACHE_DURATION = 5 * 60 * 1000;

let globalCache = null;

export const useEvents = (type, upcoming = false) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEvents = async () => {
      if (globalCache && globalCache.data.length > 0) {
        setEvents(globalCache.data);
        setLoading(false);
        
        if (Date.now() - globalCache.timestamp > CACHE_DURATION) {
          refreshEvents();
        }
        return;
      }

      try {
        setLoading(true);
        const response = await eventsAPI.getAll({ type, upcoming });
        
        globalCache = {
          data: response.data.events || [],
          timestamp: Date.now(),
          error: null
        };
        
        localStorage.setItem(CACHE_KEY, JSON.stringify(globalCache));
        
        setEvents(globalCache.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch events');
        setLoading(false);
      }
    };

    loadEvents();
  }, [type, upcoming]);

  const refreshEvents = async () => {
    try {
      const response = await eventsAPI.getAll({ type, upcoming });
      globalCache = {
        data: response.data.events || [],
        timestamp: Date.now(),
        error: null
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(globalCache));
      setEvents(globalCache.data);
    } catch (err) {
      console.error('Failed to refresh events:', err);
    }
  };

  return { events, loading, error };
};
