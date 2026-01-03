import { useState, useEffect } from 'react';
import {
    Save, RefreshCw, AlertCircle, CheckCircle,
    Briefcase, Star, Clock, Heart, Users, Calendar,
    GraduationCap, BookOpen, Award, TrendingUp,
    LayoutGrid, List
} from 'lucide-react';

interface StatItem {
    key: string;
    value: string;
    label: string;
}

const ICON_MAP: Record<string, any> = {
    projects_delivered: Briefcase,
    client_rating: Star,
    rating_score: Star,
    on_time_delivery: Clock,
    satisfaction_rate: Heart,
    happy_clients: Users,
    clients_count: Users,
    years_experience: Calendar,
    projects_count: Briefcase,
    students_trained: GraduationCap,
    programs_count: BookOpen,
    certification_rate: Award,
};

const StatsManager = () => {
    const [stats, setStats] = useState<StatItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [savingKey, setSavingKey] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/stats`);
            const data = await res.json();
            if (data.success) {
                const sortedStats = Object.values(data.data as Record<string, StatItem>).sort((a, b) => a.label.localeCompare(b.label));
                setStats(sortedStats);
            } else {
                setError('Failed to fetch stats');
            }
        } catch (err) {
            setError('Error connecting to server. Please check if backend is running.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleUpdate = async (key: string, value: string, label: string) => {
        setSavingKey(key);
        setSuccess('');
        setError('');

        try {
            const res = await fetch(`${API_URL}/api/admin/stats`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, value, label }),
            });

            const data = await res.json();

            if (data.success) {
                setSuccess(`Updated successfully`);
                setTimeout(() => setSuccess(''), 3000);
                fetchStats();
            } else {
                setError(data.message || 'Failed to update');
            }
        } catch (err) {
            setError('Update failed');
        } finally {
            setSavingKey(null);
        }
    };

    const handleSeed = async () => {
        if (!confirm('This will reset ALL stats to default values. This cannot be undone. Are you sure?')) return;
        setLoading(true);
        try {
            await fetch(`${API_URL}/api/admin/stats/seed`, { method: 'POST' });
            fetchStats();
            setSuccess('Stats reset to defaults');
        } catch (err) {
            setError('Seed failed');
        } finally {
            setLoading(false);
        }
    }

    if (loading && stats.length === 0) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
                <div className="loading-spinner" />
                <p style={{ color: 'var(--text-muted)' }}>Loading Statistics...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Header */}
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1>Site Statistics</h1>
                    <p>Manage numbers displayed across Home, About, and Contact pages</p>
                </div>

                <div className="flex gap-4">
                    <div className="card" style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem', borderRadius: '0.75rem' }}>
                        <button
                            onClick={() => setViewMode('grid')}
                            className="btn btn-sm"
                            style={{
                                background: viewMode === 'grid' ? 'var(--primary-light)' : 'transparent',
                                color: viewMode === 'grid' ? 'var(--primary)' : 'var(--text-muted)',
                                boxShadow: 'none'
                            }}
                        >
                            <LayoutGrid size={20} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className="btn btn-sm"
                            style={{
                                background: viewMode === 'list' ? 'var(--primary-light)' : 'transparent',
                                color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-muted)',
                                boxShadow: 'none'
                            }}
                        >
                            <List size={20} />
                        </button>
                    </div>
                    <button onClick={handleSeed} className="btn btn-danger btn-sm">
                        Reset Defaults
                    </button>
                </div>
            </div>

            {/* Notifications */}
            {error && (
                <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#dc2626', borderRadius: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <AlertCircle size={20} /> {error}
                </div>
            )}
            {success && (
                <div style={{ padding: '1rem', background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', borderRadius: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckCircle size={20} /> {success}
                </div>
            )}

            {/* Content */}
            {viewMode === 'grid' ? (
                <div className="stats-grid">
                    {stats.map((stat) => (
                        <StatCard
                            key={stat.key}
                            stat={stat}
                            onSave={handleUpdate}
                            isSaving={savingKey === stat.key}
                        />
                    ))}
                </div>
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) 1fr 100px', padding: '1rem 1.5rem', background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border-light)', fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        <div>Label & Key</div>
                        <div>Value</div>
                        <div className="text-center">Actions</div>
                    </div>
                    <div>
                        {stats.map((stat) => (
                            <StatListItem
                                key={stat.key}
                                stat={stat}
                                onSave={handleUpdate}
                                isSaving={savingKey === stat.key}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// === GRID VIEW CARD ===
const StatCard = ({ stat, onSave, isSaving }: { stat: StatItem, onSave: any, isSaving: boolean }) => {
    const [value, setValue] = useState(stat.value);
    const [label, setLabel] = useState(stat.label);
    const isDynamic = stat.key === 'client_rating' || stat.key === 'rating_score';
    const hasChanges = value !== stat.value || label !== stat.label;

    useEffect(() => {
        setValue(stat.value);
        setLabel(stat.label);
    }, [stat.value, stat.label]);

    const Icon = ICON_MAP[stat.key] || TrendingUp;

    return (
        <div className="stat-card" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div className="stat-icon" style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem' }}>
                    <Icon size={20} />
                </div>
                {isDynamic ? (
                    <span className="badge badge-primary">
                        <RefreshCw size={12} style={{ marginRight: '4px' }} /> Auto
                    </span>
                ) : hasChanges && (
                    <span className="badge badge-warning">Edited</span>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <span className="stat-label" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem' }}>LABEL</span>
                    <input
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        disabled={isDynamic}
                        style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            padding: 0
                        }}
                    />
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace', marginTop: '2px' }}>{stat.key}</div>
                </div>

                <div>
                    <span className="stat-label" style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.75rem' }}>VALUE</span>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        disabled={isDynamic}
                        className="form-input"
                        style={isDynamic ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                    />
                </div>

                {!isDynamic && (
                    <button
                        onClick={() => onSave(stat.key, value, label)}
                        disabled={isSaving || !hasChanges}
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            justifyContent: 'center',
                            opacity: (!hasChanges || isSaving) ? 0.5 : 1,
                            pointerEvents: (!hasChanges || isSaving) ? 'none' : 'auto'
                        }}
                    >
                        {isSaving ? <RefreshCw className="loading-spinner" style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> : <Save size={18} />}
                        {isSaving ? 'Saving' : 'Save Changes'}
                    </button>
                )}

                {isDynamic && (
                    <div style={{ fontSize: '0.75rem', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem', background: 'rgba(0,0,0,0.03)', borderRadius: '0.5rem' }}>
                        Calculated from Testimonials
                    </div>
                )}
            </div>
        </div>
    );
};

// === LIST VIEW ROW ===
const StatListItem = ({ stat, onSave, isSaving }: { stat: StatItem, onSave: any, isSaving: boolean }) => {
    const [value, setValue] = useState(stat.value);
    const [label, setLabel] = useState(stat.label);
    const isDynamic = stat.key === 'client_rating' || stat.key === 'rating_score';
    const hasChanges = value !== stat.value || label !== stat.label;
    const Icon = ICON_MAP[stat.key] || TrendingUp;

    useEffect(() => {
        setValue(stat.value);
        setLabel(stat.label);
    }, [stat.value, stat.label]);

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(200px, 1fr) 1fr 100px',
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-light)',
            alignItems: 'center',
            gap: '1.5rem'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="stat-icon" style={{ width: '2.5rem', height: '2.5rem', fontSize: '1rem', borderRadius: '0.5rem' }}>
                    <Icon size={18} />
                </div>
                <div style={{ minWidth: 0 }}>
                    <input
                        type="text"
                        value={label}
                        onChange={(e) => setLabel(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            fontWeight: 600,
                            color: 'var(--text-primary)'
                        }}
                    />
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{stat.key}</div>
                </div>
            </div>

            <div>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={isDynamic}
                    className="form-input"
                    style={isDynamic ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                {hasChanges && !isDynamic && (
                    <button
                        onClick={() => onSave(stat.key, value, label)}
                        disabled={isSaving}
                        className="btn btn-primary btn-sm"
                    >
                        {isSaving ? <RefreshCw className="loading-spinner" style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> : <Save size={16} />}
                    </button>
                )}
                {isDynamic && (
                    <span className="badge badge-primary">Auto</span>
                )}
            </div>
        </div>
    );
};

export default StatsManager;
