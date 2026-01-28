import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Menu, X, Award, Briefcase, Users } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
    onLogout: () => void;
}

export default function Layout({ onLogout }: LayoutProps) {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/certificates', label: 'Certificates', icon: Award },
        { path: '/internships', label: 'Internships', icon: Briefcase },
        { path: '/internship-applications', label: 'Applications', icon: Users },
    ];

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                    position: 'fixed',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 60,
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '0.75rem',
                    color: '#1e293b',
                    display: 'none',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                    cursor: 'pointer'
                }}
                className="mobile-menu-btn"
            >
                {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Sidebar Overlay for Mobile */}
            {sidebarOpen && (
                <div
                    onClick={() => setSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(15, 23, 42, 0.3)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 40,
                        display: 'none'
                    }}
                    className="sidebar-overlay"
                />
            )}

            {/* Sidebar */}
            <aside style={{
                width: '280px',
                background: 'rgba(255, 255, 255, 0.55)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.3)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 50,
                boxShadow: '4px 0 30px rgba(0, 0, 0, 0.04), inset -1px 0 0 rgba(255, 255, 255, 0.4)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
                {/* Logo */}
                <div style={{
                    marginBottom: '2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    padding: '0.5rem'
                }}>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                        borderRadius: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '1.25rem',
                        color: 'white',
                        boxShadow: '0 4px 14px rgba(249, 115, 22, 0.35)'
                    }}>
                        E
                    </div>
                    <div>
                        <h1 style={{
                            fontWeight: '700',
                            fontSize: '1.25rem',
                            color: '#1e293b',
                            letterSpacing: '-0.02em'
                        }}>EDIZO</h1>
                        <p style={{
                            fontSize: '0.75rem',
                            color: '#94a3b8',
                            fontWeight: '500'
                        }}>Admin Panel</p>
                    </div>
                </div>

                {/* Navigation Label */}
                <p style={{
                    fontSize: '0.6875rem',
                    fontWeight: '600',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '0.75rem',
                    paddingLeft: '0.75rem'
                }}>
                    Menu
                </p>

                {/* Navigation */}
                <nav style={{ flex: 1 }}>
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.875rem',
                                padding: '0.875rem 1rem',
                                borderRadius: '0.75rem',
                                marginBottom: '0.375rem',
                                color: isActive(item.path) ? '#f97316' : '#64748b',
                                background: isActive(item.path)
                                    ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.12), rgba(249, 115, 22, 0.06))'
                                    : 'transparent',
                                textDecoration: 'none',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                border: isActive(item.path)
                                    ? '1px solid rgba(249, 115, 22, 0.15)'
                                    : '1px solid transparent',
                                fontWeight: isActive(item.path) ? '600' : '500'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive(item.path)) {
                                    e.currentTarget.style.background = 'rgba(148, 163, 184, 0.08)';
                                    e.currentTarget.style.color = '#1e293b';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive(item.path)) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#64748b';
                                }
                            }}
                        >
                            <item.icon
                                size={20}
                                style={{
                                    color: isActive(item.path) ? '#f97316' : '#94a3b8',
                                    transition: 'color 0.2s'
                                }}
                            />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Logout */}
                <button
                    onClick={onLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.875rem',
                        padding: '0.875rem 1rem',
                        borderRadius: '0.75rem',
                        color: '#ef4444',
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.12)',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
                        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.12)';
                    }}
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                marginLeft: '280px',
                padding: '2rem 2.5rem',
                minHeight: '100vh',
                position: 'relative',
                zIndex: 1
            }}>
                <Outlet />
            </main>

            <style>{`
                @media (max-width: 768px) {
                    .mobile-menu-btn { display: flex !important; align-items: center; justify-content: center; }
                    .sidebar-overlay { display: block !important; }
                    aside { 
                        transform: ${sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'} !important;
                        width: 280px !important;
                    }
                    main { 
                        margin-left: 0 !important; 
                        padding: 1.5rem !important;
                        padding-top: 5rem !important;
                    }
                }
            `}</style>
        </div>
    );
}
