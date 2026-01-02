import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, Search, RefreshCw, ExternalLink } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Blog {
    _id: string;
    title: string;
    slug: string;
    category: string;
    status: string;
    views: number;
    likes: number;
    featured: boolean;
    publishedDate: string;
    createdAt: string;
}

export default function BlogsManager() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/blogs`);
            const data = await response.json();
            if (data.success) {
                setBlogs(data.data);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`${API_URL}/api/admin/blogs/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setBlogs(blogs.filter(b => b._id !== id));
                setDeleteId(null);
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };

    const toggleFeatured = async (blog: Blog) => {
        try {
            const response = await fetch(`${API_URL}/api/admin/blogs/${blog._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ featured: !blog.featured })
            });
            if (response.ok) {
                setBlogs(blogs.map(b =>
                    b._id === blog._id ? { ...b, featured: !b.featured } : b
                ));
            }
        } catch (error) {
            console.error('Error updating blog:', error);
        }
    };

    const handleSeed = async () => {
        if (!confirm('This will delete all existing blogs and add sample data. Continue?')) return;

        try {
            const response = await fetch(`${API_URL}/api/admin/blogs/seed`, {
                method: 'POST'
            });
            if (response.ok) {
                fetchBlogs();
                alert('Sample blogs added successfully!');
            }
        } catch (error) {
            console.error('Error seeding blogs:', error);
        }
    };

    const filteredBlogs = blogs.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>Blogs</h1>
                    <p style={{ color: '#64748b' }}>Manage your blog posts</p>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-secondary" onClick={handleSeed}>
                        Seed Sample Blogs
                    </button>
                    <Link to="/blogs/new" className="btn btn-primary">
                        <Plus size={18} /> New Blog
                    </Link>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="card mb-6">
                <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search blogs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                    <button className="btn btn-secondary" onClick={fetchBlogs}>
                        <RefreshCw size={18} /> Refresh
                    </button>
                </div>
            </div>

            {/* Blogs Table */}
            <div className="card">
                {filteredBlogs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        <p>No blogs found</p>
                        <Link to="/blogs/new" className="btn btn-primary mt-4">
                            Create your first blog
                        </Link>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Views</th>
                                    <th>Featured</th>
                                    <th>Date</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBlogs.map(blog => (
                                    <tr key={blog._id}>
                                        <td>
                                            <div style={{ maxWidth: '300px' }}>
                                                <p style={{ fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#1e293b' }}>
                                                    {blog.title}
                                                </p>
                                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{blog.slug}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-primary">{blog.category}</span>
                                        </td>
                                        <td>
                                            <span className={`badge ${blog.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                                                {blog.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1">
                                                <Eye size={14} color="#64748b" />
                                                {blog.views}
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                                className={`toggle ${blog.featured ? 'active' : ''}`}
                                                onClick={() => toggleFeatured(blog)}
                                            />
                                        </td>
                                        <td style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                            {new Date(blog.publishedDate || blog.createdAt).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
                                                <a
                                                    href={`http://localhost:5173/blogs/${blog.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-secondary btn-sm"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                                <Link to={`/blogs/edit/${blog._id}`} className="btn btn-secondary btn-sm">
                                                    <Edit2 size={14} />
                                                </Link>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => setDeleteId(blog._id)}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="modal-overlay" onClick={() => setDeleteId(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 style={{ fontWeight: '600' }}>Delete Blog</h3>
                        </div>
                        <div className="modal-body">
                            <p style={{ color: '#334155' }}>Are you sure you want to delete this blog? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
                            <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
