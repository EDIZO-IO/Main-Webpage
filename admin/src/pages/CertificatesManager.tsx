
import { useEffect, useState } from 'react';
import { Plus, Trash2, Search, RefreshCw, Copy, X, Award } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Certificate {
    id: number;
    certificateId: string;
    internName: string;
    programName: string;
    startDate: string;
    endDate: string;
    issueDate: string;
    status: string;
    email: string;
}

export default function CertificatesManager() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const [newItem, setNewItem] = useState({
        certificateId: '',
        internName: '',
        programName: '',
        startDate: '',
        endDate: '',
        issueDate: new Date().toISOString().split('T')[0],
        status: 'Completed',
        email: ''
    });

    const [submitting, setSubmitting] = useState(false);

    const fetchCertificates = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/certificates`);
            const data = await response.json();
            if (data.success) {
                setCertificates(data.data);
            }
        } catch (error) {
            console.error('Error fetching certificates:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            // Server expects 0-based index relative to data rows
            const response = await fetch(`${API_URL}/api/admin/certificates/${id - 1}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setCertificates(certificates.filter(c => c.id !== id));
                setDeleteId(null);
                fetchCertificates(); // Refresh to resync IDs
            }
        } catch (error) {
            console.error('Error deleting certificate:', error);
            alert('Failed to delete certificate');
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/certificates`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });
            const data = await response.json();
            if (data.success) {
                setShowAddModal(false);
                setNewItem({
                    certificateId: '',
                    internName: '',
                    programName: '',
                    startDate: '',
                    endDate: '',
                    issueDate: new Date().toISOString().split('T')[0],
                    status: 'Completed',
                    email: ''
                });
                fetchCertificates();
            } else {
                alert(data.message || 'Failed to add certificate');
            }
        } catch (error) {
            console.error('Error adding certificate:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const filteredCertificates = certificates.filter(c =>
        c.internName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.certificateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.programName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Could add a toast here
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
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>Certificates</h1>
                    <p style={{ color: '#64748b' }}>Manage internship certificates</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <Plus size={18} /> New Certificate
                </button>
            </div>

            {/* Search and Filters */}
            <div className="card mb-6">
                <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search by name, ID or program..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                    <button className="btn btn-secondary" onClick={fetchCertificates}>
                        <RefreshCw size={18} /> Refresh
                    </button>
                </div>
            </div>

            {/* Certificates Table */}
            <div className="card">
                {filteredCertificates.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        <p>No certificates found</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Certificate ID</th>
                                    <th>Intern Name</th>
                                    <th>Program</th>
                                    <th>Duration</th>
                                    <th>Issue Date</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCertificates.map(cert => (
                                    <tr key={cert.id}>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <span style={{ fontFamily: 'monospace', fontWeight: '500', color: '#1e293b' }}>
                                                    {cert.certificateId}
                                                </span>
                                                <button
                                                    onClick={() => copyToClipboard(cert.certificateId)}
                                                    className="btn btn-icon btn-sm"
                                                    title="Copy ID"
                                                >
                                                    <Copy size={12} />
                                                </button>
                                            </div>
                                        </td>
                                        <td>{cert.internName}</td>
                                        <td>{cert.programName}</td>
                                        <td>
                                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                                {cert.startDate} - {cert.endDate}
                                            </span>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                                {cert.issueDate}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${cert.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                                                {cert.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
                                                <a
                                                    href={`https://edizo.in/verification?id=${cert.certificateId}`} // Assuming main site URL
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-secondary btn-sm"
                                                    title="Verify Link"
                                                >
                                                    <Award size={14} />
                                                </a>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => setDeleteId(cert.id)}
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

            {/* Add Certificate Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h3 style={{ fontWeight: '600' }}>Add New Certificate</h3>
                            <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAdd}>
                            <div className="modal-body">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="form-group">
                                        <label className="form-label">Certificate ID *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={newItem.certificateId}
                                            onChange={e => setNewItem({ ...newItem, certificateId: e.target.value.toUpperCase() })}
                                            placeholder="EDIZO-WEB-2024-001"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Intern Name *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={newItem.internName}
                                            onChange={e => setNewItem({ ...newItem, internName: e.target.value })}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div className="form-group span-2">
                                        <label className="form-label">Program Name *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={newItem.programName}
                                            onChange={e => setNewItem({ ...newItem, programName: e.target.value })}
                                            placeholder="Web Development Internship"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Start Date</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={newItem.startDate}
                                            onChange={e => setNewItem({ ...newItem, startDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">End Date</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={newItem.endDate}
                                            onChange={e => setNewItem({ ...newItem, endDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Issue Date</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={newItem.issueDate}
                                            onChange={e => setNewItem({ ...newItem, issueDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Status</label>
                                        <select
                                            className="form-input"
                                            value={newItem.status}
                                            onChange={e => setNewItem({ ...newItem, status: e.target.value })}
                                        >
                                            <option value="Completed">Completed</option>
                                            <option value="Ongoing">Ongoing</option>
                                            <option value="Terminated">Terminated</option>
                                        </select>
                                    </div>
                                    <div className="form-group span-2">
                                        <label className="form-label">Email (Optional)</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            value={newItem.email}
                                            onChange={e => setNewItem({ ...newItem, email: e.target.value })}
                                            placeholder="intern@example.com"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Adding...' : 'Add Certificate'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId !== null && (
                <div className="modal-overlay" onClick={() => setDeleteId(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 style={{ fontWeight: '600' }}>Delete Certificate</h3>
                        </div>
                        <div className="modal-body">
                            <p style={{ color: '#334155' }}>Are you sure you want to delete this certificate? This action cannot be undone and will remove the row from Google Sheets.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
                            <button className="btn btn-danger" onClick={() => deleteId && handleDelete(deleteId)}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
