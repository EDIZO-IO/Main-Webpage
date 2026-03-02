import { useEffect, useState } from 'react';
import { Plus, Trash2, Search, RefreshCw, Edit2, X, Package } from 'lucide-react';
import { servicesAPI } from '../api/api';
import { toast } from 'react-toastify';

interface Service {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  short_description: string;
  description: string;
  cta_text: string;
  category: string;
  tags: string[];
  features: string[];
  benefits: string[];
  is_active: boolean;
  is_featured: boolean;
  display_order: number;
}

export default function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    short_description: '',
    description: '',
    cta_text: 'Learn More',
    category: 'Development',
    tags: '',
    features: '',
    benefits: '',
    is_active: true,
    is_featured: false,
    display_order: 0
  });

  const [submitting, setSubmitting] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await servicesAPI.getAll();
      setServices(response.data.services || []);
    } catch (error: any) {
      console.error('Error fetching services:', error);
      toast.error(error.response?.data?.error || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await servicesAPI.delete(deleteId);
      toast.success('Service deleted successfully');
      setDeleteId(null);
      fetchServices();
    } catch (error: any) {
      console.error('Error deleting service:', error);
      toast.error(error.response?.data?.error || 'Failed to delete service');
    }
  };

  const handleEditClick = async (service: Service) => {
    setModalMode('edit');
    setEditingId(service.id);

    setFormData({
      title: service.title,
      slug: service.slug,
      subtitle: service.subtitle || '',
      short_description: service.short_description || '',
      description: service.description || '',
      cta_text: service.cta_text || 'Learn More',
      category: service.category,
      tags: service.tags?.join(', ') || '',
      features: service.features?.join('\n') || '',
      benefits: service.benefits?.join('\n') || '',
      is_active: service.is_active,
      is_featured: service.is_featured,
      display_order: service.display_order
    });
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = {
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        features: formData.features.split('\n').map(f => f.trim()).filter(Boolean),
        benefits: formData.benefits.split('\n').map(b => b.trim()).filter(Boolean)
      };

      if (modalMode === 'add') {
        await servicesAPI.create(data);
        toast.success('Service created successfully');
      } else if (editingId) {
        await servicesAPI.update(editingId, data);
        toast.success('Service updated successfully');
      }

      setShowModal(false);
      fetchServices();
    } catch (error: any) {
      console.error('Error saving service:', error);
      toast.error(error.response?.data?.error || 'Failed to save service');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredServices = services.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1>Services</h1>
            <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage your service offerings</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setModalMode('add');
              setFormData({
                title: '',
                slug: '',
                subtitle: '',
                short_description: '',
                description: '',
                cta_text: 'Learn More',
                category: 'Development',
                tags: '',
                features: '',
                benefits: '',
                is_active: true,
                is_featured: false,
                display_order: 0
              });
              setShowModal(true);
            }}
          >
            <Plus size={18} />
            Add Service
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
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <button className="btn btn-secondary" onClick={fetchServices}>
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Services Table */}
      <div className="card">
        {filteredServices.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
            <Package size={48} style={{ margin: '0 auto 1rem', color: '#e2e8f0' }} />
            <p>No services found</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>{service.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>{service.short_description?.substring(0, 60)}...</div>
                    </td>
                    <td>
                      <span className="badge badge-primary">{service.category}</span>
                    </td>
                    <td>
                      {service.is_active ? (
                        <span className="badge badge-success">Active</span>
                      ) : (
                        <span className="badge" style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>Inactive</span>
                      )}
                    </td>
                    <td style={{ color: '#64748b' }}>{service.display_order}</td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleEditClick(service)}
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteId(service.id)}
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
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h3>{modalMode === 'add' ? 'New Service' : 'Edit Service'}</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Basic Info */}
                <div className="form-group span-2">
                  <label className="form-label">Title *</label>
                  <input
                    className="form-input"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') })}
                    placeholder="Web Development"
                    required
                  />
                </div>
                <div className="form-group span-2">
                  <label className="form-label">Subtitle</label>
                  <input
                    className="form-input"
                    value={formData.subtitle}
                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Scalable & High-Performance Websites"
                  />
                </div>
                <div className="form-group span-2">
                  <label className="form-label">Slug</label>
                  <input
                    className="form-input"
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="web-development"
                    style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}
                  />
                </div>
                <div className="form-group span-2">
                  <label className="form-label">CTA Text</label>
                  <input
                    className="form-input"
                    value={formData.cta_text}
                    onChange={e => setFormData({ ...formData, cta_text: e.target.value })}
                    placeholder="Build Your Dream Website"
                  />
                </div>
                <div className="form-group span-2">
                  <label className="form-label">Short Description</label>
                  <input
                    className="form-input"
                    value={formData.short_description}
                    onChange={e => setFormData({ ...formData, short_description: e.target.value })}
                    placeholder="Brief description..."
                  />
                </div>
                <div className="form-group span-2">
                  <label className="form-label">Full Description</label>
                  <textarea
                    className="form-input"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder="Detailed service description..."
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
                    <option value="Marketing">Marketing</option>
                    <option value="SEO">SEO</option>
                    <option value="Consulting">Consulting</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.display_order}
                    onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                  />
                </div>

                {/* Tags */}
                <div className="form-group span-2">
                  <label className="form-label">Tags (comma separated)</label>
                  <input
                    className="form-input"
                    value={formData.tags}
                    onChange={e => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>

                {/* Features */}
                <div className="form-group span-2">
                  <label className="form-label">Features (one per line)</label>
                  <textarea
                    className="form-input"
                    value={formData.features}
                    onChange={e => setFormData({ ...formData, features: e.target.value })}
                    rows={4}
                    placeholder="Responsive Design&#10;SEO Optimization&#10;Fast Performance"
                  />
                </div>

                {/* Benefits */}
                <div className="form-group span-2">
                  <label className="form-label">Benefits (one per line)</label>
                  <textarea
                    className="form-input"
                    value={formData.benefits}
                    onChange={e => setFormData({ ...formData, benefits: e.target.value })}
                    rows={4}
                    placeholder="Increased user engagement&#10;Better conversion rates"
                  />
                </div>

                <div className="form-group span-2" style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: '#f97316' }}
                    />
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#475569' }}>Active</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
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
                  {submitting ? 'Saving...' : (modalMode === 'add' ? 'Create Service' : 'Update Service')}
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
              <h3>Delete Service</h3>
            </div>
            <div className="modal-body">
              <p style={{ color: '#334155' }}>Are you sure you want to delete this service? This action cannot be undone.</p>
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
