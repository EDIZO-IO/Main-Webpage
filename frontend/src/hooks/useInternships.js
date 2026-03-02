import { useState, useEffect } from 'react';
import { internshipsAPI } from '../api/api';

// Cache for performance
const CACHE_KEY = 'edizo_internships_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

let globalCache = null;
let fetchPromise = null;

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

export const useInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInternships = async () => {
      // Return cached data immediately if available
      if (globalCache && globalCache.data.length > 0) {
        setInternships(globalCache.data);
        setLoading(false);
        setError(globalCache.error);
        
        // Background refresh if cache expired
        if (Date.now() - globalCache.timestamp > CACHE_DURATION) {
          refreshInternships();
        }
        return;
      }

      // Fetch from API
      try {
        setLoading(true);
        fetchPromise = internshipsAPI.getAll();
        const response = await fetchPromise;
        
        globalCache = {
          data: response.data.internships || [],
          timestamp: Date.now(),
          error: null
        };
        
        localStorage.setItem(CACHE_KEY, JSON.stringify(globalCache));
        
        setInternships(globalCache.data);
        setLoading(false);
      } catch (err) {
        const errorMsg = err.response?.data?.error || 'Failed to fetch internships';
        globalCache = {
          data: [],
          timestamp: Date.now(),
          error: errorMsg
        };
        setError(errorMsg);
        setLoading(false);
      } finally {
        fetchPromise = null;
      }
    };

    loadInternships();
  }, []);

  const refreshInternships = async () => {
    try {
      const response = await internshipsAPI.getAll();
      globalCache = {
        data: response.data.internships || [],
        timestamp: Date.now(),
        error: null
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(globalCache));
      setInternships(globalCache.data);
    } catch (err) {
      console.error('Failed to refresh internships:', err);
    }
  };

  return { internships, loading, error, refreshInternships };
};

export const useInternship = (id) => {
  const { internships, loading, error } = useInternships();
  const [internship, setInternship] = useState(null);
  const [loadingSingle, setLoadingSingle] = useState(true);

  useEffect(() => {
    if (loading) {
      setLoadingSingle(true);
      return;
    }
    
    if (error) {
      setLoadingSingle(false);
      return;
    }

    const found = internships.find((i) => i.id === id || i.internship_id === id);
    setInternship(found || null);
    setLoadingSingle(false);
  }, [id, internships, loading, error]);

  return { internship, loading: loadingSingle, error };
};

export const useFilteredInternships = (category = 'All', searchTerm = '', minRating = 0) => {
  const { internships, loading, error } = useInternships();
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    if (!loading && internships.length > 0) {
      let filteredData = [...internships];
      
      if (category !== 'All') {
        filteredData = filteredData.filter((i) => i.category === category);
      }
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        filteredData = filteredData.filter(
          (i) =>
            i.title.toLowerCase().includes(term) ||
            i.description.toLowerCase().includes(term) ||
            i.category.toLowerCase().includes(term) ||
            i.company.toLowerCase().includes(term)
        );
      }
      
      if (minRating > 0) {
        filteredData = filteredData.filter((i) => i.rating >= minRating);
      }
      
      setFiltered(filteredData);
    } else {
      setFiltered([]);
    }
  }, [internships, loading, category, searchTerm, minRating]);

  return { internships: filtered, loading, error };
};

export const useTrendingInternships = (minRating = 4.5, limit) => {
  const { internships, loading, error } = useInternships();
  const [trending, setTrending] = useState([]);

  useEffect(() => {
    if (!loading && internships.length > 0) {
      let trendingData = internships
        .filter((i) => i.rating >= minRating)
        .sort((a, b) => b.rating - a.rating);
      
      if (limit && limit > 0) {
        trendingData = trendingData.slice(0, limit);
      }
      
      setTrending(trendingData);
    } else {
      setTrending([]);
    }
  }, [internships, loading, minRating, limit]);

  return { internships: trending, loading, error };
};

export const useCategories = () => {
  const { internships, loading, error } = useInternships();
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    if (!loading && internships.length > 0) {
      const uniqueCategories = Array.from(
        new Set(internships.map((i) => i.category))
      ).sort();
      setCategories(['All', ...uniqueCategories]);
    }
  }, [internships, loading]);

  return { categories, loading, error };
};

// Clear cache
export const clearInternshipsCache = () => {
  globalCache = null;
  fetchPromise = null;
  localStorage.removeItem(CACHE_KEY);
};

// Force refresh
export const forceRefreshInternships = async () => {
  clearInternshipsCache();
  try {
    const response = await internshipsAPI.getAll();
    globalCache = {
      data: response.data.internships || [],
      timestamp: Date.now(),
      error: null
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(globalCache));
    return globalCache.data;
  } catch (error) {
    console.error('Failed to refresh internships:', error);
    throw error;
  }
};
