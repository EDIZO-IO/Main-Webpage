import { useEffect, useState } from 'react';
import { Plus, Trash2, Search, RefreshCw, Edit2, X, Package } from 'lucide-react';
import { internshipsAPI } from '../api/api';
import { toast } from 'react-toastify';

interface Internship {
  id: string;
  internship_id: string;
  title: string;
  category: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  company: string;
  rating: number;
  description: string;
  why_choose_edizo_1?: string;
  why_choose_edizo_2?: string;
  why_choose_edizo_3?: string;
  why_choose_edizo_4?: string;
  why_choose_edizo_5?: string;
  why_choose_edizo_6?: string;
  benefit_1?: string;
  benefit_2?: string;
  benefit_3?: string;
  benefit_4?: string;
  benefit_5?: string;
  benefit_6?: string;
  benefit_7?: string;
  price_15_days: number;
  price_1_month: number;
  price_2_months: number;
  price_3_months: number;
  discount_15_days: number;
  discount_1_month: number;
  discount_2_months: number;
  discount_3_months: number;
  coupon_code: string;
  coupon_discount_15_days: number;
  coupon_discount_1_month: number;
  coupon_discount_2_months: number;
  coupon_discount_3_months: number;
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
}

export default function InternshipsManager() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    internship_id: '',
    title: '',
    category: 'Development',
    mode: 'Online' as 'Online' | 'Offline' | 'Hybrid',
    company: 'EDIZO',
    rating: 4.5,
    description: '',

    // Why Choose Edizo (6 items)
    why_choose_edizo_1: '100% Internship Certification',
    why_choose_edizo_2: 'Real-Time, Hands-On Project for Each Course',
    why_choose_edizo_3: 'Learn from Experienced Industry Mentors',
    why_choose_edizo_4: 'Placement Guidance & Portfolio Support',
    why_choose_edizo_5: 'Paid Internship Opportunities',
    why_choose_edizo_6: 'Gain In-Demand Industry Skills',

    // Benefits (7 items)
    benefit_1: 'Build Strong Resume with Real-Time Projects',
    benefit_2: 'Internship Certificate Recognized by Companies',
    benefit_3: 'Boost Confidence for Interviews & Job Roles',
    benefit_4: 'Get Exposure to Professional Tools & Platforms',
    benefit_5: '',
    benefit_6: '',
    benefit_7: '',

    // Pricing
    price_15_days: 1499,
    price_1_month: 2499,
    price_2_months: 3999,
    price_3_months: 5499,

    // Discounts
    discount_15_days: 0,
    discount_1_month: 0,
    discount_2_months: 0,
    discount_3_months: 0,

    // Coupon
    coupon_code: 'EDIZOCOP',
    coupon_discount_15_days: 0,
    coupon_discount_1_month: 0,
    coupon_discount_2_months: 0,
    coupon_discount_3_months: 0,
    
    is_active: true,
    is_featured: false,
    display_order: 0
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const response = await internshipsAPI.getAll();
      setInternships(response.data.internships || []);
    } catch (error: any) {
      console.error('Error fetching internships:', error);
      toast.error(error.response?.data?.error || 'Failed to fetch internships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await internshipsAPI.delete(deleteId);
      toast.success('Internship deleted successfully');
      setDeleteId(null);
      fetchInternships();
    } catch (error: any) {
      console.error('Error deleting internship:', error);
      toast.error(error.response?.data?.error || 'Failed to delete internship');
    }
  };

  const handleEditClick = async (internship: Internship) => {
    setModalMode('edit');
    setEditingId(internship.id);

    setFormData({
      internship_id: internship.internship_id || '',
      title: internship.title,
      category: internship.category,
      mode: internship.mode,
      company: internship.company,
      rating: internship.rating,
      description: internship.description,
      why_choose_edizo_1: internship.why_choose_edizo_1 || formData.why_choose_edizo_1,
      why_choose_edizo_2: internship.why_choose_edizo_2 || formData.why_choose_edizo_2,
      why_choose_edizo_3: internship.why_choose_edizo_3 || formData.why_choose_edizo_3,
      why_choose_edizo_4: internship.why_choose_edizo_4 || formData.why_choose_edizo_4,
      why_choose_edizo_5: internship.why_choose_edizo_5 || formData.why_choose_edizo_5,
      why_choose_edizo_6: internship.why_choose_edizo_6 || formData.why_choose_edizo_6,
      benefit_1: internship.benefit_1 || formData.benefit_1,
      benefit_2: internship.benefit_2 || formData.benefit_2,
      benefit_3: internship.benefit_3 || formData.benefit_3,
      benefit_4: internship.benefit_4 || formData.benefit_4,
      benefit_5: internship.benefit_5 || '',
      benefit_6: internship.benefit_6 || '',
      benefit_7: internship.benefit_7 || '',
      price_15_days: internship.price_15_days || 0,
      price_1_month: internship.price_1_month || 0,
      price_2_months: internship.price_2_months || 0,
      price_3_months: internship.price_3_months || 0,
      discount_15_days: internship.discount_15_days || 0,
      discount_1_month: internship.discount_1_month || 0,
      discount_2_months: internship.discount_2_months || 0,
      discount_3_months: internship.discount_3_months || 0,
      coupon_code: internship.coupon_code || 'EDIZOCOP',
      coupon_discount_15_days: internship.coupon_discount_15_days || 0,
      coupon_discount_1_month: internship.coupon_discount_1_month || 0,
      coupon_discount_2_months: internship.coupon_discount_2_months || 0,
      coupon_discount_3_months: internship.coupon_discount_3_months || 0,
      is_active: internship.is_active,
      is_featured: internship.is_featured,
      display_order: internship.display_order
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        ...formData,
        slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      };

      if (modalMode === 'add') {
        await internshipsAPI.create(data);
        toast.success('Internship created successfully');
      } else if (editingId) {
        await internshipsAPI.update(editingId, data);
        toast.success('Internship updated successfully');
      }

      setShowModal(false);
      fetchInternships();
    } catch (error: any) {
      console.error('Error saving internship:', error);
      toast.error(error.response?.data?.error || 'Failed to save internship');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredInternships = internships.filter(i =>
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.internship_id.toLowerCase().includes(searchTerm.toLowerCase())
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
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1>Internships</h1>
            <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage internship opportunities</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setModalMode('add');
              setFormData({
                internship_id: `INT-${Date.now()}`,
                title: '',
                category: 'Development',
                mode: 'Online',
                company: 'EDIZO',
                rating: 4.5,
                description: '',
                why_choose_edizo_1: '100% Internship Certification',
                why_choose_edizo_2: 'Real-Time, Hands-On Project for Each Course',
                why_choose_edizo_3: 'Learn from Experienced Industry Mentors',
                why_choose_edizo_4: 'Placement Guidance & Portfolio Support',
                why_choose_edizo_5: 'Paid Internship Opportunities',
                why_choose_edizo_6: 'Gain In-Demand Industry Skills',
                benefit_1: 'Build Strong Resume with Real-Time Projects',
                benefit_2: 'Internship Certificate Recognized by Companies',
                benefit_3: 'Boost Confidence for Interviews & Job Roles',
                benefit_4: 'Get Exposure to Professional Tools & Platforms',
                benefit_5: '',
                benefit_6: '',
                benefit_7: '',
                price_15_days: 1499,
                price_1_month: 2499,
                price_2_months: 3999,
                price_3_months: 5499,
                discount_15_days: 0,
                discount_1_month: 0,
                discount_2_months: 0,
                discount_3_months: 0,
                coupon_code: 'EDIZOCOP',
                coupon_discount_15_days: 0,
                coupon_discount_1_month: 0,
                coupon_discount_2_months: 0,
                coupon_discount_3_months: 0,
                is_active: true,
                is_featured: false,
                display_order: 0
              });
              setShowModal(true);
            }}
          >
            <Plus size={18} />
            Add Internship
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search internships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <button className="btn btn-secondary" onClick={fetchInternships}>
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Internships Table */}
      <div className="card">
        {filteredInternships.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <Package size={48} style={{ margin: '0 auto 1rem', color: '#e2e8f0' }} />
            <p>No internships found</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Mode</th>
                  <th>Price (1m)</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInternships.map((internship) => (
                  <tr key={internship.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: '#64748b' }}>{internship.internship_id}</td>
                    <td>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>{internship.title}</div>
                    </td>
                    <td>
                      <span className="badge badge-primary">{internship.category}</span>
                    </td>
                    <td style={{ color: '#475569' }}>{internship.mode}</td>
                    <td style={{ fontWeight: '600', color: '#1e293b' }}>₹{internship.price_1_month || 0}</td>
                    <td>
                      {internship.is_active ? (
                        <span className="badge badge-success">Active</span>
                      ) : (
                        <span className="badge" style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>Inactive</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleEditClick(internship)}
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteId(internship.id)}
                          title="Delete"
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px', maxHeight: '90vh', overflow: 'auto' }}>
            <div className="modal-header">
              <h3>{modalMode === 'add' ? 'New Internship' : 'Edit Internship'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Basic Info */}
                <div className="form-group">
                  <label className="form-label">Internship ID</label>
                  <input
                    className="form-input"
                    value={formData.internship_id}
                    onChange={e => setFormData({ ...formData, internship_id: e.target.value })}
                    placeholder="INT-2024-001"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Company</label>
                  <input
                    className="form-input"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    placeholder="EDIZO"
                  />
                </div>
                <div className="form-group span-2">
                  <label className="form-label">Title *</label>
                  <input
                    className="form-input"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Web Development Internship"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Development">Development</option>
                    <option value="Design">Design</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Management">Management</option>
                    <option value="HR">HR</option>
                    <option value="Java">Java</option>
                    <option value="Python">Python</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="C#">C#</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Mode</label>
                  <select
                    className="form-input"
                    value={formData.mode}
                    onChange={e => setFormData({ ...formData, mode: e.target.value as 'Online' | 'Offline' | 'Hybrid' })}
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="form-group span-2">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-input"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Internship description..."
                  />
                </div>

                {/* Why Choose Edizo Section */}
                <div className="form-group span-2">
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#f97316', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>Why Choose Edizo</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>Point 1</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.why_choose_edizo_1}
                        onChange={e => setFormData({ ...formData, why_choose_edizo_1: e.target.value })}
                        placeholder="Why choose edizo 1..."
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>Point 2</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.why_choose_edizo_2}
                        onChange={e => setFormData({ ...formData, why_choose_edizo_2: e.target.value })}
                        placeholder="Why choose edizo 2..."
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>Point 3</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.why_choose_edizo_3}
                        onChange={e => setFormData({ ...formData, why_choose_edizo_3: e.target.value })}
                        placeholder="Why choose edizo 3..."
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>Point 4</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.why_choose_edizo_4}
                        onChange={e => setFormData({ ...formData, why_choose_edizo_4: e.target.value })}
                        placeholder="Why choose edizo 4..."
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>Point 5</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.why_choose_edizo_5}
                        onChange={e => setFormData({ ...formData, why_choose_edizo_5: e.target.value })}
                        placeholder="Why choose edizo 5..."
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>Point 6</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.why_choose_edizo_6}
                        onChange={e => setFormData({ ...formData, why_choose_edizo_6: e.target.value })}
                        placeholder="Why choose edizo 6..."
                      />
                    </div>
                  </div>
                </div>

                {/* Benefits Section */}
                <div className="form-group span-2">
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#16a34a', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>Benefits</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>Benefit 1</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.benefit_1}
                        onChange={e => setFormData({ ...formData, benefit_1: e.target.value })}
                        placeholder="Benefit 1..."
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>Benefit 2</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.benefit_2}
                        onChange={e => setFormData({ ...formData, benefit_2: e.target.value })}
                        placeholder="Benefit 2..."
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>Benefit 3</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.benefit_3}
                        onChange={e => setFormData({ ...formData, benefit_3: e.target.value })}
                        placeholder="Benefit 3..."
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>Benefit 4</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.benefit_4}
                        onChange={e => setFormData({ ...formData, benefit_4: e.target.value })}
                        placeholder="Benefit 4..."
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>Benefit 5</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.benefit_5}
                        onChange={e => setFormData({ ...formData, benefit_5: e.target.value })}
                        placeholder="Benefit 5..."
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>Benefit 6</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.benefit_6}
                        onChange={e => setFormData({ ...formData, benefit_6: e.target.value })}
                        placeholder="Benefit 6..."
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>Benefit 7</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.benefit_7}
                        onChange={e => setFormData({ ...formData, benefit_7: e.target.value })}
                        placeholder="Benefit 7..."
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Section */}
                <div className="form-group span-2">
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#f97316', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>Pricing (₹)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>15 Days</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.price_15_days}
                        onChange={e => setFormData({ ...formData, price_15_days: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>1 Month</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.price_1_month}
                        onChange={e => setFormData({ ...formData, price_1_month: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>2 Months</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.price_2_months}
                        onChange={e => setFormData({ ...formData, price_2_months: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>3 Months</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.price_3_months}
                        onChange={e => setFormData({ ...formData, price_3_months: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>

                {/* Discount Section */}
                <div className="form-group span-2">
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#16a34a', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>Discount (%)</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>15 Days</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.discount_15_days}
                        onChange={e => setFormData({ ...formData, discount_15_days: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>1 Month</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.discount_1_month}
                        onChange={e => setFormData({ ...formData, discount_1_month: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>2 Months</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.discount_2_months}
                        onChange={e => setFormData({ ...formData, discount_2_months: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>3 Months</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.discount_3_months}
                        onChange={e => setFormData({ ...formData, discount_3_months: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="form-group span-2">
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#8b5cf6', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>Coupon Code</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>Coupon Code</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.coupon_code}
                        onChange={e => setFormData({ ...formData, coupon_code: e.target.value.toUpperCase() })}
                        placeholder="EDIZOCOP"
                        maxLength={50}
                      />
                    </div>
                  </div>
                  <h5 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem' }}>Coupon Discount (%)</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>15 Days</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.coupon_discount_15_days}
                        onChange={e => setFormData({ ...formData, coupon_discount_15_days: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>1 Month</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.coupon_discount_1_month}
                        onChange={e => setFormData({ ...formData, coupon_discount_1_month: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>2 Months</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.coupon_discount_2_months}
                        onChange={e => setFormData({ ...formData, coupon_discount_2_months: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.25rem', display: 'block' }}>3 Months</label>
                      <input
                        type="number"
                        className="form-input"
                        value={formData.coupon_discount_3_months}
                        onChange={e => setFormData({ ...formData, coupon_discount_3_months: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group span-2" style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(formData.is_active)}
                      onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: '#f97316' }}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Active</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={Boolean(formData.is_featured)}
                      onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: '#f97316' }}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Featured</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : (modalMode === 'add' ? 'Create Internship' : 'Update Internship')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Delete Internship</h3>
            </div>
            <div className="modal-body">
              <p style={{ color: '#334155' }}>Are you sure you want to delete this internship? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
