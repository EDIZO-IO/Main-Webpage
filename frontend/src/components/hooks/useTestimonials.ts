import { useState, useEffect, useRef } from 'react';

export interface Testimonial {
    _id: string;
    name: string;
    role: string;
    company: string;
    image: string;
    rating: number;
    review: string;
    service: string;
    isFeatured?: boolean;
}

// Global cache to prevent refetching on navigation
let globalCache: {
    data: Testimonial[];
    timestamp: number;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useTestimonials = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(globalCache?.data || []);
    const [loading, setLoading] = useState(!globalCache);
    const [error, setError] = useState<string | null>(null);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

        const fetchTestimonials = async () => {
            // Use cache if valid
            if (globalCache && Date.now() - globalCache.timestamp < CACHE_DURATION) {
                setTestimonials(globalCache.data);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/testimonials?limit=20&featured=true`);
                if (!response.ok) throw new Error('Failed to fetch testimonials');

                const data = await response.json();
                if (data.success) {
                    globalCache = {
                        data: data.data,
                        timestamp: Date.now()
                    };
                    if (isMounted.current) {
                        setTestimonials(data.data);
                    }
                } else {
                    throw new Error(data.message || 'Failed to load testimonials');
                }
            } catch (err) {
                if (isMounted.current) {
                    setError(err instanceof Error ? err.message : 'Unknown error');
                }
            } finally {
                if (isMounted.current) {
                    setLoading(false);
                }
            }
        };

        fetchTestimonials();

        return () => {
            isMounted.current = false;
        };
    }, []);

    return { testimonials, loading, error };
};
