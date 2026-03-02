import { useState } from 'react';
import { Lock, Eye, EyeOff, Mail } from 'lucide-react';
import { authAPI } from '../api/api';

interface LoginProps {
    onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState('admin@edizo.in');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authAPI.login(email, password);
            const { token, user } = response.data;
            
            // Store token and user info
            localStorage.setItem('admin_token', token);
            localStorage.setItem('admin_user', JSON.stringify(user));
            
            onLogin();
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #e0e7ee 0%, #f8fafc 25%, #e2e8f0 50%, #f1f5f9 75%, #e0e7ee 100%)',
            padding: '1rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative background elements */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                right: '-10%',
                width: '50%',
                height: '60%',
                background: 'radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-20%',
                left: '-10%',
                width: '50%',
                height: '60%',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />

            <div style={{
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderRadius: '1.75rem',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                padding: '3rem',
                maxWidth: '420px',
                width: '100%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        width: '72px',
                        height: '72px',
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                        borderRadius: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.25rem',
                        boxShadow: '0 8px 24px rgba(249, 115, 22, 0.35)'
                    }}>
                        <Lock size={32} color="white" />
                    </div>
                    <h1 style={{
                        fontSize: '1.75rem',
                        fontWeight: '700',
                        marginBottom: '0.5rem',
                        color: '#1e293b',
                        letterSpacing: '-0.02em'
                    }}>
                        EDIZO Admin
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.9375rem' }}>
                        Enter your credentials to access the admin panel
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@edizo.in"
                                required
                                style={{ paddingLeft: '3rem' }}
                            />
                            <Mail
                                size={18}
                                style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#94a3b8'
                                }}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginTop: '1.25rem' }}>
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                                style={{ paddingRight: '3rem', paddingLeft: '3rem' }}
                            />
                            <Lock
                                size={18}
                                style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#94a3b8'
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '0.75rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: '#64748b',
                                    cursor: 'pointer',
                                    transition: 'color 0.2s'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '0.75rem',
                            padding: '0.875rem 1rem',
                            marginBottom: '1.25rem',
                            color: '#dc2626',
                            fontSize: '0.875rem',
                            fontWeight: '500'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                            width: '100%',
                            justifyContent: 'center',
                            padding: '0.875rem 1.5rem',
                            fontSize: '0.9375rem'
                        }}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="loading-spinner" style={{ width: '22px', height: '22px' }} />
                        ) : (
                            'Login to Admin Panel'
                        )}
                    </button>
                </form>

                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(59, 130, 246, 0.2)'
                }}>
                    <p style={{
                        fontSize: '0.75rem',
                        color: '#1e40af',
                        fontWeight: '500',
                        marginBottom: '0.5rem'
                    }}>
                        Default Admin Credentials:
                    </p>
                    <p style={{ fontSize: '0.7rem', color: '#3b82f6' }}>
                        Email: admin@edizo.in<br />
                        Password: (Set in database)
                    </p>
                </div>

                <p style={{
                    textAlign: 'center',
                    marginTop: '1.5rem',
                    color: '#94a3b8',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                }}>
                    © 2025 Edizo. Admin Panel v2.0
                </p>
            </div>
        </div>
    );
}
