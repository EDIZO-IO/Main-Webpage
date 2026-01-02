import { useEffect, useState } from 'react';
import { Star, Trash2, Check, X, Search, RefreshCw, Eye } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Testimonial {
    _id: string;
    name: string;
    role: string;
    company: string;
    rating: number;
    review: string;
    service: string;
    isApproved: boolean;
    isFeatured: boolean;
    createdAt: string;
}

export default function TestimonialsManager() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [viewTestimonial, setViewTestimonial] = useState<Testimonial | null>(null);

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/testimonials`);
            const data = await response.json();
            if (data.success) {
                setTestimonials(data.data);
            }
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleApprove = async (id: string, approve: boolean) => {
        try {
            const response = await fetch(`${API_URL}/api/admin/testimonials/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isApproved: approve })
            });
            if (response.ok) {
                setTestimonials(testimonials.map(t =>
                    t._id === id ? { ...t, isApproved: approve } : t
                ));
            }
        } catch (error) {
            console.error('Error updating testimonial:', error);
        }
    };

    const handleFeatured = async (id: string, featured: boolean) => {
        try {
            const response = await fetch(`${API_URL}/api/admin/testimonials/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isFeatured: featured })
            });
            if (response.ok) {
                setTestimonials(testimonials.map(t =>
                    t._id === id ? { ...t, isFeatured: featured } : t
                ));
            }
        } catch (error) {
            console.error('Error updating testimonial:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/api/admin/testimonials/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setTestimonials(testimonials.filter(t => t._id !== id));
                setSelectedId(null);
            }
        } catch (error) {
            console.error('Error deleting testimonial:', error);
        }
    };

    const handleSeed = async () => {
        if (!confirm('This will delete all existing testimonials and add sample data. Continue?')) return;

        try {
            const response = await fetch(`${API_URL}/api/admin/testimonials/seed`, {
                method: 'POST'
            });
            if (response.ok) {
                fetchTestimonials();
                alert('Sample testimonials added successfully!');
            }
        } catch (error) {
            console.error('Error seeding testimonials:', error);
        }
    };

    const filteredTestimonials = testimonials.filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.review.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.service.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'pending') return matchesSearch && !t.isApproved;
        if (filter === 'approved') return matchesSearch && t.isApproved;
        return matchesSearch;
    });

    const pendingCount = testimonials.filter(t => !t.isApproved).length;

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
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>Testimonials</h1>
                    <p style={{ color: '#64748b' }}>
                        Manage client reviews {pendingCount > 0 && <span className="badge badge-warning" style={{ marginLeft: '0.5rem' }}>{pendingCount} pending</span>}
                    </p>
                </div>
                <button className="btn btn-secondary" onClick={handleSeed}>
                    Seed Sample Data
                </button>
            </div>

            {/* Filters */}
            <div className="card mb-6">
                <div className="flex gap-4" style={{ flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search testimonials..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                    <div className="flex gap-2">
                        {(['all', 'pending', 'approved'] as const).map(f => (
                            <button
                                key={f}
                                className={`btn ${filter === f ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                                onClick={() => setFilter(f)}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={fetchTestimonials}>
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            {/* Testimonials Grid */}
            {filteredTestimonials.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ color: '#64748b' }}>No testimonials found</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1rem' }}>
                    {filteredTestimonials.map(t => (
                        <div key={t._id} className="card" style={{ position: 'relative' }}>
                            {/* Status Badges */}
                            <div className="flex gap-2" style={{ marginBottom: '1rem' }}>
                                {!t.isApproved && <span className="badge badge-warning">Pending</span>}
                                {t.isApproved && <span className="badge badge-success">Approved</span>}
                                {t.isFeatured && <span className="badge badge-primary">Featured</span>}
                            </div>

                            {/* Author */}
                            <div className="flex items-center gap-3" style={{ marginBottom: '0.75rem' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    color: 'white'
                                }}>
                                    {t.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p style={{ fontWeight: '600', color: '#1e293b' }}>{t.name}</p>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                        {t.role} {t.company && `• ${t.company}`}
                                    </p>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-1" style={{ marginBottom: '0.75rem' }}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        size={16}
                                        fill={star <= t.rating ? '#fbbf24' : 'none'}
                                        color={star <= t.rating ? '#fbbf24' : '#64748b'}
                                    />
                                ))}
                                <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                                    {t.service}
                                </span>
                            </div>

                            {/* Review Preview */}
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#64748b',
                                marginBottom: '1rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                            }}>
                                "{t.review}"
                            </p>

                            {/* Actions */}
                            <div className="flex gap-2" style={{ borderTop: '1px solid rgba(148, 163, 184, 0.2)', paddingTop: '1rem', marginTop: 'auto' }}>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => setViewTestimonial(t)}
                                >
                                    <Eye size={14} /> View
                                </button>
                                {!t.isApproved ? (
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleApprove(t._id, true)}
                                    >
                                        <Check size={14} /> Approve
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => handleApprove(t._id, false)}
                                    >
                                        <X size={14} /> Revoke
                                    </button>
                                )}
                                <button
                                    className={`btn btn-sm ${t.isFeatured ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => handleFeatured(t._id, !t.isFeatured)}
                                >
                                    <Star size={14} fill={t.isFeatured ? 'white' : 'none'} />
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => setSelectedId(t._id)}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* View Modal */}
            {viewTestimonial && (
                <div className="modal-overlay" onClick={() => setViewTestimonial(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 style={{ fontWeight: '600' }}>Testimonial Details</h3>
                            <button onClick={() => setViewTestimonial(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="flex items-center gap-3" style={{ marginBottom: '1rem' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '700',
                                    fontSize: '1.25rem',
                                    color: 'white'
                                }}>
                                    {viewTestimonial.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p style={{ fontWeight: '600', fontSize: '1.125rem', color: '#1e293b' }}>{viewTestimonial.name}</p>
                                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                        {viewTestimonial.role} {viewTestimonial.company && `• ${viewTestimonial.company}`}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        size={20}
                                        fill={star <= viewTestimonial.rating ? '#fbbf24' : 'none'}
                                        color={star <= viewTestimonial.rating ? '#fbbf24' : '#64748b'}
                                    />
                                ))}
                                <span style={{ marginLeft: '0.5rem', color: '#94a3b8' }}>{viewTestimonial.service}</span>
                            </div>

                            <p style={{ lineHeight: '1.6', marginBottom: '1rem', color: '#334155' }}>"{viewTestimonial.review}"</p>

                            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                Submitted: {new Date(viewTestimonial.createdAt).toLocaleString()}
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setViewTestimonial(null)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {selectedId && (
                <div className="modal-overlay" onClick={() => setSelectedId(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 style={{ fontWeight: '600' }}>Delete Testimonial</h3>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this testimonial? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setSelectedId(null)}>Cancel</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(selectedId)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
