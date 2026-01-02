
import { useEffect, useState } from 'react';
import { Trash2, Search, RefreshCw, Eye, XCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface Application {
    id: number; // 0-based index from data slice (so relative to data rows)
    timestamp: string;
    name: string;
    email: string;
    phone: string;
    university: string;
    year: string;
    education: string;
    program: string;
    company: string;
    duration: string;
    price: string;
    status: string;
    message?: string; // Cover letter?
}

export default function InternshipApplicationsManager() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedApp, setSelectedApp] = useState<Application | null>(null); // For Details Modal
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/admin/applications`);
            const data = await response.json();
            if (data.success) {
                setApplications(data.data);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleDelete = async () => {
        if (deleteIndex === null) return;
        try {
            const response = await fetch(`${API_URL}/api/admin/applications/${deleteIndex}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                setDeleteIndex(null);
                fetchApplications(); // Refresh list
                if (selectedApp?.id === deleteIndex) setSelectedApp(null);
            } else {
                alert('Failed to delete application');
            }
        } catch (error) {
            console.error('Error deleting application:', error);
        }
    };

    const handleStatusUpdate = async (id: number, newStatus: string) => {
        try {
            const response = await fetch(`${API_URL}/api/admin/applications/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                // Optimistic update
                setApplications(apps => apps.map(app =>
                    app.id === id ? { ...app, status: newStatus } : app
                ));
                if (selectedApp && selectedApp.id === id) {
                    setSelectedApp(prev => prev ? { ...prev, status: newStatus } : null);
                }
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const filteredApps = applications.filter(app =>
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.program.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Accepted': return <span className="badge badge-success">Accepted</span>;
            case 'Rejected': return <span className="badge badge-danger">Rejected</span>;
            case 'Pending':
            default: return <span className="badge badge-warning">Pending</span>;
        }
    };

    if (loading) return <div className="flex justify-center items-center h-[50vh]"><div className="loading-spinner" /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>Internship Applications</h1>
                    <p style={{ color: '#64748b' }}>Manage incoming applications</p>
                </div>
            </div>

            <div className="card mb-6">
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            className="form-input pl-10"
                            placeholder="Search by name, email, or program..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-secondary" onClick={fetchApplications}>
                        <RefreshCw size={18} /> Refresh
                    </button>
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-gray-700">
                                <th className="p-4">Date</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Program</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApps.map((app) => (
                                <tr key={app.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.15)' }}>
                                    <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#64748b' }}>{app.timestamp.split(',')[0]}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ fontWeight: '500', color: '#1e293b' }}>{app.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.email}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ color: '#334155' }}>{app.program}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.duration}</div>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{getStatusBadge(app.status)}</td>
                                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => setSelectedApp(app)}
                                                title="View Details"
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => setDeleteIndex(app.id)}
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
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        No applications found
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
                    <div className="modal" style={{ maxWidth: '700px' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 style={{ fontWeight: '600', color: '#1e293b' }}>Application Details</h3>
                            <button onClick={() => setSelectedApp(null)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>
                                <XCircle size={20} />
                            </button>
                        </div>

                        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                            {/* Header Info */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b' }}>{selectedApp.name}</h3>
                                    <p style={{ color: '#f97316', fontWeight: '500' }}>{selectedApp.program} ({selectedApp.duration})</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>{selectedApp.timestamp}</div>
                                    {getStatusBadge(selectedApp.status)}
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div style={{ background: 'rgba(148, 163, 184, 0.08)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Email</p>
                                        <p style={{ color: '#334155' }}>{selectedApp.email}</p>
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Phone</p>
                                        <p style={{ color: '#334155' }}>{selectedApp.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Academic Info */}
                            <div style={{ background: 'rgba(148, 163, 184, 0.08)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Academic Background</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>University</p>
                                        <p style={{ color: '#334155' }}>{selectedApp.university}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Degree/Branch</p>
                                            <p style={{ color: '#334155' }}>{selectedApp.education}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Year</p>
                                            <p style={{ color: '#334155' }}>{selectedApp.year}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing Info */}
                            <div style={{ background: 'rgba(148, 163, 184, 0.08)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
                                <h4 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment Details</h4>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Final Price Agreed</p>
                                    <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#16a34a' }}>{selectedApp.price}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(148, 163, 184, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Update Status:</p>
                                <div className="flex gap-2">
                                    <button
                                        className={`btn btn-sm ${selectedApp.status === 'Pending' ? 'btn-warning' : 'btn-secondary'}`}
                                        onClick={() => handleStatusUpdate(selectedApp.id, 'Pending')}
                                        style={{ opacity: selectedApp.status === 'Pending' ? 1 : 0.8 }}
                                    >
                                        Pending
                                    </button>
                                    <button
                                        className={`btn btn-sm ${selectedApp.status === 'Accepted' ? 'btn-success' : 'btn-secondary'}`}
                                        onClick={() => handleStatusUpdate(selectedApp.id, 'Accepted')}
                                        style={{ opacity: selectedApp.status === 'Accepted' ? 1 : 0.8 }}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className={`btn btn-sm ${selectedApp.status === 'Rejected' ? 'btn-danger' : 'btn-secondary'}`}
                                        onClick={() => handleStatusUpdate(selectedApp.id, 'Rejected')}
                                        style={{ opacity: selectedApp.status === 'Rejected' ? 1 : 0.8 }}
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {deleteIndex !== null && (
                <div className="modal-overlay">
                    <div className="modal" style={{ maxWidth: '400px' }}>
                        <div className="modal-header">
                            <h3 style={{ fontWeight: '600', color: '#1e293b' }}>Confirm Delete</h3>
                        </div>
                        <div className="modal-body">
                            <p style={{ color: '#334155' }}>Are you sure you want to delete this application? This cannot be undone.</p>
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
