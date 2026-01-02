
import { useEffect, useState } from 'react';
import { Plus, Trash2, Search, RefreshCw, Edit2, X, FileText, DollarSign, List, Image as ImageIcon } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Detailed Interface matching Sheet Columns
interface Internship {
    rowIndex: number; // 0-based index in the spreadsheet (including header)
    id: string; // Col A
    title: string; // Col B
    category: string; // Col C
    mode: string; // Col D
    company: string; // Col E
    image: string; // Col F
    rating: string; // Col G
    description: string; // Col H
    price1Month: string; // Col AA (index 27)
    discount1Month: string; // Col AB (index 31)
    fullRow: string[]; // Store full row to preserve unedited data
}

// Column Indices mapping
const COL_ID = 0;
const COL_TITLE = 1;
const COL_CATEGORY = 2;
const COL_MODE = 3;
const COL_COMPANY = 4;
const COL_IMAGE = 5;
const COL_RATING = 6;
const COL_DESCRIPTION = 7;

// Why Choose (8-14)
const COL_WHY_START = 8;
const COL_WHY_END = 14;

// Benefits (15-21)
const COL_BENEFITS_START = 15;
const COL_BENEFITS_END = 21;

// Syllabus (22-25)
const COL_SYLLABUS_15D = 22;
const COL_SYLLABUS_1M = 23;
const COL_SYLLABUS_2M = 24;
const COL_SYLLABUS_3M = 25;

// Pricing: AA(26)..AD(29)
const COL_PRICE_15D = 26;
const COL_PRICE_1M = 27;
const COL_PRICE_2M = 28;
const COL_PRICE_3M = 29;

// Discount: AE(30)..AH(33)
const COL_DISC_15D = 30;
const COL_DISC_1M = 31;
const COL_DISC_2M = 32;
const COL_DISC_3M = 33;

const COL_COUPONS = 34; // AI

// Coupon Discounts: AJ(35)..AM(38)
const COL_COUPON_DISC_15D = 35;
const COL_COUPON_DISC_1M = 36;
const COL_COUPON_DISC_2M = 37;
const COL_COUPON_DISC_3M = 38;

export default function InternshipsManager() {
    const [internships, setInternships] = useState<Internship[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'general' | 'pricing' | 'content'>('general');

    // Form State
    const [formData, setFormData] = useState({
        id: '',
        title: '',
        category: 'Development',
        mode: 'Online',
        company: 'EDIZO',
        image: '',
        rating: '4.5',
        description: '',
        // Pricing
        price15d: '0', price1m: '0', price2m: '0', price3m: '0',
        // Discounts
        disc15d: '0', disc1m: '0', disc2m: '0', disc3m: '0',
        // Coupon Discounts
        cdisc15d: '0', cdisc1m: '0', cdisc2m: '0', cdisc3m: '0',
        coupons: '', // Comma sep
        // Content (newlines)
        whyChoose: '',
        benefits: '',
        // Syllabus (comma sep)
        syl15d: '', syl1m: '', syl2m: '', syl3m: ''
    });

    const [submitting, setSubmitting] = useState(false);

    const fetchInternships = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/internships`);
            const data = await response.json();

            if (data.values && Array.isArray(data.values)) {
                const parsed = data.values.slice(1).map((row: string[], idx: number) => ({
                    rowIndex: idx + 1,
                    id: row[COL_ID] || '',
                    title: row[COL_TITLE] || '',
                    category: row[COL_CATEGORY] || '',
                    mode: row[COL_MODE] || '',
                    company: row[COL_COMPANY] || '',
                    image: row[COL_IMAGE] || '',
                    rating: row[COL_RATING] || '',
                    description: row[COL_DESCRIPTION] || '',
                    price1Month: row[COL_PRICE_1M] || '0',
                    discount1Month: row[COL_DISC_1M] || '0',
                    fullRow: row
                }));
                setInternships(parsed);
            }
        } catch (error) {
            console.error('Error fetching internships:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInternships();
    }, []);

    const handleDelete = async () => {
        if (deleteIndex === null) return;
        try {
            const response = await fetch(`${API_URL}/api/admin/internships/${deleteIndex}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setDeleteIndex(null);
                fetchInternships();
            } else {
                alert('Failed to delete internship');
            }
        } catch (error) {
            console.error('Error deleting internship:', error);
        }
    };

    const handleEditClick = async (internship: Internship) => {
        setModalMode('edit');
        setEditingIndex(internship.rowIndex);
        setActiveTab('general');

        const row = internship.fullRow || [];

        // Join multiple columns into single string for textareas
        const whyChoose = row.slice(COL_WHY_START, COL_WHY_END + 1).filter(Boolean).join('\n');
        const benefits = row.slice(COL_BENEFITS_START, COL_BENEFITS_END + 1).filter(Boolean).join('\n');

        setFormData({
            id: internship.id,
            title: internship.title,
            category: internship.category,
            mode: internship.mode,
            company: internship.company,
            image: internship.image,
            rating: internship.rating,
            description: internship.description,

            price15d: row[COL_PRICE_15D] || '0',
            price1m: row[COL_PRICE_1M] || '0',
            price2m: row[COL_PRICE_2M] || '0',
            price3m: row[COL_PRICE_3M] || '0',

            disc15d: row[COL_DISC_15D] || '0',
            disc1m: row[COL_DISC_1M] || '0',
            disc2m: row[COL_DISC_2M] || '0',
            disc3m: row[COL_DISC_3M] || '0',

            cdisc15d: row[COL_COUPON_DISC_15D] || '0',
            cdisc1m: row[COL_COUPON_DISC_1M] || '0',
            cdisc2m: row[COL_COUPON_DISC_2M] || '0',
            cdisc3m: row[COL_COUPON_DISC_3M] || '0',

            coupons: row[COL_COUPONS] || '',

            whyChoose,
            benefits,

            syl15d: row[COL_SYLLABUS_15D] || '',
            syl1m: row[COL_SYLLABUS_1M] || '',
            syl2m: row[COL_SYLLABUS_2M] || '',
            syl3m: row[COL_SYLLABUS_3M] || ''
        });
        setShowModal(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // New row array (39 cols)
            const row = new Array(39).fill('');

            // Basic
            row[COL_ID] = formData.id;
            row[COL_TITLE] = formData.title;
            row[COL_CATEGORY] = formData.category;
            row[COL_MODE] = formData.mode;
            row[COL_COMPANY] = formData.company;
            row[COL_IMAGE] = formData.image;
            row[COL_RATING] = formData.rating;
            row[COL_DESCRIPTION] = formData.description;

            // Why Choose (Split by newline, max 7)
            const whyChooseArr = formData.whyChoose.split('\n').filter(s => s.trim());
            for (let i = 0; i < 7; i++) {
                row[COL_WHY_START + i] = whyChooseArr[i] || '';
            }

            // Benefits (Split by newline, max 7)
            const benefitsArr = formData.benefits.split('\n').filter(s => s.trim());
            for (let i = 0; i < 7; i++) {
                row[COL_BENEFITS_START + i] = benefitsArr[i] || '';
            }

            // Syllabus
            row[COL_SYLLABUS_15D] = formData.syl15d;
            row[COL_SYLLABUS_1M] = formData.syl1m;
            row[COL_SYLLABUS_2M] = formData.syl2m;
            row[COL_SYLLABUS_3M] = formData.syl3m;

            // Pricing
            row[COL_PRICE_15D] = formData.price15d;
            row[COL_PRICE_1M] = formData.price1m;
            row[COL_PRICE_2M] = formData.price2m;
            row[COL_PRICE_3M] = formData.price3m;

            // Discounts
            row[COL_DISC_15D] = formData.disc15d;
            row[COL_DISC_1M] = formData.disc1m;
            row[COL_DISC_2M] = formData.disc2m;
            row[COL_DISC_3M] = formData.disc3m;

            // Coupons
            row[COL_COUPONS] = formData.coupons;

            // Coupon Discounts
            row[COL_COUPON_DISC_15D] = formData.cdisc15d;
            row[COL_COUPON_DISC_1M] = formData.cdisc1m;
            row[COL_COUPON_DISC_2M] = formData.cdisc2m;
            row[COL_COUPON_DISC_3M] = formData.cdisc3m;

            let url = `${API_URL}/api/admin/internships`;
            let method = 'POST';

            if (modalMode === 'edit' && editingIndex !== null) {
                url = `${API_URL}/api/admin/internships/${editingIndex}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ values: row })
            });

            if (response.ok) {
                setShowModal(false);
                fetchInternships();
            } else {
                alert('Failed to save');
            }
        } catch (error) {
            console.error('Error saving:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const filteredInternships = internships.filter(i =>
        i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="flex justify-center items-center h-[50vh]"><div className="loading-spinner" /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>Internships</h1>
                    <p style={{ color: '#64748b' }}>Manage internship opportunities</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setModalMode('add');
                        setFormData({
                            id: `INT-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
                            title: '', category: 'Development', mode: 'Online', company: 'EDIZO',
                            image: '', rating: '4.5', description: '',
                            price15d: '0', price1m: '0', price2m: '0', price3m: '0',
                            disc15d: '0', disc1m: '0', disc2m: '0', disc3m: '0',
                            cdisc15d: '0', cdisc1m: '0', cdisc2m: '0', cdisc3m: '0',
                            coupons: '', whyChoose: '', benefits: '',
                            syl15d: '', syl1m: '', syl2m: '', syl3m: ''
                        });
                        setActiveTab('general');
                        setShowModal(true);
                    }}
                >
                    <Plus size={18} /> Add Internship
                </button>
            </div>

            <div className="card mb-6">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            className="form-input pl-10"
                            placeholder="Search internships..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-secondary" onClick={fetchInternships}>
                        <RefreshCw size={18} /> Refresh
                    </button>
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-gray-700">
                                <th className="p-4">ID</th>
                                <th className="p-4">Title</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Mode</th>
                                <th className="p-4">Price (1m)</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInternships.map((internship) => (
                                <tr key={internship.rowIndex} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.15)' }}>
                                    <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.875rem', color: '#64748b' }}>{internship.id}</td>
                                    <td style={{ padding: '1rem', fontWeight: '500', color: '#1e293b' }}>{internship.title}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className="badge badge-primary">
                                            {internship.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', color: '#334155' }}>{internship.mode}</td>
                                    <td style={{ padding: '1rem', color: '#1e293b', fontWeight: '500' }}>₹{internship.price1Month}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => handleEditClick(internship)}
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => setDeleteIndex(internship.rowIndex)}
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
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" style={{ maxWidth: '900px' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 style={{ fontWeight: '600', color: '#1e293b' }}>{modalMode === 'add' ? 'New Internship' : 'Edit Internship'}</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div style={{ display: 'flex', borderBottom: '1px solid rgba(148, 163, 184, 0.2)', padding: '0 1rem' }}>
                            <button
                                style={{
                                    padding: '0.875rem 1.25rem',
                                    fontWeight: '500',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    gap: '0.5rem',
                                    alignItems: 'center',
                                    color: activeTab === 'general' ? '#f97316' : '#64748b',
                                    borderBottom: activeTab === 'general' ? '2px solid #f97316' : '2px solid transparent',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setActiveTab('general')}
                            >
                                <FileText size={16} /> General Info
                            </button>
                            <button
                                style={{
                                    padding: '0.875rem 1.25rem',
                                    fontWeight: '500',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    gap: '0.5rem',
                                    alignItems: 'center',
                                    color: activeTab === 'pricing' ? '#f97316' : '#64748b',
                                    borderBottom: activeTab === 'pricing' ? '2px solid #f97316' : '2px solid transparent',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setActiveTab('pricing')}
                            >
                                <DollarSign size={16} /> Pricing & Coupons
                            </button>
                            <button
                                style={{
                                    padding: '0.875rem 1.25rem',
                                    fontWeight: '500',
                                    fontSize: '0.875rem',
                                    display: 'flex',
                                    gap: '0.5rem',
                                    alignItems: 'center',
                                    color: activeTab === 'content' ? '#f97316' : '#64748b',
                                    borderBottom: activeTab === 'content' ? '2px solid #f97316' : '2px solid transparent',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                                onClick={() => setActiveTab('content')}
                            >
                                <List size={16} /> Content & Syllabus
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>

                            {activeTab === 'general' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {/* Basic Info Section */}
                                    <div style={{
                                        background: 'rgba(148, 163, 184, 0.06)',
                                        borderRadius: '1rem',
                                        padding: '1.25rem',
                                        border: '1px solid rgba(148, 163, 184, 0.1)'
                                    }}>
                                        <h4 style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            color: '#f97316',
                                            marginBottom: '1rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <FileText size={14} /> Basic Information
                                        </h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div className="form-group" style={{ margin: 0 }}>
                                                <label className="form-label" style={{ color: '#475569', fontSize: '0.8125rem' }}>Internship ID</label>
                                                <input className="form-input" value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })} placeholder="INT-2024-001" />
                                            </div>
                                            <div className="form-group" style={{ margin: 0 }}>
                                                <label className="form-label" style={{ color: '#475569', fontSize: '0.8125rem' }}>Company</label>
                                                <input className="form-input" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} placeholder="EDIZO" />
                                            </div>
                                            <div className="form-group" style={{ margin: 0, gridColumn: 'span 2' }}>
                                                <label className="form-label" style={{ color: '#475569', fontSize: '0.8125rem' }}>Title *</label>
                                                <input className="form-input" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Web Development Internship" style={{ fontWeight: '500' }} />
                                            </div>
                                            <div className="form-group" style={{ margin: 0 }}>
                                                <label className="form-label" style={{ color: '#475569', fontSize: '0.8125rem' }}>Category</label>
                                                <select className="form-select" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                                    <option>Development</option>
                                                    <option>Design</option>
                                                    <option>Data Science</option>
                                                    <option>Marketing</option>
                                                    <option>Management</option>
                                                </select>
                                            </div>
                                            <div className="form-group" style={{ margin: 0 }}>
                                                <label className="form-label" style={{ color: '#475569', fontSize: '0.8125rem' }}>Mode</label>
                                                <select className="form-select" value={formData.mode} onChange={e => setFormData({ ...formData, mode: e.target.value })}>
                                                    <option>Online</option>
                                                    <option>Offline</option>
                                                    <option>Hybrid</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details Section */}
                                    <div style={{
                                        background: 'rgba(148, 163, 184, 0.06)',
                                        borderRadius: '1rem',
                                        padding: '1.25rem',
                                        border: '1px solid rgba(148, 163, 184, 0.1)'
                                    }}>
                                        <h4 style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            color: '#f97316',
                                            marginBottom: '1rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <ImageIcon size={14} /> Media & Details
                                        </h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div className="form-group" style={{ margin: 0 }}>
                                                <label className="form-label" style={{ color: '#475569', fontSize: '0.8125rem' }}>Rating</label>
                                                <input type="number" step="0.1" min="0" max="5" className="form-input" value={formData.rating} onChange={e => setFormData({ ...formData, rating: e.target.value })} placeholder="4.5" />
                                            </div>
                                            <div className="form-group" style={{ margin: 0 }}>
                                                <label className="form-label" style={{ color: '#475569', fontSize: '0.8125rem' }}>Image URL</label>
                                                <input className="form-input" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
                                            </div>
                                            <div className="form-group" style={{ margin: 0, gridColumn: 'span 2' }}>
                                                <label className="form-label" style={{ color: '#475569', fontSize: '0.8125rem' }}>Description</label>
                                                <textarea className="form-input" style={{ minHeight: '100px', resize: 'vertical' }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Enter a compelling description for this internship..." />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'pricing' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {/* Pricing Cards */}
                                    <div style={{
                                        background: 'rgba(148, 163, 184, 0.06)',
                                        borderRadius: '1rem',
                                        padding: '1.25rem',
                                        border: '1px solid rgba(148, 163, 184, 0.1)'
                                    }}>
                                        <h4 style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            color: '#f97316',
                                            marginBottom: '1rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <DollarSign size={14} /> Pricing Plans
                                        </h4>

                                        {/* Header */}
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '140px 1fr 1fr 1fr',
                                            gap: '0.75rem',
                                            marginBottom: '0.75rem',
                                            padding: '0.5rem 0.75rem',
                                            background: 'rgba(148, 163, 184, 0.08)',
                                            borderRadius: '0.5rem'
                                        }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Duration</div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Price (₹)</div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Discount %</div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Coupon Disc %</div>
                                        </div>

                                        {/* Pricing Rows */}
                                        {[
                                            { l: '15 Days', p: 'price15d', d: 'disc15d', c: 'cdisc15d', color: '#94a3b8' },
                                            { l: '1 Month', p: 'price1m', d: 'disc1m', c: 'cdisc1m', color: '#22c55e' },
                                            { l: '2 Months', p: 'price2m', d: 'disc2m', c: 'cdisc2m', color: '#3b82f6' },
                                            { l: '3 Months', p: 'price3m', d: 'disc3m', c: 'cdisc3m', color: '#f97316' }
                                        ].map((row, i) => (
                                            <div key={i} style={{
                                                display: 'grid',
                                                gridTemplateColumns: '140px 1fr 1fr 1fr',
                                                gap: '0.75rem',
                                                alignItems: 'center',
                                                padding: '0.75rem',
                                                background: i % 2 === 0 ? 'transparent' : 'rgba(148, 163, 184, 0.04)',
                                                borderRadius: '0.5rem'
                                            }}>
                                                <div style={{
                                                    fontWeight: '600',
                                                    color: '#1e293b',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}>
                                                    <span style={{
                                                        width: '8px',
                                                        height: '8px',
                                                        borderRadius: '50%',
                                                        background: row.color
                                                    }} />
                                                    {row.l}
                                                </div>
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    style={{ padding: '0.625rem 0.75rem' }}
                                                    value={(formData as any)[row.p]}
                                                    onChange={e => setFormData({ ...formData, [row.p]: e.target.value })}
                                                    placeholder="0"
                                                />
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    style={{ padding: '0.625rem 0.75rem' }}
                                                    value={(formData as any)[row.d]}
                                                    onChange={e => setFormData({ ...formData, [row.d]: e.target.value })}
                                                    placeholder="0"
                                                />
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    style={{ padding: '0.625rem 0.75rem' }}
                                                    value={(formData as any)[row.c]}
                                                    onChange={e => setFormData({ ...formData, [row.c]: e.target.value })}
                                                    placeholder="0"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Coupons Section */}
                                    <div style={{
                                        background: 'rgba(148, 163, 184, 0.06)',
                                        borderRadius: '1rem',
                                        padding: '1.25rem',
                                        border: '1px solid rgba(148, 163, 184, 0.1)'
                                    }}>
                                        <h4 style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            color: '#f97316',
                                            marginBottom: '1rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em'
                                        }}>
                                            🎟️ Coupon Codes
                                        </h4>
                                        <div className="form-group" style={{ margin: 0 }}>
                                            <label className="form-label" style={{ color: '#475569', fontSize: '0.8125rem' }}>Available Coupons (Comma Separated)</label>
                                            <input
                                                className="form-input"
                                                value={formData.coupons}
                                                onChange={e => setFormData({ ...formData, coupons: e.target.value })}
                                                placeholder="SAVE10, SAVE20, WELCOME50"
                                            />
                                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                                                These codes will apply the Coupon Discount % from the pricing table above
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'content' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {/* Features Section */}
                                    <div style={{
                                        background: 'rgba(148, 163, 184, 0.06)',
                                        borderRadius: '1rem',
                                        padding: '1.25rem',
                                        border: '1px solid rgba(148, 163, 184, 0.1)'
                                    }}>
                                        <h4 style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            color: '#f97316',
                                            marginBottom: '1rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            ✨ Features & Benefits
                                        </h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <div className="form-group" style={{ margin: 0 }}>
                                                <label className="form-label" style={{ color: '#475569', fontSize: '0.8125rem' }}>Why Choose EDIZO</label>
                                                <textarea
                                                    className="form-input"
                                                    style={{ minHeight: '140px', resize: 'vertical' }}
                                                    value={formData.whyChoose}
                                                    onChange={e => setFormData({ ...formData, whyChoose: e.target.value })}
                                                    placeholder="Enter one feature per line:&#10;Expert mentors&#10;Real projects&#10;Certificate"
                                                />
                                                <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.375rem' }}>One feature per line (max 7)</p>
                                            </div>
                                            <div className="form-group" style={{ margin: 0 }}>
                                                <label className="form-label" style={{ color: '#475569', fontSize: '0.8125rem' }}>Benefits</label>
                                                <textarea
                                                    className="form-input"
                                                    style={{ minHeight: '140px', resize: 'vertical' }}
                                                    value={formData.benefits}
                                                    onChange={e => setFormData({ ...formData, benefits: e.target.value })}
                                                    placeholder="Enter one benefit per line:&#10;Industry recognition&#10;Career growth&#10;Networking"
                                                />
                                                <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.375rem' }}>One benefit per line (max 7)</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Syllabus Section */}
                                    <div style={{
                                        background: 'rgba(148, 163, 184, 0.06)',
                                        borderRadius: '1rem',
                                        padding: '1.25rem',
                                        border: '1px solid rgba(148, 163, 184, 0.1)'
                                    }}>
                                        <h4 style={{
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            color: '#f97316',
                                            marginBottom: '1rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}>
                                            <List size={14} /> Syllabus by Duration
                                        </h4>
                                        <div style={{ display: 'grid', gap: '1rem' }}>
                                            {[
                                                { label: '15 Days Program', key: 'syl15d', color: '#94a3b8' },
                                                { label: '1 Month Program', key: 'syl1m', color: '#22c55e' },
                                                { label: '2 Months Program', key: 'syl2m', color: '#3b82f6' },
                                                { label: '3 Months Program', key: 'syl3m', color: '#f97316' }
                                            ].map((item, i) => (
                                                <div key={i} className="form-group" style={{ margin: 0 }}>
                                                    <label className="form-label" style={{
                                                        color: '#475569',
                                                        fontSize: '0.8125rem',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem'
                                                    }}>
                                                        <span style={{
                                                            width: '8px',
                                                            height: '8px',
                                                            borderRadius: '50%',
                                                            background: item.color
                                                        }} />
                                                        {item.label}
                                                    </label>
                                                    <input
                                                        className="form-input"
                                                        value={(formData as any)[item.key]}
                                                        onChange={e => setFormData({ ...formData, [item.key]: e.target.value })}
                                                        placeholder="HTML, CSS, JavaScript, React, Node.js"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                        <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.75rem' }}>
                                            Enter comma-separated topics for each duration
                                        </p>
                                    </div>
                                </div>
                            )}

                        </form>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={handleFormSubmit} disabled={submitting}>{submitting ? 'Saving...' : 'Save Internship'}</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteIndex !== null && (
                <div className="modal-overlay">
                    <div className="modal" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h3 style={{ fontWeight: '600', color: '#1e293b' }}>Confirm Delete</h3>
                        </div>
                        <div className="modal-body">
                            <p style={{ color: '#334155' }}>Are you sure? This cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setDeleteIndex(null)}>Cancel</button>
                            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
