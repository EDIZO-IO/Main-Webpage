// Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Home, Briefcase, Code, Users, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo'; // Make sure your Logo handles isScrolled

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileNavRef = useRef(null);
  const location = useLocation();

  // Detect scroll to apply background and dark text
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll(); // Set initial state
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && mobileNavRef.current && !mobileNavRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

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

        {/* Desktop Navigation */}
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
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-30"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-in Drawer */}
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
              {/* Header Bar */}
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

              {/* Nav Links */}
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
                </ul>
              </nav>

              {/* Footer */}
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