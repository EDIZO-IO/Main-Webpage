import { useState, useEffect, useRef } from 'react';

export interface StatItem {
    key: string;
    value: string;
    label: string;
}

const DEFAULT_STATS: Record<string, StatItem> = {
    projects_delivered: { key: 'projects_delivered', value: '100+', label: 'Projects Done' },
    client_rating: { key: 'client_rating', value: '4.9/5', label: 'Client Rating' },
    on_time_delivery: { key: 'on_time_delivery', value: 'On Time', label: 'Delivery' },
    satisfaction_rate: { key: 'satisfaction_rate', value: '100%', label: 'Satisfaction' },
    happy_clients: { key: 'happy_clients', value: '10+', label: 'Happy Clients' },
    years_experience: { key: 'years_experience', value: '2+', label: 'Years Experience' },
    clients_count: { key: 'clients_count', value: '10+', label: 'Clients' },
    projects_count: { key: 'projects_count', value: '25+', label: 'Projects' },
    rating_score: { key: 'rating_score', value: '5.0', label: 'Rating' },
    students_trained: { key: 'students_trained', value: '200+', label: 'Students Trained' },
    programs_count: { key: 'programs_count', value: '15+', label: 'Programs' },
    certification_rate: { key: 'certification_rate', value: '100%', label: 'Certification' },
};

// Global cache to persist across re-renders and navigation
let globalStatsCache: {
    data: Record<string, StatItem>;
    timestamp: number;
} | null = null;

const CACHE_DURATION = 10 * 1000; // 10 seconds

export const useStats = () => {
    const [stats, setStats] = useState<Record<string, StatItem>>(globalStatsCache?.data || DEFAULT_STATS);
    const [loading, setLoading] = useState(!globalStatsCache);
    const [error, setError] = useState<string | null>(null);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;

        const fetchStats = async () => {
            // Check cache first
            if (globalStatsCache && Date.now() - globalStatsCache.timestamp < CACHE_DURATION) {
                setStats(globalStatsCache.data);
                setLoading(false);
                return;
            }

            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

            try {
                if (isMounted.current) setLoading(true);
                const response = await fetch(`${API_URL}/api/stats`);
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const result = await response.json();

                if (result.success && result.data) {
                    // Merge with defaults to ensure all keys exist
                    const newStats = { ...DEFAULT_STATS, ...result.data };

                    // Update global cache
                    globalStatsCache = {
                        data: newStats,
                        timestamp: Date.now()
                    };

                    if (isMounted.current) {
                        setStats(newStats);
                        setError(null);
                    }
                }
            } catch (err) {
                console.error('Error fetching stats:', err);
                if (isMounted.current) {
                    setError(err instanceof Error ? err.message : 'Failed to fetch stats');
                }
            } finally {
                if (isMounted.current) {
                    setLoading(false);
                }
            }
        };

        fetchStats();

        return () => {
            isMounted.current = false;
        };
    }, []);

    return { stats, loading, error };
};
