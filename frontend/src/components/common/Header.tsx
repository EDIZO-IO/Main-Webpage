// src/components/common/Header.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Briefcase,
  BookOpen,
  Code,
  Users,
  Phone,
  ChevronDown,
  Sparkles,
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { getActiveEvent } = useGoogleEvents();
  const activeEvent = getActiveEvent();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMenuOpen && mobileNavRef.current && !mobileNavRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
      if (isProfileOpen && profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, isProfileOpen]);

  const getFestivalTheme = () => {
    if (!activeEvent) return 'festival-bg-default';
    const themeMap: Record<string, string> = {
      'diwali': 'festival-bg-diwali',
      'diya-glow': 'festival-bg-diya-glow',
      'holi': 'festival-bg-holi',
      'color-burst': 'festival-bg-color-burst',
      'navratri': 'festival-bg-navratri',
      'durga-puja': 'festival-bg-durga-puja',
      'garba-dance': 'festival-bg-garba-dance',
      'independence-day': 'festival-bg-independence-day',
      'republic-day': 'festival-bg-republic-day',
      'gandhi-jayanti': 'festival-bg-gandhi-jayanti',
      'pongal': 'festival-bg-pongal',
      'makar-sankranti': 'festival-bg-makar-sankranti',
      'harvest-celebration': 'festival-bg-harvest-celebration',
      'tamil-new-year': 'festival-bg-tamil-new-year',
      'ugadi': 'festival-bg-ugadi',
      'janmashtami': 'festival-bg-janmashtami',
      'krishna-leela': 'festival-bg-krishna-leela',
      'raksha-bandhan': 'festival-bg-raksha-bandhan',
      'thread-sparkle': 'festival-bg-thread-sparkle',
      'eid': 'festival-bg-eid',
      'moon-glow': 'festival-bg-moon-glow',
      'onam': 'festival-bg-onam',
      'baisakhi': 'festival-bg-baisakhi',
      'lohri': 'festival-bg-lohri',
      'bonfire-glow': 'festival-bg-bonfire-glow',
      'dussehra': 'festival-bg-dussehra',
      'victory-sparkle': 'festival-bg-victory-sparkle',
      'christmas': 'festival-bg-christmas',
      'festive-snow': 'festival-bg-festive-snow',
      'new-year': 'festival-bg-new-year',
      'fireworks': 'festival-bg-fireworks',
      'product-launch': 'festival-bg-product-launch',
      'company-pulse': 'festival-bg-company-pulse',
      'team-anniversary': 'festival-bg-team-anniversary',
      'success-celebration': 'festival-bg-success-celebration',
      'milestone-glow': 'festival-bg-milestone-glow',
      'labour-day': 'festival-bg-labour-day',
    };
    return themeMap[activeEvent.animation] || 'festival-bg-default';
  };

  const festivalThemeClass = getFestivalTheme();

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-gray-100'
            : 'bg-white/80 backdrop-blur-md'
        } ${festivalThemeClass}`}
        role="banner"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 header-content">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="relative z-10" aria-label="Edizo Home">
              <Logo isScrolled={isScrolled} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `
                      relative font-medium text-sm px-4 py-2.5 rounded-xl 
                      transition-all duration-300 flex items-center gap-2 group
                      ${isActive
                        ? 'text-red-600 bg-red-50 shadow-sm'
                        : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                      }
                      `
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Profile/Auth Controls - Removed */}
            <div className="flex items-center gap-2">
              {/* Mobile menu button */}
              <button
                className="lg:hidden z-20 p-2.5 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMenuOpen ? <X className="w-6 h-6 text-gray-900"/> : <Menu className="w-6 h-6 text-gray-900"/>}
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              ref={mobileNavRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className={`fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col ${festivalThemeClass}`}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white/50">
                <Logo isScrolled={true} />
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}>
                  <X className="w-6 h-6 text-gray-900"/>
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-6 relative z-10">
                <ul className="space-y-2">
                  {navLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <li key={link.path}>
                        <NavLink
                          to={link.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={({ isActive }) =>
                            `
                            flex items-center gap-4 w-full p-4 rounded-xl transition-all duration-200 font-medium ${
                              isActive
                                ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg'
                                : 'text-gray-700 hover:bg-white/70 bg-white/50 backdrop-blur-sm'
                            }
                            `
                          }
                        >
                          <Icon className="w-5 h-5" />
                          <span>{link.name}</span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </nav>
              <div className="p-6 border-t border-gray-200 bg-white/50">
                <p className="text-sm text-gray-600 text-center">
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