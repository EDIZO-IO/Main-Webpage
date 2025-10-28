import { useState, useEffect, useRef } from 'react';
import type { TeamMember, UseTeamMembersReturn } from '../../types/team.types';

// --- Singleton cache
interface CacheEntry {
  data: TeamMember[];
  timestamp: number;
  loading: boolean;
  error: string | null;
}
const CACHE_DURATION = 5 * 60 * 1000; // 5 min
let globalCache: CacheEntry | null = null;
let fetchPromise: Promise<TeamMember[]> | null = null;

export const useTeamMembers = (): UseTeamMembersReturn => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  // --- Clean up on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // --- Revalidate on tab focus/visibility
  useEffect(() => {
    const handleFocus = () => {
      if (!globalCache || Date.now() - globalCache.timestamp > CACHE_DURATION) {
        void loadTeamMembers(true);
      }
    };
    window.addEventListener("visibilitychange", handleFocus);
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("visibilitychange", handleFocus);
      window.removeEventListener("focus", handleFocus);
    };
    // eslint-disable-next-line
  }, []);

  // --- API fetch with timeout
  const fetchTeamMembers = async (): Promise<TeamMember[]> => {
    const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
    const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
    const SHEET_NAME = import.meta.env.VITE_TEAM_SHEET_NAME || 'Our Team';
    const RANGE = `${SHEET_NAME}!A2:D`;

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
        if (response.status === 429) throw new Error('Rate limit exceeded. Please try again later.');
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Failed to fetch team data: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.values && data.values.length > 0) {
        // A, B, C, D
        return data.values.map((row: string[], index: number) => ({
          id: index + 1,
          name: row[0] || 'Unknown',
          role: row[1] || 'Team Member',
          photo: row[2] || 'https://via.placeholder.com/150?text=No+Photo',
          email: row[3] || '',
        }));
      } else {
        return [];
      }
    } finally {
      clearTimeout(timeoutId);
    }
  };

  // --- Main loader (instant cache fallback)
  const loadTeamMembers = async (revalidate: boolean = false) => {
    if (!revalidate && globalCache && Date.now() - globalCache.timestamp < CACHE_DURATION) {
      if (!isMountedRef.current) return;
      setTeamMembers(globalCache.data);
      setLoading(false);
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

  // --- Use cache instantly if available
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

// --- Manual cache clear
export const clearTeamMembersCache = () => {
  globalCache = null;
  fetchPromise = null;
};
