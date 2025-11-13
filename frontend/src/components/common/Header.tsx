import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Menu, X, Home, Briefcase, BookOpen, Code, Users, Phone,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { useGoogleEvents } from '../hooks/useGoogleEvents';
import './Header.animation.css';

const navLinks = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Services', path: '/services', icon: Code },
  { name: 'About', path: '/about', icon: Users },
  { name: 'Internships', path: '/internships', icon: Users },
  { name: 'Blogs', path: '/blogs', icon: BookOpen },
  { name: 'Projects', path: '/projects', icon: Briefcase },
  { name: 'Contact', path: '/contact', icon: Phone },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  const { getActiveEvent } = useGoogleEvents();
  const activeEvent = getActiveEvent();

  // Festival glass style map
  const getFestivalTheme = () => {
    if (!activeEvent) return '';
    const themeMap: Record<string, string> = {
      'diwali': 'bg-gradient-to-r from-yellow-100 via-white to-orange-100 bg-blend-hard-light',
      'holi': 'bg-gradient-to-br from-pink-50 via-cyan-50 to-violet-100 bg-blend-hard-light',
      // ... add any custom
    };
    return themeMap[activeEvent.animation] || '';
  };
  const festivalThemeClass = getFestivalTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 18);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMenuOpen && mobileNavRef.current && !mobileNavRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <>
      {/* GLASS HEADER */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`
          fixed w-full top-0 z-50 transition-all duration-300 
          ${isScrolled
            ? 'bg-white/50 border-b border-gray-100 shadow-lg backdrop-blur-xl'
            : 'bg-white/30 border-b border-white/20 shadow-sm backdrop-blur-3xl'}
          ${festivalThemeClass}
        `}
        style={{
          boxShadow: isScrolled
            ? '0 8px 30px 0 rgba(31,41,55,0.08), 0 1.5px 0 0 rgba(244,63,94,0.11)'
            : '0 1.5px 0 0 rgba(255,255,255,0.13)',
          borderBottom: '1.5px solid rgba(200,200,255,0.085)'
        }}
        role="banner"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 header-content">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="relative z-10" aria-label="Edizo Home">
              <Logo isScrolled={isScrolled} />
            </Link>
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `
                      relative font-medium text-sm px-4 py-2.5 rounded-xl
                      flex items-center gap-2 group transition-all ring-1 ring-inset ring-white/30 shadow backdrop-blur-2xl
                      ${isActive
                        ? 'text-orange-600 bg-white/70 ring-orange-300'
                        : 'text-slate-700 hover:text-orange-500 hover:bg-white/60'}
                      `}
                    style={{
                      backdropFilter: 'blur(7px) saturate(1.28)'
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </NavLink>
                );
              })}
            </nav>
            {/* Mobile menu button */}
            <div className="flex items-center gap-2">
              <button
                className="lg:hidden z-20 p-2.5 rounded-xl hover:bg-white/70 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 shadow"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? <X className="w-6 h-6 text-gray-900" /> : <Menu className="w-6 h-6 text-gray-900" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>
      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              ref={mobileNavRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className={`
                fixed top-0 right-0 bottom-0 w-full max-w-sm
                rounded-l-2xl
                bg-white/60 border-l border-white/40
                shadow-2xl z-50 flex flex-col
                backdrop-blur-[25px] bg-opacity-80
                ${festivalThemeClass}
              `}
              style={{
                boxShadow:
                  '0 10px 40px 0 rgba(244,100,63,0.15),0 2px 16px 0 rgba(65,65,65,0.08)'
              }}
            >
              <div className="flex items-center justify-between p-6 border-b border-white/20 bg-white/50 backdrop-blur-xl">
                <Logo isScrolled={true} />
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}>
                  <X className="w-6 h-6 text-gray-900" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-6 relative z-10">
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
                            flex items-center gap-4 w-full p-4 rounded-xl
                            font-semibold transition-all
                            ring-1 ring-inset ring-white/30 shadow backdrop-blur-xl
                            ${isActive
                              ? 'bg-gradient-to-r from-orange-400 to-red-400 text-white shadow-lg ring-0'
                              : 'text-slate-700 hover:text-gray-900 hover:bg-white/40'}
                            `
                          }
                          style={{ backdropFilter: 'blur(10px) saturate(1.26)' }}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{link.name}</span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <div className="p-6 border-t border-white/20 bg-white/40 backdrop-blur-xl">
                <p className="text-sm text-gray-700 text-center font-mono">
                  © {new Date().getFullYear()} Edizo. All rights reserved.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
