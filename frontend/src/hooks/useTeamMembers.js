import { useState, useEffect } from 'react';
import { teamAPI } from '../api/api';

const CACHE_KEY = 'edizo_team_cache';
const CACHE_DURATION = 5 * 60 * 1000;

let globalCache = null;

// Initialize from localStorage
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

export const useTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadTeam = async () => {
      // Return cached data immediately if available
      if (globalCache && globalCache.data.length > 0) {
        setTeamMembers(globalCache.data);
        setLoading(false);
        setError(globalCache.error);
        
        // Background refresh if cache expired
        if (Date.now() - globalCache.timestamp > CACHE_DURATION) {
          refreshTeam();
        }
        return;
      }

      try {
        setLoading(true);
        const response = await teamAPI.getAll();
        
        globalCache = {
          data: response.data.team_members || [],
          timestamp: Date.now(),
          error: null
        };
        
        localStorage.setItem(CACHE_KEY, JSON.stringify(globalCache));
        
        setTeamMembers(globalCache.data);
        setLoading(false);
      } catch (err) {
        const errorMsg = err.response?.data?.error || 'Failed to fetch team members';
        globalCache = {
          data: [],
          timestamp: Date.now(),
          error: errorMsg
        };
        setError(errorMsg);
        setLoading(false);
      }
    };

    loadTeam();
  }, []);

  const refreshTeam = async () => {
    try {
      const response = await teamAPI.getAll();
      globalCache = {
        data: response.data.team_members || [],
        timestamp: Date.now(),
        error: null
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(globalCache));
      setTeamMembers(globalCache.data);
    } catch (err) {
      console.error('Failed to refresh team:', err);
    }
  };

  return { teamMembers, loading, error, refreshTeam };
};

export const clearTeamCache = () => {
  globalCache = null;
  localStorage.removeItem(CACHE_KEY);
};
