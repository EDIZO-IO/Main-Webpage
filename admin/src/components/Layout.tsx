import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Menu, X, Award, Briefcase, Users, FileText, Settings, UserCog, Calendar, Star, FolderKanban, UserCheck, MessageSquare } from 'lucide-react';
import { useState } from 'react';

interface LayoutProps {
    onLogout: () => void;
}

export default function Layout({ onLogout }: LayoutProps) {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/internships', label: 'Internships', icon: Briefcase },
        { path: '/services', label: 'Services', icon: FileText },
        { path: '/projects', label: 'Projects', icon: FolderKanban },
        { path: '/team', label: 'Team', icon: UserCheck },
        { path: '/users', label: 'Users', icon: Users },
        { path: '/admin-users', label: 'Admin Users', icon: UserCog },
        { path: '/contact', label: 'Contact Messages', icon: MessageSquare },
        { path: '/events', label: 'Events', icon: Calendar },
        { path: '/testimonials', label: 'Testimonials', icon: Star },
        { path: '/applications', label: 'Service Applications', icon: Users },
        { path: '/certificates', label: 'Certificates', icon: Award },
        { path: '/internship-applications', label: 'Internship Applications', icon: Users },
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
                background: '#ffffff',
                borderRight: '1px solid #e5e7eb',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                zIndex: 50,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
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
                            color: '#64748b',
                            fontWeight: '500'
                        }}>Admin Panel</p>
                    </div>
                </div>

                {/* Navigation Label */}
                <p style={{
                    fontSize: '0.6875rem',
                    fontWeight: '600',
                    color: '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '0.75rem',
                    paddingLeft: '0.75rem'
                }}>
                    Menu
                </p>

                {/* Navigation */}
                <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
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
                                color: isActive(item.path) ? '#f97316' : '#4b5563',
                                background: isActive(item.path)
                                    ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(249, 115, 22, 0.05))'
                                    : 'transparent',
                                textDecoration: 'none',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                border: isActive(item.path)
                                    ? '1px solid rgba(249, 115, 22, 0.2)'
                                    : '1px solid transparent',
                                fontWeight: isActive(item.path) ? '600' : '500'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive(item.path)) {
                                    e.currentTarget.style.background = 'rgba(243, 244, 246, 0.8)';
                                    e.currentTarget.style.color = '#1e293b';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive(item.path)) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#4b5563';
                                }
                            }}
                        >
                            <item.icon
                                size={20}
                                style={{
                                    color: isActive(item.path) ? '#f97316' : '#9ca3af',
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
                        color: '#dc2626',
                        background: 'rgba(220, 38, 38, 0.1)',
                        border: '1px solid rgba(220, 38, 38, 0.2)',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(220, 38, 38, 0.15)';
                        e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(220, 38, 38, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.2)';
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
                
                /* Custom scrollbar for navigation */
                nav::-webkit-scrollbar {
                    width: 6px;
                }
                
                nav::-webkit-scrollbar-track {
                    background: rgba(241, 245, 249, 0.5);
                    border-radius: 3px;
                }
                
                nav::-webkit-scrollbar-thumb {
                    background: rgba(249, 115, 22, 0.3);
                    border-radius: 3px;
                }
                
                nav::-webkit-scrollbar-thumb:hover {
                    background: rgba(249, 115, 22, 0.5);
                }
            `}</style>
        </div>
    );
}
