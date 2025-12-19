import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
    onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'edizo@admin2025';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        setTimeout(() => {
            if (password === ADMIN_PASSWORD) {
                onLogin();
            } else {
                setError('Invalid password');
            }
            setLoading(false);
        }, 500);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: '1rem'
        }}>
            <div style={{
                background: '#16213e',
                borderRadius: '1.5rem',
                border: '1px solid #334155',
                padding: '2.5rem',
                maxWidth: '400px',
                width: '100%'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                        borderRadius: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1rem'
                    }}>
                        <Lock size={28} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        EDIZO Admin
                    </h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                        Enter password to access the admin panel
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter admin password"
                                required
                                style={{ paddingRight: '3rem' }}
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
                                    color: '#94a3b8',
                                    cursor: 'pointer'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid #ef4444',
                            borderRadius: '0.5rem',
                            padding: '0.75rem',
                            marginBottom: '1rem',
                            color: '#ef4444',
                            fontSize: '0.875rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', justifyContent: 'center' }}
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="loading-spinner" style={{ width: '20px', height: '20px' }} />
                        ) : (
                            'Login to Admin Panel'
                        )}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#64748b', fontSize: '0.75rem' }}>
                    © 2025 Edizo. Admin Panel v1.0
                </p>
            </div>
        </div>
    );
}
