// src/hooks/useWebinars.ts
import { useState, useEffect, useRef } from 'react';
import type { Webinar, WebinarStatus } from '../../types/webinar';

const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const WEBINAR_SHEET_NAME = import.meta.env.VITE_WEBINAR_SHEET_NAME || 'Webinars';

// ✅ Singleton cache to prevent multiple API calls
interface WebinarsCacheEntry {
  data: Webinar[];
  timestamp: number;
  loading: boolean;
  error: string | null;
}

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
let webinarsCache: WebinarsCacheEntry | null = null;
let webinarsFetchPromise: Promise<Webinar[]> | null = null;

export const useWebinars = () => {
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchWebinars = async (): Promise<Webinar[]> => {
      // ✅ DETAILED ENVIRONMENT DEBUG
      console.log('🔍 ========================================');
      console.log('   WEBINARS CONFIGURATION CHECK');
      console.log('🔍 ========================================');
      console.log('MODE:', import.meta.env.MODE);
      console.log('DEV:', import.meta.env.DEV);
      console.log('PROD:', import.meta.env.PROD);
      console.log('---');
      console.log('VITE_GOOGLE_SHEET_ID:', SHEET_ID || '❌ MISSING');
      console.log('VITE_GOOGLE_API_KEY:', API_KEY ? `✅ Present (${API_KEY.substring(0, 10)}...${API_KEY.substring(API_KEY.length - 4)})` : '❌ MISSING');
      console.log('VITE_WEBINAR_SHEET_NAME:', WEBINAR_SHEET_NAME);
      console.log('🔍 ========================================\n');

      if (!SHEET_ID || !API_KEY) {
        const missingVars = [];
        if (!SHEET_ID) missingVars.push('VITE_GOOGLE_SHEET_ID');
        if (!API_KEY) missingVars.push('VITE_GOOGLE_API_KEY');
        
        const errorMsg = `❌ Missing environment variables for Webinars: ${missingVars.join(', ')}`;
        console.error(errorMsg);
        throw new Error(errorMsg);
      }

      const range = `${WEBINAR_SHEET_NAME}!A2:G`;
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=${API_KEY}`;

      console.log('🎓 Fetching webinars from:', `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?key=***`);

      const response = await fetch(url);
      console.log('📡 Webinars Response status:', response.status, response.statusText);

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }

        let errorData;
        try {
          errorData = await response.json();
          console.error('❌ Webinars API Error:', errorData);
        } catch {
          errorData = {};
        }

        if (response.status === 403) {
          throw new Error('Access denied to Webinars sheet. Check if: 1) Google Sheet is public, 2) API key is valid');
        } else if (response.status === 404) {
          throw new Error(`Webinars sheet not found. Check if sheet ID "${SHEET_ID}" and tab "${WEBINAR_SHEET_NAME}" are correct`);
        } else if (response.status === 400) {
          throw new Error('Invalid request. Check if API key and Sheet ID are correct');
        }

        throw new Error(errorData.error?.message || `Failed to fetch webinars: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📄 Webinars data received');
      console.log('- Rows:', data.values?.length || 0);
      console.log('- First row sample:', data.values?.[0]?.slice(0, 3));

      if (!data.values || data.values.length === 0) {
        console.log('⚠️ No webinar data found in sheet');
        return [];
      }

      const parsedWebinars: Webinar[] = data.values
        .map((row: string[], index: number) => {
          try {
            const [id, title, date, status, location, description, registrationLink] = row;

            // Skip rows with missing critical data
            if (!title) {
              console.warn(`⚠️ Skipping webinar row ${index + 2}: missing title`);
              return null;
            }

            return {
              id: parseInt(id, 10) || index + 1,
              title: title || 'Untitled Webinar',
              date: date || '',
              status: (status as WebinarStatus) || 'Coming Soon',
              location: location || 'Online',
              description: description || '',
              registrationLink: registrationLink?.trim() || ''
            };
          } catch (err) {
            console.error(`❌ Error parsing webinar row ${index + 2}:`, err);
            return null;
          }
        })
        .filter((webinar: Webinar | null): webinar is Webinar => webinar !== null);


      console.log(`📊 Parsed ${parsedWebinars.length} webinars`);

      // Filter out 'Not Fixed' webinars
      const filteredWebinars = parsedWebinars.filter(
        webinar => webinar.status !== 'Not Fixed'
      );

      console.log(`🔍 Filtered to ${filteredWebinars.length} webinars (removed 'Not Fixed')`);

      // Sort by status priority
      const sortedWebinars = filteredWebinars.sort((a, b) => {
        const statusPriority: Record<WebinarStatus, number> = {
          'Confirmed': 0,
          'Waiting': 1,
          'Coming Soon': 2,
          'Not Fixed': 3
        };

        const priorityA = statusPriority[a.status] ?? 3;
        const priorityB = statusPriority[b.status] ?? 3;

        if (priorityA !== priorityB) {
          return priorityA - priorityB;
        }

        // Sort confirmed events by date
        if (a.status === 'Confirmed' && b.status === 'Confirmed' && a.date && b.date) {
          return a.date.localeCompare(b.date);
        }

        return a.id - b.id;
      });

      console.log(`✅ Successfully sorted ${sortedWebinars.length} webinars`);
      if (sortedWebinars.length > 0) {
        console.log('Sample webinar:', {
          title: sortedWebinars[0].title,
          date: sortedWebinars[0].date,
          status: sortedWebinars[0].status,
          location: sortedWebinars[0].location
        });
      }

      return sortedWebinars;
    };

    const loadWebinars = async () => {
      // ✅ Check if cache is valid
      if (webinarsCache && Date.now() - webinarsCache.timestamp < CACHE_DURATION) {
        if (!isMountedRef.current) return;
        setWebinars(webinarsCache.data);
        setLoading(webinarsCache.loading);
        setError(webinarsCache.error);
        console.log('📦 Using cached webinars data');
        return;
      }

      // ✅ If already fetching, wait for that promise
      if (webinarsFetchPromise) {
        try {
          const data = await webinarsFetchPromise;
          if (!isMountedRef.current) return;
          setWebinars(data);
          setLoading(false);
          setError(null);
        } catch (err) {
          if (!isMountedRef.current) return;
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch webinars';
          setError(errorMessage);
          setLoading(false);
        }
        return;
      }

      // ✅ Start new fetch
      try {
        setLoading(true);
        setError(null);

        webinarsCache = {
          data: [],
          timestamp: Date.now(),
          loading: true,
          error: null
        };

        webinarsFetchPromise = fetchWebinars();
        const data = await webinarsFetchPromise;

        webinarsCache = {
          data,
          timestamp: Date.now(),
          loading: false,
          error: null
        };

        if (!isMountedRef.current) return;
        setWebinars(data);
        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'An unknown error occurred while loading webinars.';
        console.error('❌ Error fetching webinars from Google Sheets:', errorMessage);

        webinarsCache = {
          data: [],
          timestamp: Date.now(),
          loading: false,
          error: errorMessage
        };

        if (!isMountedRef.current) return;
        setError(errorMessage);
        setLoading(false);
      } finally {
        webinarsFetchPromise = null;
      }
    };

    loadWebinars();
  }, []);

  return { webinars, loading, error };
};

/**
 * Utility to manually clear webinars cache
 */
export const clearWebinarsCache = () => {
  webinarsCache = null;
  webinarsFetchPromise = null;
  console.log('🗑️ Webinars cache cleared');
};
