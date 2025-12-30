import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, MessageSquare, LogOut, Menu, X, Award, Briefcase, Users } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
    onLogout: () => void;
}

export default function Layout({ onLogout }: LayoutProps) {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/blogs', label: 'Blogs', icon: FileText },
        { path: '/testimonials', label: 'Testimonials', icon: MessageSquare },
        { path: '/certificates', label: 'Certificates', icon: Award },
        { path: '/internships', label: 'Internships', icon: Briefcase },
        { path: '/internship-applications', label: 'Applications', icon: Users },
    ];

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                style={{
                    position: 'fixed',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 60,
                    padding: '0.5rem',
                    background: '#16213e',
                    border: '1px solid #334155',
                    borderRadius: '0.5rem',
                    color: 'white',
                    display: 'none'
                }}
                className="mobile-menu-btn"
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: '#16213e',
                borderRight: '1px solid #334155',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 50,
                transform: sidebarOpen ? 'translateX(0)' : 'translateX(0)'
            }}>
                {/* Logo */}
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                        borderRadius: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '1.125rem'
                    }}>
                        E
                    </div>
                    <div>
                        <h1 style={{ fontWeight: '700', fontSize: '1.125rem' }}>EDIZO</h1>
                        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Admin Panel</p>
                    </div>
                </div>

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
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                borderRadius: '0.5rem',
                                marginBottom: '0.5rem',
                                color: isActive(item.path) ? 'white' : '#94a3b8',
                                background: isActive(item.path) ? 'rgba(249, 115, 22, 0.15)' : 'transparent',
                                textDecoration: 'none',
                                transition: 'all 0.2s'
                            }}
                        >
                            <item.icon size={20} style={{ color: isActive(item.path) ? '#f97316' : 'inherit' }} />
                            <span style={{ fontWeight: isActive(item.path) ? '600' : '400' }}>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Logout */}
                <button
                    onClick={onLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        color: '#ef4444',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: 'none',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                    }}
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                marginLeft: '260px',
                padding: '2rem',
                minHeight: '100vh'
            }}>
                <Outlet />
            </main>

            <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: block !important; }
          aside { transform: ${sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'} !important; }
          main { margin-left: 0 !important; }
        }
      `}</style>
        </div>
    );
}
