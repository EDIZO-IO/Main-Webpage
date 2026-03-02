import { useEffect, useState } from 'react';
import { Search, RefreshCw, Eye, Trash2, CheckCircle, XCircle, Clock, Mail, Phone, Calendar, DollarSign, FileText } from 'lucide-react';
import { serviceApplicationsAPI, servicesAPI } from '../api/api';
import { toast } from 'react-toastify';

interface Application {
  id: string;
  service_id?: string;
  full_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  budget_range?: string;
  project_description?: string;
  requirements?: string;
  timeline?: string;
  service_type?: string;
  application_status: 'submitted' | 'under_review' | 'accepted' | 'rejected' | 'withdrawn';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_amount?: number;
  review_comments?: string;
  created_at: string;
  service_title?: string;
}

export default function ServiceApplicationsManager() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const [appsRes, servicesRes] = await Promise.all([
        serviceApplicationsAPI.getAll(),
        servicesAPI.getAll()
      ]);

      console.log('Service applications response:', appsRes.data);
      setApplications(appsRes.data.applications || []);
      setServices(servicesRes.data.services || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error(error.response?.data?.error || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await serviceApplicationsAPI.delete(deleteId);
      toast.success('Service application deleted successfully');
      setDeleteId(null);
      fetchApplications();
    } catch (error: any) {
      console.error('Error deleting application:', error);
      toast.error(error.response?.data?.error || 'Failed to delete application');
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await serviceApplicationsAPI.update(id, { application_status: newStatus });
      toast.success('Status updated successfully');

      setApplications(apps => apps.map(app =>
        app.id === id ? { ...app, application_status: newStatus } : app
      ));

      if (selectedApp && selectedApp.id === id) {
        setSelectedApp(prev => prev ? { ...prev, application_status: newStatus } : null);
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.error || 'Failed to update status');
    }
  };

  const handlePaymentStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await serviceApplicationsAPI.update(id, { payment_status: newStatus });
      toast.success('Payment status updated');

      setApplications(apps => apps.map(app =>
        app.id === id ? { ...app, payment_status: newStatus } : app
      ));
    } catch (error: any) {
      console.error('Error updating payment status:', error);
      toast.error('Failed to update payment status');
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.service_title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.application_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <span className="badge badge-success"><CheckCircle size={12} style={{ marginRight: '4px' }} />Accepted</span>;
      case 'rejected':
        return <span className="badge badge-danger"><XCircle size={12} style={{ marginRight: '4px' }} />Rejected</span>;
      case 'under_review':
        return <span className="badge badge-warning"><Clock size={12} style={{ marginRight: '4px' }} />Under Review</span>;
      case 'withdrawn':
        return <span className="badge" style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }}>Withdrawn</span>;
      default:
        return <span className="badge badge-primary"><Clock size={12} style={{ marginRight: '4px' }} />Submitted</span>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="badge badge-success">Paid</span>;
      case 'failed':
        return <span className="badge badge-danger">Failed</span>;
      case 'refunded':
        return <span className="badge" style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }}>Refunded</span>;
      default:
        return <span className="badge badge-warning">Pending</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = {
    total: applications.length,
    submitted: applications.filter(a => a.application_status === 'submitted').length,
    underReview: applications.filter(a => a.application_status === 'under_review').length,
    accepted: applications.filter(a => a.application_status === 'accepted').length,
    rejected: applications.filter(a => a.application_status === 'rejected').length,
    paid: applications.filter(a => a.payment_status === 'paid').length,
    pending: applications.filter(a => a.payment_status === 'pending').length
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
          <h1>Service Applications</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Manage service inquiries and project requests</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)' }}>
            <FileText size={24} color="#3b82f6" />
          </div>
          <div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(249, 115, 22, 0.15)' }}>
            <Clock size={24} color="#f97316" />
          </div>
          <div>
            <div className="stat-value">{stats.submitted}</div>
            <div className="stat-label">Submitted</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)' }}>
            <Eye size={24} color="#a855f7" />
          </div>
          <div>
            <div className="stat-value">{stats.underReview}</div>
            <div className="stat-label">Under Review</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.15)' }}>
            <CheckCircle size={24} color="#22c55e" />
          </div>
          <div>
            <div className="stat-value">{stats.accepted}</div>
            <div className="stat-label">Accepted</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)' }}>
            <DollarSign size={24} color="#ef4444" />
          </div>
          <div>
            <div className="stat-value">{stats.paid}</div>
            <div className="stat-label">Paid</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search by name, email, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <select
            className="form-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="under_review">Under Review</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
          <button className="btn btn-secondary" onClick={fetchApplications}>
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Applicant</th>
                <th>Company</th>
                <th>Service</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Payment</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id}>
                  <td style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {formatDate(app.created_at).split(',')[0]}
                  </td>
                  <td>
                    <div style={{ fontWeight: '600', color: '#1e293b' }}>{app.full_name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.email}</div>
                  </td>
                  <td>
                    <div style={{ color: '#334155' }}>{app.company_name || 'N/A'}</div>
                  </td>
                  <td>
                    <div style={{ color: '#334155' }}>{app.service_title || app.service_type || 'N/A'}</div>
                  </td>
                  <td>
                    <span className="badge badge-primary">{app.budget_range || 'Not specified'}</span>
                  </td>
                  <td>{getStatusBadge(app.application_status)}</td>
                  <td>{getPaymentStatusBadge(app.payment_status)}</td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedApp(app)}
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteId(app.id)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredApps.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <FileText size={48} style={{ color: '#e2e8f0' }} />
                      <p>No service applications found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedApp && (
        <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3>Application Details</h3>
              <button onClick={() => setSelectedApp(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <XCircle size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Header Info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>{selectedApp.full_name}</h3>
                  <p style={{ color: '#f97316', fontWeight: '600', margin: 0 }}>
                    {selectedApp.service_title || selectedApp.service_type}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
                    <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    {formatDate(selectedApp.created_at)}
                  </div>
                  {getStatusBadge(selectedApp.application_status)}
                </div>
              </div>

              {/* Contact Info */}
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Contact Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Email</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                      <Mail size={14} style={{ color: '#64748b' }} />
                      {selectedApp.email}
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Phone</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155' }}>
                      <Phone size={14} style={{ color: '#64748b' }} />
                      {selectedApp.phone || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Company & Budget Info */}
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Project Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Company</p>
                    <p style={{ color: '#334155', fontWeight: '600' }}>{selectedApp.company_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Budget</p>
                    <p style={{ color: '#334155', fontWeight: '600' }}>{selectedApp.budget_range || 'Not specified'}</p>
                  </div>
                </div>
                {selectedApp.project_description && (
                  <div style={{ marginTop: '1rem' }}>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Project Description</p>
                    <p style={{ color: '#334155', lineHeight: 1.6 }}>{selectedApp.project_description}</p>
                  </div>
                )}
              </div>

              {/* Requirements & Timeline */}
              {(selectedApp.requirements || selectedApp.timeline) && (
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Requirements</h4>
                  {selectedApp.requirements && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <p style={{ color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{selectedApp.requirements}</p>
                    </div>
                  )}
                  {selectedApp.timeline && (
                    <div>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Timeline</p>
                      <p style={{ color: '#334155', fontWeight: '600' }}>{selectedApp.timeline}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Info */}
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Payment Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Amount</p>
                    <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#16a34a' }}>₹{selectedApp.payment_amount || 0}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Status</p>
                    {getPaymentStatusBadge(selectedApp.payment_status)}
                  </div>
                </div>
              </div>

              {/* Project Description */}
              {selectedApp.project_description && (
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Project Description</h4>
                  <p style={{ color: '#334155', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{selectedApp.project_description}</p>
                </div>
              )}

              {/* Actions */}
              <div style={{ paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Update Application Status:</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className={`btn btn-sm ${selectedApp.application_status === 'under_review' ? 'btn-warning' : 'btn-secondary'}`}
                      onClick={() => handleStatusUpdate(selectedApp.id, 'under_review')}
                    >
                      Review
                    </button>
                    <button
                      className={`btn btn-sm ${selectedApp.application_status === 'accepted' ? 'btn-success' : 'btn-secondary'}`}
                      onClick={() => handleStatusUpdate(selectedApp.id, 'accepted')}
                    >
                      Accept
                    </button>
                    <button
                      className={`btn btn-sm ${selectedApp.application_status === 'rejected' ? 'btn-danger' : 'btn-secondary'}`}
                      onClick={() => handleStatusUpdate(selectedApp.id, 'rejected')}
                    >
                      Reject
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Update Payment Status:</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      className={`btn btn-sm ${selectedApp.payment_status === 'paid' ? 'btn-success' : 'btn-secondary'}`}
                      onClick={() => handlePaymentStatusUpdate(selectedApp.id, 'paid')}
                    >
                      Paid
                    </button>
                    <button
                      className={`btn btn-sm ${selectedApp.payment_status === 'pending' ? 'btn-warning' : 'btn-secondary'}`}
                      onClick={() => handlePaymentStatusUpdate(selectedApp.id, 'pending')}
                    >
                      Pending
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
            </div>
            <div className="modal-body">
              <p style={{ color: '#334155' }}>Are you sure you want to delete this application? This cannot be undone.</p>
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
