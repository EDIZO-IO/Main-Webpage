import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu, X, Home, Briefcase, Code, Users, Phone, ChevronRight, Sparkles, GraduationCap,
  LogIn, UserPlus, LogOut, User
} from 'lucide-react';
import Logo from './Logo.jsx';

const navLinks = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Services', path: '/services', icon: Code },
  { name: 'Projects', path: '/projects', icon: Briefcase },
  { name: 'Internships', path: '/internships', icon: GraduationCap },
  { name: 'About', path: '/about', icon: Users },
  { name: 'Contact', path: '/contact', icon: Phone },
];

const Header = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const mobileNavRef = useRef(null);
  const userMenuRef = useRef(null);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    };
    checkAuth();
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 18);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setShowUserMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && mobileNavRef.current && !mobileNavRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowUserMenu(false);
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      {/* HEADER */}
      <header
        className={`
          fixed w-full top-0 z-50 transition-all duration-300
          ${isScrolled ? 'py-2' : 'py-3'}
        `}
        role="banner"
      >
        {/* Header Container */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`
              relative flex items-center justify-between
              px-4 sm:px-6 lg:px-8
              rounded-2xl
              transition-all duration-300
              ${isScrolled
                ? 'h-16 bg-white shadow-lg border border-gray-200'
                : 'h-16 bg-white shadow-md border border-gray-200'}
            `}
          >
            {/* Gradient accent line at top */}
            <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent rounded-full" />

            {/* Logo */}
            <Link to="/" className="relative z-10 flex-shrink-0 hover:scale-[1.02] transition-transform duration-200" aria-label="Edizo Home">
              <Logo isScrolled={isScrolled} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isHovered = hoveredLink === link.path;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onMouseEnter={() => setHoveredLink(link.path)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={({ isActive }) =>
                      `
                      relative font-semibold text-base px-4 py-3 rounded-xl
                      flex items-center gap-2 group transition-all duration-200
                      ${isActive
                        ? 'text-white bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 shadow-lg shadow-orange-500/25'
                        : isHovered
                          ? 'text-gray-800 bg-gray-100'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}
                      `
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Icon */}
                        <span className="relative z-10">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-700'}`} />
                        </span>
                        {/* Text */}
                        <span className="relative z-10">{link.name}</span>
                        {/* Underline for active state */}
                        {isActive && (
                          <div className="absolute bottom-1 left-4 right-4 h-0.5 bg-white/50 rounded-full" />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span>{user.fullName?.split(' ')[0] || 'User'}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{user.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/profile');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-orange-500 text-orange-500 font-semibold hover:bg-orange-50 transition-all duration-200"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all duration-200"
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className={`
                lg:hidden relative z-20 p-3 rounded-xl
                transition-all duration-200
                ${isMenuOpen
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              `}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer with Glass Effect */}
          <div
            ref={mobileNavRef}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm z-50 flex flex-col transform transition-transform duration-300 overflow-hidden"
            style={{
              background: 'white',
              boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Decorative gradient overlays */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-500/20 via-red-100/10 to-transparent rounded-bl-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-red-200/20 to-transparent rounded-tr-full pointer-events-none" />

            {/* Header */}
            <div
              className="relative z-10 m-4 mb-2 p-5 rounded-2xl"
              style={{
                background: 'white',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div className="flex items-center justify-between">
                <Logo isScrolled={true} />
                <button
                  className="p-3 rounded-xl transition-all duration-200 group hover:scale-105"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <X className="w-5 h-5 text-gray-700 group-hover:text-orange-600 transition-colors" />
                </button>
              </div>
            </div>

            {/* User Auth Section (Mobile) */}
            {user ? (
              <div className="mx-4 mb-2 p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{user.fullName}</p>
                    <p className="text-white/80 text-sm">{user.email}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition-all flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="mx-4 mb-2 p-4 rounded-2xl bg-gray-50">
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-3 rounded-xl border-2 border-orange-500 text-orange-500 font-semibold hover:bg-orange-50 transition-all flex items-center justify-center gap-2"
                  >
                    <LogIn className="w-4 h-4" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign Up
                  </Link>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-2 relative z-10">
              <ul className="space-y-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <li key={link.path}>
                      <NavLink
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                          `
                          flex items-center justify-between w-full p-4 rounded-2xl
                          font-semibold text-base transition-all duration-200
                          ${isActive
                            ? 'bg-gradient-to-r from-orange-500 via-red-500 to-orange-400 text-white shadow-lg shadow-orange-500/30'
                            : 'text-gray-800 hover:text-orange-600'}
                          `
                        }
                        style={({ isActive }) => !isActive ? {
                          background: 'white',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                        } : undefined}
                      >
                        {({ isActive }) => (
                          <>
                            <div className="flex items-center gap-4">
                              <div className={`
                                p-2.5 rounded-xl shadow-lg
                                ${isActive
                                  ? 'bg-gray-100 shadow-gray-200/50'
                                  : 'bg-gradient-to-br from-orange-500 to-red-500 shadow-orange-300/50'}
                              `}>
                                <Icon className={`w-5 h-5 ${isActive ? 'text-gray-800' : 'text-white'}`} />
                              </div>
                              <span className={`font-semibold ${isActive ? 'text-white' : 'text-gray-800'}`}>{link.name}</span>
                            </div>
                            <ChevronRight className={`w-5 h-5 ${isActive ? 'text-white/20' : 'text-gray-600'}`} />
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
