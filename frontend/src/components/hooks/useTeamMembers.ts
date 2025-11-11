import { useState, useEffect, useRef } from 'react';
import type { TeamMember, UseTeamMembersReturn } from '../../types/team.types';

// --- Singleton cache ---
interface CacheEntry {
  data: TeamMember[];
  timestamp: number;
  loading: boolean;
  error: string | null;
}
const CACHE_DURATION = 5 * 60 * 1000; // 5 min
let globalCache: CacheEntry | null = null;
let fetchPromise: Promise<TeamMember[]> | null = null;

/**
 * Get code asset path, filename, or CDN link from the Sheet's photo field.
 * - If blank, #, or N/A, returns the code folder placeholder.
 * - If only a filename is given, resolves to /assets/team/filename.ext
 * - If / or http specified, used directly.
 */
const getImagePath = (val: string): string => {
  if (!val || val.trim() === '' || val === '#' || val.toLowerCase() === 'n/a') {
    return '/assets/team/No-Dp-Pics.jpeg'; // fallback to local
  }
  if (val.startsWith('/') || val.startsWith('http')) return val;
  return `/assets/team/${val}`;
};

export const useTeamMembers = (): UseTeamMembersReturn => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      if (!globalCache || Date.now() - globalCache.timestamp > CACHE_DURATION) {
        void loadTeamMembers(true);
      }
    };
    window.addEventListener('visibilitychange', handleFocus);
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('visibilitychange', handleFocus);
      window.removeEventListener('focus', handleFocus);
    };
    // eslint-disable-next-line
  }, []);

  const fetchTeamMembers = async (): Promise<TeamMember[]> => {
    const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
    const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    const SHEET_NAME = import.meta.env.VITE_TEAM_SHEET_NAME || 'Our Team';
    const RANGE = `${SHEET_NAME}!A2:E`;

    if (!SHEET_ID || !API_KEY) {
      throw new Error('Missing Google Sheets configuration. Please check your .env file.');
    }

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Failed to fetch team ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.values && data.values.length > 0) {
        return data.values.map((row: string[], index: number) => {
          const imgPath = row[2] || '';
          return {
            id: index + 1,
            name: row[0] || 'Unknown',
            role: row[1] || 'Team Member',
            photo: getImagePath(imgPath),
            email: row[3] || '',
          };
        });
      } else {
        return [];
      }
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const loadTeamMembers = async (revalidate = false) => {
    if (!revalidate && globalCache && Date.now() - globalCache.timestamp < CACHE_DURATION) {
      if (!isMountedRef.current) return;
      setTeamMembers(globalCache.data);
      setLoading(globalCache.loading);
      setError(globalCache.error);
      return;
    }
    if (fetchPromise) {
      try {
        const data = await fetchPromise;
        if (!isMountedRef.current) return;
        setTeamMembers(data);
        setLoading(false);
        setError(null);
      } catch (err) {
        if (!isMountedRef.current) return;
        setError(err instanceof Error ? err.message : 'Unknown error occurred while fetching team data');
        setLoading(false);
      }
      return;
    }
    try {
      setLoading(true);
      setError(null);
      fetchPromise = fetchTeamMembers();
      const data = await fetchPromise;
      globalCache = { data, timestamp: Date.now(), loading: false, error: null };
      if (!isMountedRef.current) return;
      setTeamMembers(data);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred while fetching team data';
      globalCache = { data: [], timestamp: Date.now(), loading: false, error: errorMessage };
      if (!isMountedRef.current) return;
      setError(errorMessage);
      setLoading(false);
    } finally {
      fetchPromise = null;
    }
  };

  useEffect(() => {
    if (globalCache && globalCache.data.length > 0) {
      setTeamMembers(globalCache.data);
      setLoading(globalCache.loading);
      setError(globalCache.error);
      if (Date.now() - globalCache.timestamp > CACHE_DURATION) loadTeamMembers(true);
    } else {
      loadTeamMembers();
    }
    // eslint-disable-next-line
  }, []);

  return { teamMembers, loading, error };
};

export const clearTeamMembersCache = () => {
  globalCache = null;
  fetchPromise = null;
};
