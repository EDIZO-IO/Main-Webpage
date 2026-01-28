import { useState, useEffect, useRef } from 'react';

// --- Config ---
const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const WEBINAR_SHEET_NAME = import.meta.env.VITE_WEBINAR_SHEET_NAME || 'Webinars';

// --- Global singleton cache

const CACHE_DURATION = 10 * 60 * 1000; // 10 min
let webinarsCache = null;
let webinarsFetchPromise = null;

export const useWebinars = () => {
  const [webinars, setWebinars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // --- Tab focus/visibility: revalidate if stale
  useEffect(() => {
    const handleFocus = () => {
      if (!webinarsCache || Date.now() - webinarsCache.timestamp > CACHE_DURATION) {
        void loadWebinars(true);
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

  // --- Main fetch, with timeout
  const fetchWebinars = async () => {
    if (!SHEET_ID || !API_KEY) {
      const missingVars = [];
      if (!SHEET_ID) missingVars.push('VITE_GOOGLE_SHEET_ID');
      if (!API_KEY) missingVars.push('VITE_GOOGLE_API_KEY');
      throw new Error(`❌ Missing environment variables for Webinars: ${missingVars.join(', ')}`);
    }
    const range = `${WEBINAR_SHEET_NAME}!A2:G`;
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!response.ok) {
        if (response.status === 429) throw new Error('Rate limit exceeded. Please try again later.');
        let errorData; try { errorData = await response.json(); } catch { errorData = {}; }
        if (response.status === 403) throw new Error('Access denied to Webinars sheet. Check share/API config.');
        if (response.status === 404) throw new Error(`Webinars sheet not found. Check tab "${WEBINAR_SHEET_NAME}"`);
        throw new Error(errorData.error?.message || `Failed to fetch webinars: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (!data.values || data.values.length === 0) return [];
      const parsedWebinars = data.values.map((row, index) => {
        const [id, title, date, status, location, description, registrationLink] = row;
        if (!title) return null;
        return {
          id: parseInt(id, 10) || index + 1,
          title: title || 'Untitled Webinar',
          date: date || '',
          status: status || 'Coming Soon',
          location: location || 'Online',
          description: description || '',
          registrationLink: registrationLink?.trim() || ''
        };
      }).filter(Boolean);

      // Remove "Not Fixed"
      const filteredWebinars = parsedWebinars.filter(w => w.status !== 'Not Fixed');
      // Sort priority
      const statusPriority = {
        'Confirmed': 0, 'Waiting': 1, 'Coming Soon': 2, 'Not Fixed': 3
      };
      filteredWebinars.sort((a, b) => {
        const pa = statusPriority[a.status] ?? 3;
        const pb = statusPriority[b.status] ?? 3;
        if (pa !== pb) return pa - pb;
        if (a.status === 'Confirmed' && b.status === 'Confirmed' && a.date && b.date) {
          return a.date.localeCompare(b.date);
        }
        return a.id - b.id;
      });
      return filteredWebinars;
    } finally { clearTimeout(timeoutId); }
  };

  // --- Main loader (uses cache instantly)
  const loadWebinars = async (revalidate = false) => {
    if (!revalidate && webinarsCache && Date.now() - webinarsCache.timestamp < CACHE_DURATION) {
      if (!isMountedRef.current) return;
      setWebinars(webinarsCache.data);
      setLoading(false);
      setError(webinarsCache.error);
      return;
    }
    if (webinarsFetchPromise) {
      try {
        const data = await webinarsFetchPromise;
        if (!isMountedRef.current) return;
        setWebinars(data);
        setLoading(false);
        setError(null);
      } catch (err) {
        if (!isMountedRef.current) return;
        setError(err instanceof Error ? err.message : 'Failed to fetch webinars');
        setLoading(false);
      }
      return;
    }
    try {
      setLoading(true);
      setError(null);
      webinarsFetchPromise = fetchWebinars();
      const data = await webinarsFetchPromise;
      webinarsCache = { data, timestamp: Date.now(), loading, error };
      if (!isMountedRef.current) return;
      setWebinars(data);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred while loading webinars.';
      webinarsCache = { data, timestamp: Date.now(), loading, error };
      if (!isMountedRef.current) return;
      setError(errorMessage);
      setLoading(false);
    } finally {
      webinarsFetchPromise = null;
    }
  };

  // --- Instantly use cache if available, else fetch
  useEffect(() => {
    if (webinarsCache && webinarsCache.data.length > 0) {
      setWebinars(webinarsCache.data);
      setLoading(webinarsCache.loading);
      setError(webinarsCache.error);
      if (Date.now() - webinarsCache.timestamp > CACHE_DURATION) loadWebinars(true);
    } else {
      loadWebinars();
    }
    // eslint-disable-next-line
  }, []);

  return { webinars, loading, error };
};

// --- Manual cache clear
export const clearWebinarsCache = () => {
  webinarsCache = null;
  webinarsFetchPromise = null;
  console.log('🗑️ Webinars cache cleared');
};
