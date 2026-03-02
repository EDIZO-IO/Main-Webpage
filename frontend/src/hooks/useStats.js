import { useState, useEffect } from 'react';
import { statsAPI } from '../api/api';

const CACHE_KEY = 'edizo_stats_cache';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

let globalCache = null;

try {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const parsed = JSON.parse(cached);
    if (parsed.timestamp && Date.now() - parsed.timestamp < CACHE_DURATION) {
      globalCache = parsed;
    }
  }
} catch (e) {
  console.warn('Failed to load cache:', e);
}

export const useStats = (category) => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStats = async () => {
      if (globalCache && globalCache.data.length > 0) {
        setStats(globalCache.data);
        setLoading(false);
        
        if (Date.now() - globalCache.timestamp > CACHE_DURATION) {
          refreshStats();
        }
        return;
      }

      try {
        setLoading(true);
        const response = await statsAPI.getAll(category ? { category } : {});
        
        globalCache = {
          data: response.data.stats || [],
          timestamp: Date.now(),
          error: null
        };
        
        localStorage.setItem(CACHE_KEY, JSON.stringify(globalCache));
        
        setStats(globalCache.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch stats');
        setLoading(false);
      }
    };

    loadStats();
  }, [category]);

  const refreshStats = async () => {
    try {
      const response = await statsAPI.getAll(category ? { category } : {});
      globalCache = {
        data: response.data.stats || [],
        timestamp: Date.now(),
        error: null
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(globalCache));
      setStats(globalCache.data);
    } catch (err) {
      console.error('Failed to refresh stats:', err);
    }
  };

  return { stats, loading, error };
};
