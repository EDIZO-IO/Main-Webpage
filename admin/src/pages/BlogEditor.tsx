import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface BlogForm {
    title: string;
    slug: string;
    description: string;
    content: string;
    author: string;
    category: string;
    tags: string;
    thumbnail: string;
    status: 'draft' | 'published' | 'archived';
    featured: boolean;
    seoDescription: string;
    keywords: string;
}

const CATEGORIES = ['Technology', 'Design', 'Business', 'Marketing', 'Development'];

export default function BlogEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [form, setForm] = useState<BlogForm>({
        title: '',
        slug: '',
        description: '',
        content: '',
        author: 'Edizo Team',
        category: 'Technology',
        tags: '',
        thumbnail: '',
        status: 'draft',
        featured: false,
        seoDescription: '',
        keywords: ''
    });
    const [loading, setLoading] = useState(isEditing);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditing && id) {
            fetchBlog(id);
        }
    }, [id, isEditing]);

    const fetchBlog = async (blogId: string) => {
        try {
            const response = await fetch(`${API_URL}/api/blogs/${blogId}`);
            const data = await response.json();
            if (data.success && data.data) {
                const blog = data.data;
                setForm({
                    title: blog.title || '',
                    slug: blog.slug || '',
                    description: blog.description || '',
                    content: blog.content || '',
                    author: blog.author || 'Edizo Team',
                    category: blog.category || 'Technology',
                    tags: blog.tags?.join(', ') || '',
                    thumbnail: blog.thumbnail || '',
                    status: blog.status || 'draft',
                    featured: blog.featured || false,
                    seoDescription: blog.seoDescription || '',
                    keywords: blog.keywords?.join(', ') || ''
                });
            }
        } catch (error) {
            console.error('Error fetching blog:', error);
            setError('Failed to load blog');
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleTitleChange = (title: string) => {
        setForm(prev => ({
            ...prev,
            title,
            slug: prev.slug || generateSlug(title)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        if (!form.title || !form.content || !form.description) {
            setError('Title, description, and content are required');
            setSaving(false);
            return;
        }

        try {
            const blogData = {
                ...form,
                tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean)
            };

            const url = isEditing
                ? `${API_URL}/api/admin/blogs/${id}`
                : `${API_URL}/api/admin/blogs`;

            const response = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(blogData)
            });

            const data = await response.json();

            if (data.success) {
                navigate('/blogs');
            } else {
                setError(data.message || 'Failed to save blog');
            }
        } catch (error) {
            console.error('Error saving blog:', error);
            setError('Failed to save blog');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <div className="loading-spinner" />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px' }}>
            <div className="flex items-center gap-4 mb-6">
                <button className="btn btn-secondary" onClick={() => navigate('/blogs')}>
                    <ArrowLeft size={18} />
                </button>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>
                        {isEditing ? 'Edit Blog' : 'New Blog Post'}
                    </h1>
                    <p style={{ color: '#64748b' }}>
                        {isEditing ? 'Update your blog post' : 'Create a new blog post'}
                    </p>
                </div>
            </div>

            {error && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '0.75rem',
                    padding: '0.875rem 1rem',
                    marginBottom: '1.5rem',
                    color: '#dc2626',
                    fontWeight: '500'
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="card mb-6">
                    <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1e293b' }}>Content</h2>

                    <div className="form-group">
                        <label className="form-label">Title *</label>
                        <input
                            type="text"
                            className="form-input"
                            value={form.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            placeholder="Enter blog title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Slug</label>
                        <input
                            type="text"
                            className="form-input"
                            value={form.slug}
                            onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))}
                            placeholder="url-friendly-slug"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description *</label>
                        <textarea
                            className="form-input"
                            value={form.description}
                            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Short description for preview"
                            style={{ minHeight: '80px' }}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Content * (HTML supported)</label>
                        <textarea
                            className="form-input"
                            value={form.content}
                            onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                            placeholder="<h2>Introduction</h2><p>Your blog content here...</p>"
                            style={{ minHeight: '300px', fontFamily: 'monospace' }}
                            required
                        />
                    </div>
                </div>

                <div className="card mb-6">
                    <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1e293b' }}>Details</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="form-label">Author</label>
                            <input
                                type="text"
                                className="form-input"
                                value={form.author}
                                onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
                                placeholder="Author name"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select
                                className="form-select"
                                value={form.category}
                                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Tags (comma-separated)</label>
                            <input
                                type="text"
                                className="form-input"
                                value={form.tags}
                                onChange={(e) => setForm(prev => ({ ...prev, tags: e.target.value }))}
                                placeholder="react, javascript, web development"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Thumbnail URL</label>
                            <input
                                type="text"
                                className="form-input"
                                value={form.thumbnail}
                                onChange={(e) => setForm(prev => ({ ...prev, thumbnail: e.target.value }))}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Status</label>
                            <select
                                className="form-select"
                                value={form.status}
                                onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value as any }))}
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Featured</label>
                            <div style={{ paddingTop: '0.5rem' }}>
                                <button
                                    type="button"
                                    className={`toggle ${form.featured ? 'active' : ''}`}
                                    onClick={() => setForm(prev => ({ ...prev, featured: !prev.featured }))}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card mb-6">
                    <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1.5rem', color: '#1e293b' }}>SEO</h2>

                    <div className="form-group">
                        <label className="form-label">SEO Description</label>
                        <textarea
                            className="form-input"
                            value={form.seoDescription}
                            onChange={(e) => setForm(prev => ({ ...prev, seoDescription: e.target.value }))}
                            placeholder="Meta description for search engines"
                            style={{ minHeight: '80px' }}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Keywords (comma-separated)</label>
                        <input
                            type="text"
                            className="form-input"
                            value={form.keywords}
                            onChange={(e) => setForm(prev => ({ ...prev, keywords: e.target.value }))}
                            placeholder="seo, keywords, for, search"
                        />
                    </div>
                </div>

                <div className="flex gap-4" style={{ justifyContent: 'flex-end' }}>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/blogs')}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? (
                            <div className="loading-spinner" style={{ width: '18px', height: '18px' }} />
                        ) : (
                            <>
                                <Save size={18} />
                                {isEditing ? 'Update Blog' : 'Create Blog'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
