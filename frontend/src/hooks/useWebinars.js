import { useState, useEffect } from 'react';
import { eventsAPI } from '../api/api';

const CACHE_KEY = 'edizo_webinars_cache';
const CACHE_DURATION = 5 * 60 * 1000;

let globalCache = null;

export const useWebinars = () => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadWebinars = async () => {
      // Return cached data immediately if available
      if (globalCache && globalCache.data.length > 0) {
        setWebinars(globalCache.data);
        setLoading(false);
        setError(globalCache.error);
        
        // Background refresh if cache expired
        if (Date.now() - globalCache.timestamp > CACHE_DURATION) {
          refreshWebinars();
        }
        return;
      }

      try {
        setLoading(true);
        // Fetch webinars (events with type 'Webinar')
        const response = await eventsAPI.getAll({ type: 'Webinar' });
        
        globalCache = {
          data: response.data.events || [],
          timestamp: Date.now(),
          error: null
        };
        
        localStorage.setItem(CACHE_KEY, JSON.stringify(globalCache));
        
        setWebinars(globalCache.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch webinars');
        setLoading(false);
      }
    };

    loadWebinars();
  }, []);

  const refreshWebinars = async () => {
    try {
      const response = await eventsAPI.getAll({ type: 'Webinar' });
      globalCache = {
        data: response.data.events || [],
        timestamp: Date.now(),
        error: null
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(globalCache));
      setWebinars(globalCache.data);
    } catch (err) {
      console.error('Failed to refresh webinars:', err);
    }
  };

  return { webinars, loading, error };
};
