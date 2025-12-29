import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, MessageSquare, Eye, ThumbsUp, Plus, RefreshCw, Award } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Stats {
    blogs: { total: number; published: number; draft: number };
    testimonials: { total: number; approved: number; pending: number };
    certificates: { total: number; completed: number };
}

export default function Dashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
    const [recentTestimonials, setRecentTestimonials] = useState<any[]>([]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [blogsRes, testimonialsRes, certificatesRes] = await Promise.all([
                fetch(`${API_URL}/api/admin/blogs`),
                fetch(`${API_URL}/api/admin/testimonials`),
                fetch(`${API_URL}/api/admin/certificates`)
            ]);

            const blogsData = await blogsRes.json();
            const testimonialsData = await testimonialsRes.json();
            const certificatesData = await certificatesRes.json();

            const blogs = blogsData.data || [];
            const testimonials = testimonialsData.data || [];
            const certificates = certificatesData.data || [];

            setStats({
                blogs: {
                    total: blogs.length,
                    published: blogs.filter((b: any) => b.status === 'published').length,
                    draft: blogs.filter((b: any) => b.status === 'draft').length
                },
                testimonials: {
                    total: testimonials.length,
                    approved: testimonials.filter((t: any) => t.isApproved).length,
                    pending: testimonials.filter((t: any) => !t.isApproved).length
                },
                certificates: {
                    total: certificates.length,
                    completed: certificates.filter((c: any) => c.status === 'Completed').length
                }
            });

            setRecentBlogs(blogs.slice(0, 5));
            setRecentTestimonials(testimonials.slice(0, 5));
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
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Dashboard</h1>
                    <p style={{ color: '#94a3b8' }}>Welcome to Edizo Admin Panel</p>
                </div>
                <button className="btn btn-secondary" onClick={fetchData}>
                    <RefreshCw size={18} /> Refresh
                </button>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
                        <FileText size={24} color="#3b82f6" />
                    </div>
                    <div>
                        <div className="stat-value">{stats?.blogs.total || 0}</div>
                        <div className="stat-label">Total Blogs</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.2)' }}>
                        <Eye size={24} color="#22c55e" />
                    </div>
                    <div>
                        <div className="stat-value">{stats?.blogs.published || 0}</div>
                        <div className="stat-label">Published</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(249, 115, 22, 0.2)' }}>
                        <MessageSquare size={24} color="#f97316" />
                    </div>
                    <div>
                        <div className="stat-value">{stats?.testimonials.total || 0}</div>
                        <div className="stat-label">Testimonials</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.2)' }}>
                        <ThumbsUp size={24} color="#ef4444" />
                    </div>
                    <div>
                        <div className="stat-value">{stats?.testimonials.pending || 0}</div>
                        <div className="stat-label">Pending Review</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.2)' }}>
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
                <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Quick Actions</h2>
                <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                    <Link to="/blogs/new" className="btn btn-primary">
                        <Plus size={18} /> New Blog Post
                    </Link>
                    <Link to="/testimonials" className="btn btn-secondary">
                        <MessageSquare size={18} /> Manage Testimonials
                    </Link>
                    <Link to="/certificates" className="btn btn-secondary">
                        <Award size={18} /> Manage Certificates
                    </Link>
                </div>
            </div>

            {/* Recent Content */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                {/* Recent Blogs */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Recent Blogs</h2>
                        <Link to="/blogs" style={{ color: '#f97316', fontSize: '0.875rem', textDecoration: 'none' }}>
                            View All →
                        </Link>
                    </div>
                    {recentBlogs.length === 0 ? (
                        <p style={{ color: '#64748b' }}>No blogs yet</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {recentBlogs.map((blog: any) => (
                                <div key={blog._id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem',
                                    background: '#1a1a2e',
                                    borderRadius: '0.5rem'
                                }}>
                                    <FileText size={18} color="#64748b" />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{
                                            fontWeight: '500',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {blog.title}
                                        </p>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{blog.category}</span>
                                    </div>
                                    <span className={`badge ${blog.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                                        {blog.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Testimonials */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Recent Testimonials</h2>
                        <Link to="/testimonials" style={{ color: '#f97316', fontSize: '0.875rem', textDecoration: 'none' }}>
                            View All →
                        </Link>
                    </div>
                    {recentTestimonials.length === 0 ? (
                        <p style={{ color: '#64748b' }}>No testimonials yet</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {recentTestimonials.map((t: any) => (
                                <div key={t._id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem',
                                    background: '#1a1a2e',
                                    borderRadius: '0.5rem'
                                }}>
                                    <div style={{
                                        width: '36px',
                                        height: '36px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '600'
                                    }}>
                                        {t.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontWeight: '500' }}>{t.name}</p>
                                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.service}</span>
                                    </div>
                                    <span className={`badge ${t.isApproved ? 'badge-success' : 'badge-warning'}`}>
                                        {t.isApproved ? 'Approved' : 'Pending'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
