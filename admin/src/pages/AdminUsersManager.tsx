import { useEffect, useState } from 'react';
import { Plus, Trash2, Search, RefreshCw, Edit2, X, User, Shield, Mail, Phone, Key } from 'lucide-react';
import { usersAPI } from '../api/api';
import { toast } from 'react-toastify';

interface User {
    id: string;
    email: string;
    full_name: string;
    phone?: string;
    role: 'admin' | 'super_admin';
    is_active: boolean;
    email_verified: boolean;
    created_at: string;
}

export default function AdminUsersManager() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        fullName: '',
        phone: '',
        role: 'admin'
    });

    const [resetPasswordData, setResetPasswordData] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const [submitting, setSubmitting] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await usersAPI.getAll();
            // Filter to show only admin users (admin and super_admin)
            const allUsers = response.data.users || [];
            const adminUsers = allUsers.filter((u: User) => u.role === 'admin' || u.role === 'super_admin');
            setUsers(adminUsers);
        } catch (error: any) {
            console.error('Error fetching users:', error);
            toast.error(error.response?.data?.error || 'Failed to fetch admin users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (newUser.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setSubmitting(true);
        try {
            await usersAPI.create(newUser);
            toast.success('Admin user created successfully');
            setShowAddModal(false);
            setNewUser({ email: '', password: '', fullName: '', phone: '', role: 'admin' });
            fetchUsers();
        } catch (error: any) {
            console.error('Error creating user:', error);
            toast.error(error.response?.data?.error || 'Failed to create user');
        } finally {
            setSubmitting(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (resetPasswordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        if (!selectedUser) return;

        setSubmitting(true);
        try {
            await usersAPI.resetPassword(selectedUser.id, resetPasswordData.newPassword);
            toast.success('Password reset successfully');
            setShowPasswordModal(false);
            setResetPasswordData({ newPassword: '', confirmPassword: '' });
            setSelectedUser(null);
        } catch (error: any) {
            console.error('Error resetting password:', error);
            toast.error(error.response?.data?.error || 'Failed to reset password');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!deleteId) return;
        
        try {
            await usersAPI.delete(deleteId);
            toast.success('User deleted successfully');
            setDeleteId(null);
            fetchUsers();
        } catch (error: any) {
            console.error('Error deleting user:', error);
            toast.error(error.response?.data?.error || 'Failed to delete user');
        }
    };

    const handleToggleActive = async (userId: string, currentStatus: boolean) => {
        try {
            await usersAPI.update(userId, { isActive: !currentStatus });
            toast.success('User status updated');
            fetchUsers();
        } catch (error: any) {
            console.error('Error updating user:', error);
            toast.error('Failed to update user status');
        }
    };

    const filteredUsers = users.filter(user =>
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'super_admin':
                return <span className="badge badge-danger">Super Admin</span>;
            case 'admin':
                return <span className="badge badge-primary">Admin</span>;
            default:
                return <span className="badge badge-secondary">User</span>;
        }
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
                    <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b' }}>Admin Users</h1>
                    <p style={{ color: '#64748b' }}>Manage admin panel access and credentials</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <Plus size={18} /> Create Admin User
                </button>
            </div>

            {/* Info Card */}
            <div className="card mb-6" style={{ background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(234, 88, 12, 0.1))', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
                <div className="flex items-start gap-3">
                    <Shield size={24} color="#f97316" style={{ flexShrink: 0 }} />
                    <div>
                        <h3 style={{ fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem' }}>Admin Access Management</h3>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
                            Create and manage admin user accounts. Each admin user can access the admin panel with their own credentials. 
                            Super Admins have full access to all features including user management.
                        </p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="card mb-6">
                <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                    <button className="btn btn-secondary" onClick={fetchUsers}>
                        <RefreshCw size={18} /> Refresh
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="card">
                {filteredUsers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        <p>No admin users found</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map(user => (
                                    <tr key={user.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div style={{
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: '600',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                                                </div>
                                                <span style={{ fontWeight: '500', color: '#1e293b' }}>{user.full_name || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <Mail size={14} color="#64748b" />
                                                <span style={{ color: '#334155' }}>{user.email}</span>
                                            </div>
                                        </td>
                                        <td>
                                            {user.phone ? (
                                                <div className="flex items-center gap-2">
                                                    <Phone size={14} color="#64748b" />
                                                    <span style={{ color: '#334155' }}>{user.phone}</span>
                                                </div>
                                            ) : (
                                                <span style={{ color: '#94a3b8' }}>N/A</span>
                                            )}
                                        </td>
                                        <td>{getRoleBadge(user.role)}</td>
                                        <td>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={user.is_active}
                                                    onChange={() => handleToggleActive(user.id, user.is_active)}
                                                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                                />
                                                <span style={{ fontSize: '0.875rem', color: user.is_active ? '#16a34a' : '#64748b' }}>
                                                    {user.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </label>
                                        </td>
                                        <td>
                                            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                                {new Date(user.created_at).toLocaleDateString('en-IN')}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setResetPasswordData({ newPassword: '', confirmPassword: '' });
                                                        setShowPasswordModal(true);
                                                    }}
                                                    title="Reset Password"
                                                >
                                                    <Key size={14} />
                                                </button>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => setDeleteId(user.id)}
                                                    title="Delete User"
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

            {/* Add User Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
                        <div className="modal-header">
                            <h3 style={{ fontWeight: '600' }}>Create Admin User</h3>
                            <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateUser}>
                            <div className="modal-body">
                                <div className="space-y-4">
                                    <div className="form-group">
                                        <label className="form-label">Full Name *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={newUser.fullName}
                                            onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Email *</label>
                                        <input
                                            type="email"
                                            className="form-input"
                                            value={newUser.email}
                                            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                            placeholder="admin@edizo.in"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Phone (Optional)</label>
                                        <input
                                            type="tel"
                                            className="form-input"
                                            value={newUser.phone}
                                            onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                                            placeholder="+91 1234567890"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Password *</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            value={newUser.password}
                                            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                            placeholder="Min. 6 characters"
                                            required
                                            minLength={6}
                                        />
                                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                                            Password must be at least 6 characters long
                                        </p>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Role *</label>
                                        <select
                                            className="form-select"
                                            value={newUser.role}
                                            onChange={e => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'super_admin' })}
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="super_admin">Super Admin</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Creating...' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {showPasswordModal && selectedUser && (
                <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
                        <div className="modal-header">
                            <h3 style={{ fontWeight: '600' }}>Reset Password</h3>
                            <button onClick={() => setShowPasswordModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleResetPassword}>
                            <div className="modal-body">
                                <div style={{ 
                                    background: 'rgba(249, 115, 22, 0.1)', 
                                    padding: '1rem', 
                                    borderRadius: '0.5rem',
                                    marginBottom: '1rem',
                                    border: '1px solid rgba(249, 115, 22, 0.2)'
                                }}>
                                    <p style={{ fontSize: '0.875rem', color: '#c2410c', marginBottom: '0.25rem' }}>
                                        Resetting password for:
                                    </p>
                                    <p style={{ fontWeight: '600', color: '#1e293b' }}>{selectedUser.full_name}</p>
                                    <p style={{ fontSize: '0.875rem', color: '#64748b' }}>{selectedUser.email}</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="form-group">
                                        <label className="form-label">New Password *</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            value={resetPasswordData.newPassword}
                                            onChange={e => setResetPasswordData({ ...resetPasswordData, newPassword: e.target.value })}
                                            placeholder="Enter new password"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Confirm Password *</label>
                                        <input
                                            type="password"
                                            className="form-input"
                                            value={resetPasswordData.confirmPassword}
                                            onChange={e => setResetPasswordData({ ...resetPasswordData, confirmPassword: e.target.value })}
                                            placeholder="Confirm new password"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                        Password must be at least 6 characters long
                                    </p>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={submitting}>
                                    {submitting ? 'Resetting...' : 'Reset Password'}
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
                            <h3 style={{ fontWeight: '600', color: '#1e293b' }}>Delete User</h3>
                        </div>
                        <div className="modal-body">
                            <p style={{ color: '#334155' }}>
                                Are you sure you want to delete this user? This action cannot be undone 
                                and will remove all associated data.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
                            <button className="btn btn-danger" onClick={handleDeleteUser}>Delete User</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
