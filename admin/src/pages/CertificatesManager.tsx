import { useEffect, useState } from 'react';
import { Plus, Trash2, Search, RefreshCw, Copy, X, Award, CheckCircle } from 'lucide-react';
import { certificatesAPI, internshipsAPI } from '../api/api';
import { toast } from 'react-toastify';

interface Certificate {
    id: string;
    certificate_id: string;
    recipient_name: string;
    recipient_email: string;
    course_name: string;
    duration: string;
    completion_date: string;
    issue_date: string;
    grade?: string;
    score?: number;
    is_verified: boolean;
    is_active: boolean;
    internship_id?: string;
    user_id?: string;
}

interface Internship {
    id: string;
    title: string;
}

export default function CertificatesManager() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [internships, setInternships] = useState<Internship[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

    const [newItem, setNewItem] = useState({
        certificate_id: '',
        recipient_name: '',
        recipient_email: '',
        course_name: '',
        duration: '1-month',
        completion_date: '',
        grade: '',
        score: 0,
        internship_id: '',
        is_verified: true,
        is_active: true
    });

    const [submitting, setSubmitting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [certsRes, internshipsRes] = await Promise.all([
                certificatesAPI.getAll(),
                internshipsAPI.getAll()
            ]);
            
            setCertificates(certsRes.data.certificates || []);
            setInternships(internshipsRes.data.internships || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await certificatesAPI.delete(id);
            toast.success('Certificate deleted successfully');
            setDeleteId(null);
            fetchData();
        } catch (error) {
            console.error('Error deleting certificate:', error);
            toast.error('Failed to delete certificate');
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await certificatesAPI.create(newItem);
            toast.success('Certificate created successfully');
            setShowAddModal(false);
            setNewItem({
                certificate_id: `CERT-${Date.now()}`,
                recipient_name: '',
                recipient_email: '',
                course_name: '',
                duration: '1-month',
                completion_date: '',
                grade: '',
                score: 0,
                internship_id: '',
                is_verified: true,
                is_active: true
            });
            fetchData();
        } catch (error: any) {
            console.error('Error adding certificate:', error);
            toast.error(error.response?.data?.error || 'Failed to add certificate');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredCertificates = certificates.filter(c =>
        c.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.certificate_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.course_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
    };

    const getInternshipTitle = (internshipId?: string) => {
        if (!internshipId) return 'N/A';
        const internship = internships.find(i => i.id === internshipId);
        return internship?.title || internshipId;
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
                            placeholder="Search by name, ID or course..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                    <button className="btn btn-secondary" onClick={fetchData}>
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
                                    <th>Recipient Name</th>
                                    <th>Course</th>
                                    <th>Duration</th>
                                    <th>Completion Date</th>
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
                                                    {cert.certificate_id}
                                                </span>
                                                <button
                                                    onClick={() => copyToClipboard(cert.certificate_id)}
                                                    className="btn btn-icon btn-sm"
                                                    title="Copy ID"
                                                >
                                                    <Copy size={12} />
                                                </button>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ fontWeight: '500', color: '#1e293b' }}>{cert.recipient_name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{cert.recipient_email}</div>
                                        </td>
                                        <td>{cert.course_name}</td>
                                        <td>
                                            <span className="badge badge-primary">{cert.duration}</span>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                                {cert.completion_date}
                                            </span>
                                        </td>
                                        <td>
                                            {cert.is_verified ? (
                                                <span className="badge badge-success">
                                                    <CheckCircle size={12} style={{ marginRight: '4px' }} />
                                                    Verified
                                                </span>
                                            ) : (
                                                <span className="badge badge-warning">Not Verified</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
                                                <a
                                                    href={`https://edizo.in/verification?id=${cert.certificate_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-secondary btn-sm"
                                                    title="Verify Link"
                                                >
                                                    <Award size={14} />
                                                </a>
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => setSelectedCertificate(cert)}
                                                    title="View Details"
                                                >
                                                    <Search size={14} />
                                                </button>
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
                                            value={newItem.certificate_id}
                                            onChange={e => setNewItem({ ...newItem, certificate_id: e.target.value.toUpperCase() })}
                                            placeholder="EDIZO-CERT-2024-001"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Recipient Name *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={newItem.recipient_name}
                                            onChange={e => setNewItem({ ...newItem, recipient_name: e.target.value })}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Recipient Email *</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            value={newItem.recipient_email}
                                            onChange={e => setNewItem({ ...newItem, recipient_email: e.target.value })}
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Course Name *</label>
                                        <select
                                            className="form-input"
                                            value={newItem.course_name}
                                            onChange={e => setNewItem({ ...newItem, course_name: e.target.value, internship_id: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Course</option>
                                            {internships.map(i => (
                                                <option key={i.id} value={i.id}>{i.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Duration</label>
                                        <select
                                            className="form-input"
                                            value={newItem.duration}
                                            onChange={e => setNewItem({ ...newItem, duration: e.target.value })}
                                        >
                                            <option value="15-days">15 Days</option>
                                            <option value="1-month">1 Month</option>
                                            <option value="2-months">2 Months</option>
                                            <option value="3-months">3 Months</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Completion Date *</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={newItem.completion_date}
                                            onChange={e => setNewItem({ ...newItem, completion_date: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Grade (Optional)</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={newItem.grade}
                                            onChange={e => setNewItem({ ...newItem, grade: e.target.value })}
                                            placeholder="A+"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Score (Optional)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={newItem.score}
                                            onChange={e => setNewItem({ ...newItem, score: parseFloat(e.target.value) })}
                                            placeholder="95"
                                            min="0"
                                            max="100"
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

            {/* View Details Modal */}
            {selectedCertificate && (
                <div className="modal-overlay" onClick={() => setSelectedCertificate(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        <div className="modal-header">
                            <h3 style={{ fontWeight: '600' }}>Certificate Details</h3>
                            <button onClick={() => setSelectedCertificate(null)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500">Certificate ID</p>
                                    <p className="font-mono font-medium">{selectedCertificate.certificate_id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Recipient</p>
                                    <p className="font-medium">{selectedCertificate.recipient_name}</p>
                                    <p className="text-sm text-gray-600">{selectedCertificate.recipient_email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Course</p>
                                    <p className="font-medium">{getInternshipTitle(selectedCertificate.internship_id)}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Duration</p>
                                        <p className="font-medium">{selectedCertificate.duration}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Completion Date</p>
                                        <p className="font-medium">{selectedCertificate.completion_date}</p>
                                    </div>
                                </div>
                                {selectedCertificate.grade && (
                                    <div>
                                        <p className="text-sm text-gray-500">Grade</p>
                                        <p className="font-medium">{selectedCertificate.grade}</p>
                                    </div>
                                )}
                                {selectedCertificate.score && (
                                    <div>
                                        <p className="text-sm text-gray-500">Score</p>
                                        <p className="font-medium">{selectedCertificate.score}%</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <p className={`font-medium ${selectedCertificate.is_verified ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {selectedCertificate.is_verified ? 'Verified' : 'Not Verified'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setSelectedCertificate(null)}>Close</button>
                            <a
                                href={`https://edizo.in/verification?id=${selectedCertificate.certificate_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                            >
                                <Award size={16} style={{ marginRight: '8px' }} />
                                Verify Certificate
                            </a>
                        </div>
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
                            <p style={{ color: '#334155' }}>Are you sure you want to delete this certificate? This action cannot be undone.</p>
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
