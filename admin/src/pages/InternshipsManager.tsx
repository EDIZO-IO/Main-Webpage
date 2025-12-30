
import { useEffect, useState } from 'react';
import { Plus, Trash2, Search, RefreshCw, Edit2, X, AlertCircle, FileText, DollarSign, List, Image as ImageIcon } from 'lucide-react';

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
                    <h1 className="text-2xl font-bold">Internships</h1>
                    <p className="text-gray-400">Manage internship opportunities</p>
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
                                <tr key={internship.rowIndex} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="p-4 font-mono text-sm text-gray-400">{internship.id}</td>
                                    <td className="p-4 font-medium">{internship.title}</td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded-full bg-blue-900/30 text-blue-400 text-xs border border-blue-900">
                                            {internship.category}
                                        </span>
                                    </td>
                                    <td className="p-4">{internship.mode}</td>
                                    <td className="p-4">₹{internship.price1Month}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                className="p-2 hover:bg-gray-700 rounded-lg text-blue-400 transition-colors"
                                                onClick={() => handleEditClick(internship)}
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                className="p-2 hover:bg-red-900/30 rounded-lg text-red-500 transition-colors"
                                                onClick={() => setDeleteIndex(internship.rowIndex)}
                                            >
                                                <Trash2 size={16} />
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
                    <div className="bg-[#1e293b] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-gray-700" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-[#0f172a] rounded-t-2xl">
                            <h2 className="text-xl font-bold">{modalMode === 'add' ? 'New Internship' : 'Edit Internship'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-700 bg-[#0f172a]">
                            <button
                                className={`px-6 py-3 font-medium text-sm flex gap-2 items-center ${activeTab === 'general' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
                                onClick={() => setActiveTab('general')}
                            >
                                <FileText size={16} /> General Info
                            </button>
                            <button
                                className={`px-6 py-3 font-medium text-sm flex gap-2 items-center ${activeTab === 'pricing' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
                                onClick={() => setActiveTab('pricing')}
                            >
                                <DollarSign size={16} /> Pricing & Coupons
                            </button>
                            <button
                                className={`px-6 py-3 font-medium text-sm flex gap-2 items-center ${activeTab === 'content' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
                                onClick={() => setActiveTab('content')}
                            >
                                <List size={16} /> Content & Syllabus
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6">

                            {activeTab === 'general' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div><label className="text-sm text-gray-400">ID</label><input className="form-input w-full" value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })} /></div>
                                        <div><label className="text-sm text-gray-400">Title</label><input className="form-input w-full" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} /></div>
                                        <div><label className="text-sm text-gray-400">Company</label><input className="form-input w-full" value={formData.company} onChange={e => setFormData({ ...formData, company: e.target.value })} /></div>
                                        <div><label className="text-sm text-gray-400">Category</label>
                                            <select className="form-input w-full" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                                <option>Development</option><option>Design</option><option>Data Science</option><option>Marketing</option><option>Management</option>
                                            </select>
                                        </div>
                                        <div><label className="text-sm text-gray-400">Mode</label>
                                            <select className="form-input w-full" value={formData.mode} onChange={e => setFormData({ ...formData, mode: e.target.value })}>
                                                <option>Online</option><option>Offline</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div><label className="text-sm text-gray-400">Rating</label><input type="number" step="0.1" className="form-input w-full" value={formData.rating} onChange={e => setFormData({ ...formData, rating: e.target.value })} /></div>
                                        <div><label className="text-sm text-gray-400">Image URL</label><input className="form-input w-full" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} /></div>
                                        <div><label className="text-sm text-gray-400">Description</label><textarea className="form-input w-full h-32" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'pricing' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-5 gap-4 text-sm text-gray-400 mb-2">
                                        <div>Duration</div>
                                        <div>Price</div>
                                        <div>Discount (%)</div>
                                        <div>Coupon Disc (%)</div>
                                    </div>

                                    {[
                                        { l: '15 Days', p: 'price15d', d: 'disc15d', c: 'cdisc15d' },
                                        { l: '1 Month', p: 'price1m', d: 'disc1m', c: 'cdisc1m' },
                                        { l: '2 Months', p: 'price2m', d: 'disc2m', c: 'cdisc2m' },
                                        { l: '3 Months', p: 'price3m', d: 'disc3m', c: 'cdisc3m' }
                                    ].map((row, i) => (
                                        <div key={i} className="grid grid-cols-5 gap-4 items-center">
                                            <div className="font-medium text-white">{row.l}</div>
                                            <input type="number" className="form-input" value={(formData as any)[row.p]} onChange={e => setFormData({ ...formData, [row.p]: e.target.value })} />
                                            <input type="number" className="form-input" value={(formData as any)[row.d]} onChange={e => setFormData({ ...formData, [row.d]: e.target.value })} />
                                            <input type="number" className="form-input" value={(formData as any)[row.c]} onChange={e => setFormData({ ...formData, [row.c]: e.target.value })} />
                                        </div>
                                    ))}

                                    <div className="pt-4 border-t border-gray-700">
                                        <label className="text-sm text-gray-400">Coupons (Comma Separated)</label>
                                        <input className="form-input w-full mt-1" value={formData.coupons} onChange={e => setFormData({ ...formData, coupons: e.target.value })} placeholder="SAVE10, SAVE20" />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'content' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-blue-400 font-semibold">Features & Benefits</h3>
                                        <div>
                                            <label className="text-sm text-gray-400">Why Choose Edizo (One per line)</label>
                                            <textarea className="form-input w-full h-32" value={formData.whyChoose} onChange={e => setFormData({ ...formData, whyChoose: e.target.value })} placeholder="Feature 1&#10;Feature 2" />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-400">Benefits (One per line)</label>
                                            <textarea className="form-input w-full h-32" value={formData.benefits} onChange={e => setFormData({ ...formData, benefits: e.target.value })} placeholder="Benefit 1&#10;Benefit 2" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-blue-400 font-semibold">Syllabus (Comma Separated Topics)</h3>
                                        <div><label className="text-sm text-gray-400">15 Days</label><input className="form-input w-full" value={formData.syl15d} onChange={e => setFormData({ ...formData, syl15d: e.target.value })} /></div>
                                        <div><label className="text-sm text-gray-400">1 Month</label><input className="form-input w-full" value={formData.syl1m} onChange={e => setFormData({ ...formData, syl1m: e.target.value })} /></div>
                                        <div><label className="text-sm text-gray-400">2 Months</label><input className="form-input w-full" value={formData.syl2m} onChange={e => setFormData({ ...formData, syl2m: e.target.value })} /></div>
                                        <div><label className="text-sm text-gray-400">3 Months</label><input className="form-input w-full" value={formData.syl3m} onChange={e => setFormData({ ...formData, syl3m: e.target.value })} /></div>
                                    </div>
                                </div>
                            )}

                        </form>

                        <div className="p-6 border-t border-gray-700 bg-[#0f172a] rounded-b-2xl flex justify-end gap-4">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button type="button" className="btn btn-primary" onClick={handleFormSubmit} disabled={submitting}>{submitting ? 'Saving...' : 'Save Internship'}</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteIndex !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1e293b] rounded-2xl max-w-md p-6 border border-gray-700 shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                        <p className="text-gray-300 mb-6">Are you sure? This cannot be undone.</p>
                        <div className="flex justify-end gap-4">
                            <button className="btn btn-secondary" onClick={() => setDeleteIndex(null)}>Cancel</button>
                            <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
