import { useEffect, useState } from 'react';
import { Trash2, Search, RefreshCw, Mail, Phone, User, MessageSquare, CheckCircle, XCircle, Calendar, Eye } from 'lucide-react';
import { contactAPI } from '../api/api';
import { toast } from 'react-toastify';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  service_interest: string;
  is_read: boolean;
  replied: boolean;
  admin_notes: string;
  created_at: string;
}

export default function ContactSubmissionsManager() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await contactAPI.getAll();
      setSubmissions(response.data.submissions || []);
    } catch (error: any) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to fetch contact submissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleMarkAsRead = async (id: string, currentStatus: boolean) => {
    try {
      await contactAPI.update(id, { is_read: !currentStatus });
      toast.success(currentStatus ? 'Marked as unread' : 'Marked as read');
      fetchSubmissions();
    } catch (error: any) {
      toast.error('Failed to update submission');
    }
  };

  const handleMarkAsReplied = async (id: string, currentStatus: boolean) => {
    try {
      await contactAPI.update(id, { replied: !currentStatus });
      toast.success(currentStatus ? 'Marked as not replied' : 'Marked as replied');
      fetchSubmissions();
    } catch (error: any) {
      toast.error('Failed to update submission');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await contactAPI.delete(deleteId);
      toast.success('Submission deleted successfully');
      setDeleteId(null);
      fetchSubmissions();
    } catch (error: any) {
      toast.error('Failed to delete submission');
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (filterStatus === 'unread') {
      matchesStatus = !submission.is_read;
    } else if (filterStatus === 'replied') {
      matchesStatus = submission.replied;
    } else if (filterStatus === 'pending') {
      matchesStatus = !submission.replied;
    }
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = {
    total: submissions.length,
    unread: submissions.filter(s => !s.is_read).length,
    replied: submissions.filter(s => s.replied).length,
    pending: submissions.filter(s => !s.replied).length
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
          <h1>Contact Submissions</h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>View and manage contact form messages</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)' }}>
            <MessageSquare size={24} color="#3b82f6" />
          </div>
          <div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Messages</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)' }}>
            <XCircle size={24} color="#ef4444" />
          </div>
          <div>
            <div className="stat-value">{stats.unread}</div>
            <div className="stat-label">Unread</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(34, 197, 94, 0.15)' }}>
            <CheckCircle size={24} color="#22c55e" />
          </div>
          <div>
            <div className="stat-value">{stats.replied}</div>
            <div className="stat-label">Replied</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(251, 191, 36, 0.15)' }}>
            <Calendar size={24} color="#fbbf24" />
          </div>
          <div>
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending Reply</div>
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
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <select
            className="form-input"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="all">All Status</option>
            <option value="unread">Unread</option>
            <option value="replied">Replied</option>
            <option value="pending">Pending Reply</option>
          </select>
          <button className="btn btn-secondary" onClick={fetchSubmissions}>
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>Subject</th>
                <th>Service</th>
                <th>Date</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id} style={{ background: !submission.is_read ? 'rgba(249, 115, 22, 0.03)' : 'transparent' }}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '0.875rem'
                      }}>
                        {submission.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{submission.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                          <Mail size={12} />
                          {submission.email}
                        </div>
                        {submission.phone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: '#64748b' }}>
                            <Phone size={12} />
                            {submission.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ color: '#334155', fontWeight: '500' }}>{submission.subject || 'No Subject'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                      {submission.message?.substring(0, 60)}...
                    </div>
                  </td>
                  <td>
                    {submission.service_interest ? (
                      <span className="badge badge-primary">{submission.service_interest}</span>
                    ) : (
                      <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Not specified</span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                      {formatDate(submission.created_at)}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleMarkAsRead(submission.id, submission.is_read)}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: submission.is_read ? '#16a34a' : '#f97316',
                          fontSize: '0.875rem'
                        }}
                      >
                        {submission.is_read ? (
                          <>
                            <CheckCircle size={14} />
                            <span>Read</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={14} />
                            <span>Unread</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleMarkAsReplied(submission.id, submission.replied)}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.5rem',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: submission.replied ? '#16a34a' : '#f97316',
                          fontSize: '0.875rem'
                        }}
                      >
                        {submission.replied ? (
                          <>
                            <CheckCircle size={14} />
                            <span>Replied</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={14} />
                            <span>Pending</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedSubmission(submission)}
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteId(submission.id)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSubmissions.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <MessageSquare size={48} style={{ color: '#e2e8f0' }} />
                      <p>No contact submissions found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedSubmission && (
        <div className="modal-overlay" onClick={() => setSelectedSubmission(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h3>Contact Message Details</h3>
              <button onClick={() => setSelectedSubmission(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                <XCircle size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Sender Info */}
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '1.25rem'
                  }}>
                    {selectedSubmission.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '1.125rem', color: '#1e293b' }}>{selectedSubmission.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Mail size={14} />
                        {selectedSubmission.email}
                      </span>
                      {selectedSubmission.phone && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Phone size={14} />
                          {selectedSubmission.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: '#64748b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={14} />
                    {formatDate(selectedSubmission.created_at)}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: selectedSubmission.is_read ? '#16a34a' : '#f97316' }}>
                    {selectedSubmission.is_read ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {selectedSubmission.is_read ? 'Read' : 'Unread'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: selectedSubmission.replied ? '#16a34a' : '#f97316' }}>
                    {selectedSubmission.replied ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {selectedSubmission.replied ? 'Replied' : 'Pending'}
                  </span>
                </div>
              </div>

              {/* Message Details */}
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Subject</h4>
                <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' }}>
                  {selectedSubmission.subject || 'No Subject'}
                </p>
              </div>

              {selectedSubmission.service_interest && (
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Service Interest</h4>
                  <span className="badge badge-primary">{selectedSubmission.service_interest}</span>
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Message</h4>
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
                  <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: '#334155' }}>
                    {selectedSubmission.message}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a
                  href={`mailto:${selectedSubmission.email}`}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <Mail size={16} />
                  Reply via Email
                </a>
                <a
                  href={`tel:${selectedSubmission.phone}`}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  disabled={!selectedSubmission.phone}
                >
                  <Phone size={16} />
                  Call
                </a>
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
              <h3>Delete Submission</h3>
            </div>
            <div className="modal-body">
              <p style={{ color: '#334155' }}>Are you sure you want to delete this contact submission? This action cannot be undone.</p>
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
