// frontend/src/hooks/useInternships.ts

import { useState, useEffect, useRef } from 'react';
import type { InternshipData } from '../../types/internship.types';
import { parseInternshipsFromSheets } from '../../utils/internship.utils';

// ✅ Singleton cache to prevent multiple API calls
interface CacheEntry {
  data: InternshipData[];
  timestamp: number;
  loading: boolean;
  error: string | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let globalCache: CacheEntry | null = null;
let fetchPromise: Promise<InternshipData[]> | null = null;

/**
 * Custom hook for fetching internships from Google Sheets
 */
export const useInternships = () => {
  const [internships, setInternships] = useState<InternshipData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchInternships = async (): Promise<InternshipData[]> => {
      const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
      const SHEET_NAME = import.meta.env.VITE_INTERNSHIPS_SHEET_NAME || 'Internships';
      const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

      if (!SHEET_ID || !API_KEY) {
        throw new Error('Missing Google Sheets configuration. Check your .env file.');
      }

      console.log('📊 Fetching internships from Google Sheets...');
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
      
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('📄 Raw sheet data received, rows:', data.values?.length || 0);

      if (!data.values || data.values.length <= 1) {
        throw new Error('No internship data found in the sheet.');
      }

      const parsedInternships = parseInternshipsFromSheets(data);
      console.log(`✅ Successfully parsed ${parsedInternships.length} internships`);

      return parsedInternships;
    };

    const loadInternships = async () => {
      // ✅ Check if cache is valid
      if (globalCache && Date.now() - globalCache.timestamp < CACHE_DURATION) {
        if (!isMountedRef.current) return;
        setInternships(globalCache.data);
        setLoading(globalCache.loading);
        setError(globalCache.error);
        console.log('📦 Using cached internships data');
        return;
      }

      // ✅ If already fetching, wait for that promise
      if (fetchPromise) {
        try {
          const data = await fetchPromise;
          if (!isMountedRef.current) return;
          setInternships(data);
          setLoading(false);
          setError(null);
        } catch (err) {
          if (!isMountedRef.current) return;
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch internships';
          setError(errorMessage);
          setLoading(false);
        }
        return;
      }

      // ✅ Start new fetch
      try {
        setLoading(true);
        setError(null);
        
        globalCache = {
          data: [],
          timestamp: Date.now(),
          loading: true,
          error: null
        };

        fetchPromise = fetchInternships();
        const data = await fetchPromise;
        
        globalCache = {
          data,
          timestamp: Date.now(),
          loading: false,
          error: null
        };

        if (!isMountedRef.current) return;
        setInternships(data);
        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch internships';
        console.error('❌ Error fetching internships:', errorMessage);
        
        globalCache = {
          data: [],
          timestamp: Date.now(),
          loading: false,
          error: errorMessage
        };

        if (!isMountedRef.current) return;
        setError(errorMessage);
        setLoading(false);
      } finally {
        fetchPromise = null;
      }
    };

    loadInternships();
  }, []);

  return { internships, loading, error };
};

/**
 * Custom hook for fetching a single internship by ID
 */
export const useInternship = (id: string | undefined) => {
  const { internships, loading: loadingAll, error: errorAll } = useInternships();
  const [internship, setInternship] = useState<InternshipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loadingAll) {
      setLoading(true);
      return;
    }

    if (errorAll) {
      setError(errorAll);
      setLoading(false);
      return;
    }

    if (!id) {
      setError('Internship ID not provided');
      setLoading(false);
      return;
    }

    // Find internship from cached data
    const found = internships.find((i) => i.id === id);

    if (found) {
      console.log('✅ Found internship:', found.title);
      setInternship(found);
      setError(null);
    } else {
      console.warn(`⚠️ Internship with ID "${id}" not found`);
      setError(`Internship with ID "${id}" not found`);
      setInternship(null);
    }

    setLoading(false);
  }, [id, internships, loadingAll, errorAll]);

  return { internship, loading, error };
};

/**
 * Custom hook for fetching internships with filters
 */
export const useFilteredInternships = (
  category: string = 'All',
  searchTerm: string = '',
  minRating: number = 0
) => {
  const { internships, loading, error } = useInternships();
  const [filteredInternships, setFilteredInternships] = useState<InternshipData[]>([]);

  useEffect(() => {
    if (!loading && internships.length > 0) {
      let filtered = [...internships];

      // Filter by category
      if (category !== 'All') {
        filtered = filtered.filter((i) => i.category === category);
      }

      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        filtered = filtered.filter(
          (i) =>
            i.title.toLowerCase().includes(term) ||
            i.description.toLowerCase().includes(term) ||
            i.category.toLowerCase().includes(term) ||
            i.company.toLowerCase().includes(term)
        );
      }

      // Filter by minimum rating
      if (minRating > 0) {
        filtered = filtered.filter((i) => i.rating >= minRating);
      }

      setFilteredInternships(filtered);
      console.log(`🔍 Filtered ${filtered.length} internships (category: ${category}, search: "${searchTerm}", minRating: ${minRating})`);
    } else {
      setFilteredInternships([]);
    }
  }, [internships, loading, category, searchTerm, minRating]);

  return { internships: filteredInternships, loading, error };
};

/**
 * Custom hook for getting trending internships
 */
export const useTrendingInternships = (minRating: number = 4.5, limit?: number) => {
  const { internships, loading, error } = useInternships();
  const [trendingInternships, setTrendingInternships] = useState<InternshipData[]>([]);

  useEffect(() => {
    if (!loading && internships.length > 0) {
      let trending = internships
        .filter((i) => i.rating >= minRating)
        .sort((a, b) => b.rating - a.rating); // Sort by rating descending

      if (limit && limit > 0) {
        trending = trending.slice(0, limit);
      }

      setTrendingInternships(trending);
      console.log(`⭐ Found ${trending.length} trending internships (minRating: ${minRating})`);
    } else {
      setTrendingInternships([]);
    }
  }, [internships, loading, minRating, limit]);

  return { internships: trendingInternships, loading, error };
};

/**
 * Custom hook for getting unique categories
 */
export const useCategories = () => {
  const { internships, loading, error } = useInternships();
  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    if (!loading && internships.length > 0) {
      const uniqueCategories = Array.from(new Set(internships.map((i) => i.category))).sort();
      setCategories(['All', ...uniqueCategories]);
      console.log(`📂 Found ${uniqueCategories.length} categories`);
    }
  }, [internships, loading]);

  return { categories, loading, error };
};

/**
 * Utility to manually clear cache
 */
export const clearInternshipsCache = () => {
  globalCache = null;
  fetchPromise = null;
  console.log('🗑️ Internships cache cleared');
};
