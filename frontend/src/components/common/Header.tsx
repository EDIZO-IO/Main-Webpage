import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Briefcase,
  Code,
  Users,
  Phone,
  User,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const mobileNavRef = useRef(null);
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check auth state
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('isAuthenticated');
    if (stored === 'true') {
      // Mock user — replace with real user data from context/API later
      setUser({ name: 'User' });
    } else {
      setUser(null);
    }
  }, [location.pathname]); // Recheck on route change

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isProfileOpen && profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && mobileNavRef.current && !mobileNavRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setUser(null);
    setIsProfileOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'HOME', path: '/', icon: Home },
    { name: 'SERVICES', path: '/services', icon: Code },
    { name: 'PROJECTS', path: '/projects', icon: Briefcase },
    { name: 'INTERNSHIPS', path: '/internships', icon: Users },
    { name: 'CONTACT', path: '/contact', icon: Phone },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
      style={{ backdropFilter: isScrolled ? 'blur(8px)' : 'none' }}
      role="banner"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-16">
        {/* Logo */}
        <Link to="/" className="z-20 flex items-center" aria-label="Edizo Home">
          <Logo isScrolled={isScrolled} />
        </Link>

        {/* Desktop Navigation — ALWAYS VISIBLE */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive: isRouteActive }) =>
                  `relative font-medium tracking-wide transition-all duration-200 ${
                    isRouteActive
                      ? 'text-red-600 font-semibold'
                      : isScrolled
                      ? 'text-gray-800 hover:text-red-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`
                }
                aria-current={location.pathname === link.path ? 'page' : undefined}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-red-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Desktop Profile Button — Only if logged in */}
        {user && (
          <div className="hidden md:block relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-haspopup="true"
              aria-expanded={isProfileOpen}
              aria-label="User profile"
            >
              <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-medium text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <ChevronDown size={16} className={`text-gray-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          className="md:hidden z-30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg p-2 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? (
            <X className="w-7 h-7 text-gray-900" />
          ) : (
            <Menu className="w-7 h-7 text-gray-900" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-30"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              ref={mobileNavRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-4/5 max-w-sm h-full bg-white shadow-2xl z-40 flex flex-col"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
                <Link
                  to="/"
                  className="text-xl font-bold text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Edizo
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close mobile menu"
                >
                  <X className="w-6 h-6 text-gray-900" />
                </button>
              </div>

              <nav className="flex-1 p-6 bg-gray-50">
                <ul className="space-y-1">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <li key={link.name}>
                        <NavLink
                          to={link.path}
                          className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group ${
                            isActive
                              ? 'bg-red-50 text-red-700 font-semibold'
                              : 'text-gray-800 hover:bg-red-50 active:bg-red-100'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <link.icon
                            className={`w-5 h-5 ${isActive ? 'text-red-600' : 'text-gray-600 group-hover:text-red-600'}`}
                          />
                          <span>{link.name}</span>
                        </NavLink>
                      </li>
                    );
                  })}

                  {/* Mobile Auth Section */}
                  {user && (
                    <li className="pt-4 mt-4 border-t border-gray-200">
                      <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl">
                        <div className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Hello, {user.name}</p>
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsMenuOpen(false);
                            }}
                            className="mt-1 flex items-center gap-1 text-red-600 text-sm"
                          >
                            <LogOut size={14} />
                            Logout
                          </button>
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </nav>

              <div className="p-5 border-t border-gray-200 bg-white text-center">
                <p className="text-sm text-gray-500">
                  © {new Date().getFullYear()} Edizo. All rights reserved.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;