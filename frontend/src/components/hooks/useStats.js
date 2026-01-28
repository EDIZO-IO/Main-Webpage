import { useState, useEffect, useRef } from 'react';

const MOCK_STATS = {
    projects_delivered: { key: 'projects_delivered', value: '25+', label: 'Projects Done' },
    client_rating: { key: 'client_rating', value: '5.0/5', label: 'Client Rating' },
    on_time_delivery: { key: 'on_time_delivery', value: '98%', label: 'On-Time Delivery' },
    satisfaction_rate: { key: 'satisfaction_rate', value: '100%', label: 'Satisfaction' },
    happy_clients: { key: 'happy_clients', value: '10+', label: 'Happy Clients' },
    years_experience: { key: 'years_experience', value: '3+', label: 'Years Experience' },
    clients_count: { key: 'clients_count', value: '15+', label: 'Clients' },
    projects_count: { key: 'projects_count', value: '50+', label: 'Projects' },
    rating_score: { key: 'rating_score', value: '5.0', label: 'Rating' },
    students_trained: { key: 'students_trained', value: '500+', label: 'Students Trained' },
    programs_count: { key: 'programs_count', value: '20+', label: 'Programs' },
    certification_rate: { key: 'certification_rate', value: '95%', label: 'Certification' },
};

export const useStats = () => {
    const [stats, setStats] = useState(MOCK_STATS);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;

        // Simulate loading briefly for UX
        setLoading(true);

        const timer = setTimeout(() => {
            if (isMounted.current) {
                setStats(MOCK_STATS);
                setLoading(false);
            }
        }, 300); // Small delay to simulate loading

        return () => {
            isMounted.current = false;
            clearTimeout(timer);
        };
    }, []);

    return { stats, loading, error };
};