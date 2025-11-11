import { useState, useEffect, useRef } from 'react';
import type { BlogData } from '../../types/blog.types';
import { parseBlogsFromSheets } from '../../utils/blog.utils';

// --- Singleton cache
interface CacheEntry {
  data: BlogData[];
  timestamp: number;
  loading: boolean;
  error: string | null;
}
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let globalCache: CacheEntry | null = null;
let fetchPromise: Promise<BlogData[]> | null = null;

// --- Main fetcher with timeout protection
const fetchBlogsAPI = async (): Promise<BlogData[]> => {
  const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
  const SHEET_NAME = import.meta.env.VITE_BLOGS_SHEET_NAME || 'Blogs';
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

  if (!SHEET_ID || !API_KEY) {
    const missingVars = [];
    if (!SHEET_ID) missingVars.push('VITE_GOOGLE_SHEET_ID');
    if (!API_KEY) missingVars.push('VITE_GOOGLE_API_KEY');
    throw new Error(`❌ Missing environment variables: ${missingVars.join(', ')}`);
  }
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;

  // --- Add abort timeout (helps fix infinite loading on Google API hangs)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData;
      try { errorData = await response.json(); } catch { errorData = {}; }
      const msg = errorData.error?.message || `API error: ${response.status} ${response.statusText}`;
      throw new Error(msg);
    }
    const data = await response.json();

    if (!data.values || data.values.length <= 1) {
      throw new Error('No blog data found in the sheet. Please add data to the "Blogs" tab.');
    }
    return parseBlogsFromSheets(data);
  } finally {
    clearTimeout(timeoutId);
  }
};

// --- Enhanced data hook with instant cache fallback, tab visibility, etc.
export const useBlogs = () => {
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMountedRef = useRef(true);

  // --- Clean up on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  // --- Tab visibility/background revalidation
  useEffect(() => {
    const handleFocus = () => {
      if (!globalCache || Date.now() - globalCache.timestamp > CACHE_DURATION) {
        void loadBlogs(true);
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

  const loadBlogs = async (revalidate: boolean = false) => {
    if (!revalidate && globalCache && Date.now() - globalCache.timestamp < CACHE_DURATION) {
      if (!isMountedRef.current) return;
      setBlogs(globalCache.data);
      setLoading(globalCache.loading);
      setError(globalCache.error);
      return;
    }
    if (fetchPromise) {
      try {
        const data = await fetchPromise;
        if (!isMountedRef.current) return;
        setBlogs(data);
        setLoading(false);
        setError(null);
      } catch (err) {
        if (!isMountedRef.current) return;
        setLoading(false);
        setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);
      fetchPromise = fetchBlogsAPI();
      const data = await fetchPromise;
      globalCache = { data, timestamp: Date.now(), loading: false, error: null };
      if (!isMountedRef.current) return;
      setBlogs(data);
      setLoading(false);
    } catch (err) {
      globalCache = {
        data: [],
        timestamp: Date.now(),
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch blogs'
      };
      if (!isMountedRef.current) return;
      setError(globalCache.error);
      setLoading(false);
    } finally {
      fetchPromise = null;
    }
  };

  // --- Use cached data immediately if available
  useEffect(() => {
    if (globalCache && globalCache.data.length > 0) {
      setBlogs(globalCache.data);
      setLoading(globalCache.loading);
      setError(globalCache.error);
      // background refresh if cache expired
      if (Date.now() - globalCache.timestamp > CACHE_DURATION) loadBlogs(true);
    } else {
      loadBlogs();
    }
    // eslint-disable-next-line
  }, []);

  return { blogs, loading, error };
};


// === Blog by id hook (unchanged, uses global cache immediately) ===
export const useBlog = (id: string | undefined) => {
  const { blogs, loading: loadingAll, error: errorAll } = useBlogs();
  const [blog, setBlog] = useState<BlogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loadingAll) { setLoading(true); return; }
    if (errorAll) { setError(errorAll); setLoading(false); return; }
    if (!id) { setError('Blog ID not provided'); setLoading(false); return; }

    const found = blogs.find((b) => b.id === id);
    if (found) { setBlog(found); setError(null); }
    else { setError(`Blog with ID "${id}" not found`); setBlog(null); }
    setLoading(false);
  }, [id, blogs, loadingAll, errorAll]);

  return { blog, loading, error };
};

// === Filtered Blogs (unchanged except reliable source) ===
export const useFilteredBlogs = (
  category: string = 'All',
  searchTerm: string = '',
  minRating: number = 0
) => {
  const { blogs, loading, error } = useBlogs();
  const [filteredBlogs, setFilteredBlogs] = useState<BlogData[]>([]);

  useEffect(() => {
    if (!loading && blogs.length > 0) {
      let filtered = [...blogs];
      if (category !== 'All') filtered = filtered.filter((b) => b.category === category);
      if (searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        filtered = filtered.filter(
          (b) =>
            b.title.toLowerCase().includes(term) ||
            b.description.toLowerCase().includes(term) ||
            b.category.toLowerCase().includes(term) ||
            b.author.toLowerCase().includes(term) ||
            b.content.toLowerCase().includes(term)
        );
      }
      if (minRating > 0) filtered = filtered.filter((b) => b.rating >= minRating);
      setFilteredBlogs(filtered);
    } else setFilteredBlogs([]);
  }, [blogs, loading, category, searchTerm, minRating]);

  return { blogs: filteredBlogs, loading, error };
};

// === Trending Blogs (unchanged, robust with fast cache) ===
export const useTrendingBlogs = (minRating: number = 4.5, limit?: number) => {
  const { blogs, loading, error } = useBlogs();
  const [trendingBlogs, setTrendingBlogs] = useState<BlogData[]>([]);

  useEffect(() => {
    if (!loading && blogs.length > 0) {
      let trending = blogs.filter((b) => b.rating >= minRating)
        .sort((a, b) => b.rating - a.rating);
      if (limit && limit > 0) trending = trending.slice(0, limit);
      setTrendingBlogs(trending);
    } else setTrendingBlogs([]);
  }, [blogs, loading, minRating, limit]);

  return { blogs: trendingBlogs, loading, error };
};

// === Recent Blogs ===
export const useRecentBlogs = (limit: number = 5) => {
  const { blogs, loading, error } = useBlogs();
  const [recentBlogs, setRecentBlogs] = useState<BlogData[]>([]);

  useEffect(() => {
    if (!loading && blogs.length > 0) {
      const sorted = [...blogs]
        .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
      const recent = limit ? sorted.slice(0, limit) : sorted;
      setRecentBlogs(recent);
    } else setRecentBlogs([]);
  }, [blogs, loading, limit]);

  return { blogs: recentBlogs, loading, error };
};

// === Unique Categories ===
export const useBlogCategories = () => {
  const { blogs, loading, error } = useBlogs();
  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    if (!loading && blogs.length > 0) {
      const uniqueCategories = Array.from(new Set(blogs.map((b) => b.category))).sort();
      setCategories(['All', ...uniqueCategories]);
    }
  }, [blogs, loading]);
  return { categories, loading, error };
};

// === Manual cache clear ===
export const clearBlogsCache = () => {
  globalCache = null;
  fetchPromise = null;
  console.log('🗑️ Blogs cache cleared');
};