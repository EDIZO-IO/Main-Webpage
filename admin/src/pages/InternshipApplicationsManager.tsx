
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
            case 'Accepted': return <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded text-xs border border-green-900">Accepted</span>;
            case 'Rejected': return <span className="bg-red-900/30 text-red-400 px-2 py-1 rounded text-xs border border-red-900">Rejected</span>;
            case 'Pending':
            default: return <span className="bg-yellow-900/30 text-yellow-500 px-2 py-1 rounded text-xs border border-yellow-900">Pending</span>;
        }
    };

    if (loading) return <div className="flex justify-center items-center h-[50vh]"><div className="loading-spinner" /></div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Internship Applications</h1>
                    <p className="text-gray-400">Manage incoming applications</p>
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
                                <tr key={app.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                    <td className="p-4 text-sm text-gray-400">{app.timestamp.split(',')[0]}</td>
                                    <td className="p-4">
                                        <div className="font-medium">{app.name}</div>
                                        <div className="text-xs text-gray-500">{app.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <div>{app.program}</div>
                                        <div className="text-xs text-gray-500">{app.duration}</div>
                                    </td>
                                    <td className="p-4">{getStatusBadge(app.status)}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                className="p-2 hover:bg-gray-700 rounded-lg text-blue-400 transition-colors"
                                                onClick={() => setSelectedApp(app)}
                                                title="View Details"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                className="p-2 hover:bg-red-900/30 rounded-lg text-red-500 transition-colors"
                                                onClick={() => setDeleteIndex(app.id)}
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedApp(null)}>
                    <div className="bg-[#1e293b] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700" onClick={e => e.stopPropagation()}>
                        <div className="sticky top-0 bg-[#1e293b] p-6 border-b border-gray-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Application Details</h2>
                            <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-white">
                                <XCircle size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">

                            {/* Header Info */}
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">{selectedApp.name}</h3>
                                    <p className="text-blue-400">{selectedApp.program} ({selectedApp.duration})</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-400 mb-1">{selectedApp.timestamp}</div>
                                    {getStatusBadge(selectedApp.status)}
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Contact Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="text-gray-200">{selectedApp.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <p className="text-gray-200">{selectedApp.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Academic Info */}
                            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Academic Background</h4>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-500">University</p>
                                        <p className="text-gray-200">{selectedApp.university}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500">Degree/Branch</p>
                                            <p className="text-gray-200">{selectedApp.education}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Year</p>
                                            <p className="text-gray-200">{selectedApp.year}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pricing Info */}
                            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                                <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Payment Details</h4>
                                <div>
                                    <p className="text-xs text-gray-500">Final Price Agreed</p>
                                    <p className="text-xl font-bold text-green-400">{selectedApp.price}</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 border-t border-gray-700 flex justify-between items-center">
                                <p className="text-sm text-gray-400">Update Status:</p>
                                <div className="flex gap-3">
                                    <button
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${selectedApp.status === 'Pending' ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-yellow-900/50'}`}
                                        onClick={() => handleStatusUpdate(selectedApp.id, 'Pending')}
                                    >
                                        Pending
                                    </button>
                                    <button
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${selectedApp.status === 'Accepted' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-green-900/50'}`}
                                        onClick={() => handleStatusUpdate(selectedApp.id, 'Accepted')}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${selectedApp.status === 'Rejected' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-red-900/50'}`}
                                        onClick={() => handleStatusUpdate(selectedApp.id, 'Rejected')}
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#1e293b] rounded-2xl max-w-md p-6 border border-gray-700 shadow-2xl">
                        <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                        <p className="text-gray-300 mb-6">Are you sure you want to delete this application? This cannot be undone.</p>
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
