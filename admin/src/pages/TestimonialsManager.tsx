import { useEffect, useState } from 'react';
import { Star, Trash2, Search, RefreshCw, CheckCircle, XCircle, Eye } from 'lucide-react';
import { testimonialsAPI } from '../api/api';
import { toast } from 'react-toastify';

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await testimonialsAPI.getAll();
      setTestimonials(response.data.testimonials || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleApprove = async (id, isApproved) => {
    try {
      await testimonialsAPI.update(id, { is_approved: !isApproved });
      toast.success(isApproved ? 'Testimonial disapproved' : 'Testimonial approved');
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to update testimonial');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await testimonialsAPI.delete(deleteId);
      toast.success('Testimonial deleted successfully');
      setDeleteId(null);
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to delete testimonial');
    }
  };

  const filteredTestimonials = testimonials.filter(t =>
    t.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            fill={i < rating ? '#fbbf24' : 'none'}
            color={i < rating ? '#fbbf24' : '#d1d5db'}
          />
        ))}
      </div>
    );
  };

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
        <div>
          <h1>Testimonials & Reviews</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage customer testimonials and reviews</p>
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
              placeholder="Search testimonials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <button className="btn btn-secondary" onClick={fetchTestimonials}>
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Rating</th>
                <th>Content</th>
                <th>Service Type</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTestimonials.map((testimonial) => (
                <tr key={testimonial.id}>
                  <td>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{testimonial.customer_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{testimonial.customer_email}</div>
                  </td>
                  <td>{renderStars(testimonial.rating)}</td>
                  <td>
                    <div style={{ maxWidth: '300px', fontSize: '0.875rem', color: '#475569' }}>
                      {testimonial.content?.substring(0, 80)}...
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{testimonial.service_type || 'General'}</span>
                  </td>
                  <td>
                    {testimonial.is_approved ? (
                      <span className="badge badge-success">
                        <CheckCircle size={12} style={{ marginRight: '4px' }} />
                        Approved
                      </span>
                    ) : (
                      <span className="badge badge-warning">
                        <XCircle size={12} style={{ marginRight: '4px' }} />
                        Pending
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        className={`btn btn-sm ${testimonial.is_approved ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handleApprove(testimonial.id, testimonial.is_approved)}
                        title={testimonial.is_approved ? 'Disapprove' : 'Approve'}
                      >
                        {testimonial.is_approved ? 'Unapprove' : 'Approve'}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteId(testimonial.id)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTestimonials.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    No testimonials found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteId !== null && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Delete Testimonial</h3>
            </div>
            <div className="modal-body">
              <p style={{ color: '#334155' }}>Are you sure you want to delete this testimonial? This action cannot be undone.</p>
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
