import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, RefreshCw } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Stats {
    certificates: { total: number; completed: number };
}

export default function Dashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const certificatesRes = await fetch(`${API_URL}/api/admin/certificates`);
            const certificatesData = await certificatesRes.json();
            const certificates = certificatesData.data || [];

            setStats({
                certificates: {
                    total: certificates.length,
                    completed: certificates.filter((c: any) => c.status === 'Completed').length
                }
            });
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <div className="loading-spinner" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>Dashboard</h1>
                    <p style={{ color: '#64748b' }}>Welcome to Edizo Admin Panel</p>
                </div>
                <button className="btn btn-secondary" onClick={fetchData}>
                    <RefreshCw size={18} /> Refresh
                </button>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)' }}>
                        <Award size={24} color="#a855f7" />
                    </div>
                    <div>
                        <div className="stat-value">{stats?.certificates.total || 0}</div>
                        <div className="stat-label">Total Certificates</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>Quick Actions</h2>
                <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                    <Link to="/certificates" className="btn btn-secondary">
                        <Award size={18} /> Manage Certificates
                    </Link>
                </div>
            </div>

        </div>
    );
}

