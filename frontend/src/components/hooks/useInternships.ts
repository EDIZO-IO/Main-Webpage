import { useState, useEffect, useRef } from 'react';
import type { InternshipData } from '../../types/internship.types';
import { parseInternshipsFromSheets } from '../../utils/internship.utils';

// --- Singleton cache
interface CacheEntry {
  data: InternshipData[];
  timestamp: number;
  loading: boolean;
  error: string | null;
}
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let globalCache: CacheEntry | null = null;
let fetchPromise: Promise<InternshipData[]> | null = null;

// --- Main fetcher with timeout protection
const fetchInternshipsAPI = async (): Promise<InternshipData[]> => {
  const SHEET_ID = import.meta.env.VITE_GOOGLE_SHEET_ID;
  const SHEET_NAME = import.meta.env.VITE_INTERNSHIPS_SHEET_NAME || 'Internships';
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
      throw new Error('No internship data found in the sheet. Please add data to the "Internships" tab.');
    }
    return parseInternshipsFromSheets(data);
  } finally {
    clearTimeout(timeoutId);
  }
};

// --- Enhanced data hook with instant cache fallback, tab visibility, etc.
export const useInternships = () => {
  const [internships, setInternships] = useState<InternshipData[]>([]);
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
        void loadInternships(true);
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

  const loadInternships = async (revalidate: boolean = false) => {
    if (!revalidate && globalCache && Date.now() - globalCache.timestamp < CACHE_DURATION) {
      if (!isMountedRef.current) return;
      setInternships(globalCache.data);
      setLoading(false);
      setError(globalCache.error);
      return;
    }
    if (fetchPromise) {
      try {
        const data = await fetchPromise;
        if (!isMountedRef.current) return;
        setInternships(data);
        setLoading(false);
        setError(null);
      } catch (err) {
        if (!isMountedRef.current) return;
        setLoading(false);
        setError(err instanceof Error ? err.message : 'Failed to fetch internships');
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);
      fetchPromise = fetchInternshipsAPI();
      const data = await fetchPromise;
      globalCache = { data, timestamp: Date.now(), loading: false, error: null };
      if (!isMountedRef.current) return;
      setInternships(data);
      setLoading(false);
    } catch (err) {
      globalCache = {
        data: [],
        timestamp: Date.now(),
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch internships'
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
      setInternships(globalCache.data);
      setLoading(globalCache.loading);
      setError(globalCache.error);
      // background refresh if cache expired
      if (Date.now() - globalCache.timestamp > CACHE_DURATION) loadInternships(true);
    } else {
      loadInternships();
    }
    // eslint-disable-next-line
  }, []);

  return { internships, loading, error };
};

// === Internship by id hook (unchanged, uses global cache immediately) ===
export const useInternship = (id: string | undefined) => {
  const { internships, loading: loadingAll, error: errorAll } = useInternships();
  const [internship, setInternship] = useState<InternshipData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loadingAll) { setLoading(true); return; }
    if (errorAll) { setError(errorAll); setLoading(false); return; }
    if (!id) { setError('Internship ID not provided'); setLoading(false); return; }

    const found = internships.find((i) => i.id === id);
    if (found) { setInternship(found); setError(null); }
    else { setError(`Internship with ID "${id}" not found`); setInternship(null); }
    setLoading(false);
  }, [id, internships, loadingAll, errorAll]);

  return { internship, loading, error };
};

// === Filtered Internships (unchanged except reliable source) ===
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
      if (category !== 'All') filtered = filtered.filter((i) => i.category === category);
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
      if (minRating > 0) filtered = filtered.filter((i) => i.rating >= minRating);
      setFilteredInternships(filtered);
    } else setFilteredInternships([]);
  }, [internships, loading, category, searchTerm, minRating]);

  return { internships: filteredInternships, loading, error };
};

// === Trending Internships (unchanged, robust with fast cache) ===
export const useTrendingInternships = (minRating: number = 4.5, limit?: number) => {
  const { internships, loading, error } = useInternships();
  const [trendingInternships, setTrendingInternships] = useState<InternshipData[]>([]);

  useEffect(() => {
    if (!loading && internships.length > 0) {
      let trending = internships.filter((i) => i.rating >= minRating)
        .sort((a, b) => b.rating - a.rating);
      if (limit && limit > 0) trending = trending.slice(0, limit);
      setTrendingInternships(trending);
    } else setTrendingInternships([]);
  }, [internships, loading, minRating, limit]);

  return { internships: trendingInternships, loading, error };
};

// === Unique Categories ===
export const useCategories = () => {
  const { internships, loading, error } = useInternships();
  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    if (!loading && internships.length > 0) {
      const uniqueCategories = Array.from(new Set(internships.map((i) => i.category))).sort();
      setCategories(['All', ...uniqueCategories]);
    }
  }, [internships, loading]);
  return { categories, loading, error };
};

// === Internships with coupon codes ===
export const useInternshipsWithCoupons = () => {
  const { internships, loading, error } = useInternships();
  const [internshipsWithCoupons, setInternshipsWithCoupons] = useState<InternshipData[]>([]);

  useEffect(() => {
    if (!loading && internships.length > 0) {
      // Filter internships that have available coupons
      const internshipsWithValidCoupons = internships.filter(
        i => i.availableCoupons && i.availableCoupons.some(coupon => coupon.isActive)
      );
      setInternshipsWithCoupons(internshipsWithValidCoupons);
    } else {
      setInternshipsWithCoupons([]);
    }
  }, [internships, loading]);

  return { internships: internshipsWithCoupons, loading, error };
};

// === Get coupon by code ===
export const useCouponByCode = (couponCode: string | undefined) => {
  const { internships, loading, error } = useInternships();
  const [coupon, setCoupon] = useState<{internshipId: string, coupon: any} | null>(null);

  useEffect(() => {
    if (!loading && internships.length > 0 && couponCode) {
      for (const internship of internships) {
        if (internship.availableCoupons) {
          const foundCoupon = internship.availableCoupons.find(
            c => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive
          );
          if (foundCoupon) {
            setCoupon({
              internshipId: internship.id,
              coupon: foundCoupon
            });
            break;
          }
        }
      }
    } else {
      setCoupon(null);
    }
  }, [internships, loading, couponCode]);

  return { coupon, loading, error };
};

// === Internships by coupon availability ===
export const useInternshipsByCouponAvailability = (hasCoupon: boolean = true) => {
  const { internships, loading, error } = useInternships();
  const [filteredInternships, setFilteredInternships] = useState<InternshipData[]>([]);

  useEffect(() => {
    if (!loading && internships.length > 0) {
      if (hasCoupon) {
        // Filter internships that have at least one active coupon
        const internshipsWithCoupons = internships.filter(
          i => i.availableCoupons && i.availableCoupons.some(coupon => coupon.isActive)
        );
        setFilteredInternships(internshipsWithCoupons);
      } else {
        // Filter internships that don't have any active coupons
        const internshipsWithoutCoupons = internships.filter(
          i => !i.availableCoupons || !i.availableCoupons.some(coupon => coupon.isActive)
        );
        setFilteredInternships(internshipsWithoutCoupons);
      }
    } else {
      setFilteredInternships([]);
    }
  }, [internships, loading, hasCoupon]);

  return { internships: filteredInternships, loading, error };
};

// === Internships with specific coupon type ===
export const useInternshipsByCouponType = (couponType: 'percentage' | 'fixed' | 'all' = 'all') => {
  const { internships, loading, error } = useInternships();
  const [filteredInternships, setFilteredInternships] = useState<InternshipData[]>([]);

  useEffect(() => {
    if (!loading && internships.length > 0) {
      if (couponType === 'all') {
        // Return internships with any type of active coupon
        const internshipsWithAnyCoupon = internships.filter(
          i => i.availableCoupons && i.availableCoupons.some(coupon => coupon.isActive)
        );
        setFilteredInternships(internshipsWithAnyCoupon);
      } else {
        // Filter internships with specific coupon type
        const internshipsWithSpecificCoupon = internships.filter(
          i => i.availableCoupons && i.availableCoupons.some(
            coupon => coupon.isActive && coupon.discountType === couponType
          )
        );
        setFilteredInternships(internshipsWithSpecificCoupon);
      }
    } else {
      setFilteredInternships([]);
    }
  }, [internships, loading, couponType]);

  return { internships: filteredInternships, loading, error };
};

// === Internships with specific coupon code ===
export const useInternshipsByCouponCode = (couponCode: string | undefined) => {
  const { internships, loading, error } = useInternships();
  const [filteredInternships, setFilteredInternships] = useState<InternshipData[]>([]);

  useEffect(() => {
    if (!loading && internships.length > 0 && couponCode) {
      const internshipsWithSpecificCoupon = internships.filter(
        i => i.availableCoupons && 
        i.availableCoupons.some(
          coupon => coupon.code.toUpperCase() === couponCode.toUpperCase() && coupon.isActive
        )
      );
      setFilteredInternships(internshipsWithSpecificCoupon);
    } else {
      setFilteredInternships([]);
    }
  }, [internships, loading, couponCode]);

  return { internships: filteredInternships, loading, error };
};

// === Internships with highest coupon discount ===
export const useInternshipsWithHighestCouponDiscount = () => {
  const { internships, loading, error } = useInternships();
  const [filteredInternships, setFilteredInternships] = useState<InternshipData[]>([]);

  useEffect(() => {
    if (!loading && internships.length > 0) {
      const internshipsWithCoupons = internships.filter(
        i => i.availableCoupons && i.availableCoupons.some(coupon => coupon.isActive)
      );
      
      // Sort by highest coupon discount
      const sortedInternships = [...internshipsWithCoupons].sort((a, b) => {
        const maxDiscountA = a.availableCoupons?.reduce((max, coupon) => 
          coupon.isActive && coupon.discountValue > max ? coupon.discountValue : max, 0) || 0;
        const maxDiscountB = b.availableCoupons?.reduce((max, coupon) => 
          coupon.isActive && coupon.discountValue > max ? coupon.discountValue : max, 0) || 0;
        return maxDiscountB - maxDiscountA;
      });
      
      setFilteredInternships(sortedInternships);
    } else {
      setFilteredInternships([]);
    }
  }, [internships, loading]);

  return { internships: filteredInternships, loading, error };
};

// === Internships with specific discount percentage from Google Sheets ===
export const useInternshipsByDiscountPercentage = (discountPercentage: number) => {
  const { internships, loading, error } = useInternships();
  const [filteredInternships, setFilteredInternships] = useState<InternshipData[]>([]);

  useEffect(() => {
    if (!loading && internships.length > 0) {
      // Filter internships that have at least one coupon with the specified discount percentage
      const internshipsWithSpecificDiscount = internships.filter(
        i => i.availableCoupons && 
        i.availableCoupons.some(
          coupon => coupon.discountValue === discountPercentage && coupon.isActive
        )
      );
      setFilteredInternships(internshipsWithSpecificDiscount);
    } else {
      setFilteredInternships([]);
    }
  }, [internships, loading, discountPercentage]);

  return { internships: filteredInternships, loading, error };
};

// === Internships with discount percentage range from Google Sheets ===
export const useInternshipsByDiscountRange = (minDiscount: number, maxDiscount: number) => {
  const { internships, loading, error } = useInternships();
  const [filteredInternships, setFilteredInternships] = useState<InternshipData[]>([]);

  useEffect(() => {
    if (!loading && internships.length > 0) {
      // Filter internships that have at least one coupon within the discount range
      const internshipsInRange = internships.filter(
        i => i.availableCoupons && 
        i.availableCoupons.some(
          coupon => coupon.discountValue >= minDiscount && 
                   coupon.discountValue <= maxDiscount && 
                   coupon.isActive
        )
      );
      setFilteredInternships(internshipsInRange);
    } else {
      setFilteredInternships([]);
    }
  }, [internships, loading, minDiscount, maxDiscount]);

  return { internships: filteredInternships, loading, error };
};

// === Internships with highest overall discount (base + coupon) ===
export const useInternshipsWithHighestOverallDiscount = () => {
  const { internships, loading, error } = useInternships();
  const [filteredInternships, setFilteredInternships] = useState<InternshipData[]>([]);

  useEffect(() => {
    if (!loading && internships.length > 0) {
      // Calculate total discount for each internship (base discount + highest coupon discount)
      const internshipsWithTotalDiscount = internships.map(i => {
        const baseDiscount = Math.max(
          i.discount?.['15-days'] || 0,
          i.discount?.['1-month'] || 0,
          i.discount?.['2-months'] || 0,
          i.discount?.['3-months'] || 0
        );
        
        const couponDiscount = i.availableCoupons?.reduce((max, coupon) => 
          coupon.isActive && coupon.discountValue > max ? coupon.discountValue : max, 0) || 0;
        
        return {
          ...i,
          totalDiscount: baseDiscount + couponDiscount
        };
      });
      
      // Sort by total discount (base + coupon)
      const sortedInternships = internshipsWithTotalDiscount.sort((a, b) => 
        b.totalDiscount - a.totalDiscount
      );
      
      setFilteredInternships(sortedInternships);
    } else {
      setFilteredInternships([]);
    }
  }, [internships, loading]);

  return { internships: filteredInternships, loading, error };
};

// === Manual cache clear ===
export const clearInternshipsCache = () => {
  globalCache = null;
  fetchPromise = null;
  console.log('🗑️ Internships cache cleared');
};