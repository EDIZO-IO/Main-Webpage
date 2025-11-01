// src/components/common/Header.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
// Remove useLocation import from react-router-dom
import { Link, NavLink } from 'react-router-dom';
import {
  Menu,
  X,
  Home,
  Briefcase,
  Code,
  Users,
  Phone,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Mail,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { auth, googleProvider } from '../../firebaseConfig';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth'; // ✅ Use type-only import
import { toast, ToastContainer } from 'react-toastify';
import { useGoogleEvents } from '../hooks/useGoogleEvents';

import 'react-toastify/dist/ReactToastify.css';
import './Header.animation.css';

interface UserData {
  name: string;
  email: string;
  photoURL?: string;
}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mobileNavRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  // Remove the useLocation hook - we don't need it here anymore as NavLink handles active state

  const { getActiveEvent } = useGoogleEvents();
  const activeEvent = getActiveEvent();

  // Memoize auth state change handler
  const handleAuthStateChange = useCallback((firebaseUser: User | null) => {
    if (firebaseUser) {
      const userData: UserData = {
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        photoURL: firebaseUser.photoURL || ''
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isAuthenticated', 'true');
    } else {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const initAuth = async () => {
      setIsLoading(true); // Ensure loading state is set on mount
      unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);
    };
    initAuth();
    return () => { 
      if (unsubscribe) unsubscribe(); 
    };
  }, [handleAuthStateChange]); // Add handleAuthStateChange as a dependency

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll(); // Check initial scroll state
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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Successfully signed in! 🎉', { className: 'custom-toast-success' });
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      let errorMessage = 'Failed to sign in. Please try again.';
      switch (error.code) {
        case 'auth/popup-blocked':
          errorMessage = 'Popup blocked by browser. Please allow popups for this site.';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Sign-in process was cancelled.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Sign-in method not enabled. Please contact support.';
          break;
        default:
          errorMessage = error.message || errorMessage;
      }
      toast.error(errorMessage, { className: 'custom-toast-error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Explicitly close profile dropdown after logout
      setIsProfileOpen(false);
      toast.info('You have been signed out 👋', { className: 'custom-toast-info' });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Services', path: '/services', icon: Code },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Internships', path: '/internships', icon: Users },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

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

  if (isLoading) {
    return (
      <header className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <div className="animate-pulse bg-gray-200 rounded h-8 w-32"></div>
            </div>
            <div className="animate-pulse bg-gray-200 rounded h-10 w-24"></div>
          </div>
        </div>
      </header>
    );
  }

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
        <div className="container mx-auto px-6 lg:px-8 header-content">
          <div className="flex items-center justify-between h-20">
            {/* Logo + Event Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-2 sm:gap-3 min-w-0"
            >
              <Link to="/" className="relative z-10" aria-label="Edizo Home">
                <Logo isScrolled={isScrolled} />
              </Link>

              {/* Event name – desktop pill */}
              {activeEvent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, x: -8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                  className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold shadow-sm hover:shadow-md transition-all duration-300 cursor-default
                             bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border border-orange-200/60"
                  aria-label={`Current event: ${activeEvent.summary}`}
                  title={activeEvent.summary}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="max-w-[220px] truncate">{activeEvent.summary}</span>
                </motion.div>
              )}

              {/* Event name – compact mobile pill */}
              {activeEvent && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="md:hidden max-w-[40vw] px-2.5 py-1.5 rounded-full text-[11px] font-semibold shadow-sm
                             bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border border-orange-200/60 truncate"
                  aria-label={`Current event: ${activeEvent.summary}`}
                  title={activeEvent.summary}
                >
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span className="truncate">{activeEvent.summary}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navLinks.map((link, index) => {
                const Icon = link.icon;

                return (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.15 + index * 0.08,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        `
                        relative font-medium text-sm px-4 py-2.5 rounded-xl 
                        transition-all duration-300 flex items-center gap-2 group
                        ${isActive
                          ? 'text-red-600 bg-red-50 shadow-sm'
                          : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                        }
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          <motion.div
                            animate={{ 
                              rotate: isActive ? [0, 12, -12, 0] : 0,
                              scale: isActive ? [1, 1.15, 1] : 1
                            }}
                            transition={{ 
                              duration: 0.6, 
                              delay: index * 0.1,
                              repeat: isActive ? Infinity : 0,
                              repeatDelay: 3
                            }}
                            className="relative"
                          >
                            <Icon className="w-4 h-4" />
                            {isActive && (
                              <motion.div
                                className="absolute -inset-1 bg-red-400 rounded-full opacity-20 blur-sm"
                                animate={{
                                  scale: [1, 1.3, 1],
                                  opacity: [0.2, 0.4, 0.2]
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut"
                                }}
                              />
                            )}
                          </motion.div>

                          <span className="relative">
                            {link.name}
                            {isActive && (
                              <motion.div
                                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600 rounded-full"
                                layoutId="activeNavUnderline"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                            )}
                          </span>

                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-red-50 via-orange-50 to-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                            whileHover={{
                              scale: 1.05,
                              transition: { duration: 0.2 }
                            }}
                          />
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                );
              })}
            </nav>

            {/* Desktop CTA & Profile */}
            <motion.div 
              className="hidden lg:flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {user ? (
                <div className="relative" ref={profileRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 group"
                  >
                    {user.photoURL ? (
                      <motion.img
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        src={user.photoURL}
                        alt={`${user.name}'s profile`}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200 group-hover:ring-red-300 transition-all duration-300"
                      />
                    ) : (
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-semibold text-sm shadow-md"
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </motion.div>
                    )}
                    <motion.div
                      animate={{ rotate: isProfileOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-red-600 transition-colors" />
                    </motion.div>
                  </motion.button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden origin-top-right"
                      >
                        <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            {user.photoURL ? (
                              <img
                                src={user.photoURL}
                                alt={`${user.name}'s profile`}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                              <p className="text-xs text-gray-600 truncate flex items-center gap-1">
                                <Mail size={12} />
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <motion.button
                            whileHover={{ scale: 1.02, x: 3 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-medium group"
                          >
                            <LogOut size={18} className="group-hover:rotate-12 transition-transform duration-200" />
                            <span>Sign Out</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(239, 68, 68, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="relative px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group sign"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <motion.div
                    animate={isLoading ? { rotate: 360 } : {}}
                    transition={isLoading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}
                  >
                    <UserIcon size={18} className="relative z-10" />
                  </motion.div>
                  <span className="relative z-10">{isLoading ? 'Signing in...' : 'Sign In'}</span>
                </motion.button>
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="lg:hidden z-20 p-2.5 rounded-xl hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6 text-gray-900" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6 text-gray-900" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
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
              <div className="flex items-center justify-between p-6 border-b border-gray-100 relative z-10 bg-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 min-w-0">
                  <Logo isScrolled={true} />
                  {activeEvent && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="max-w-[60vw] px-3 py-1.5 rounded-full text-[11px] font-semibold shadow-sm
                                 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border border-orange-200/60"
                      aria-label={`Current event: ${activeEvent.summary}`}
                      title={activeEvent.summary}
                    >
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        <span className="truncate">{activeEvent.summary}</span>
                      </div>
                    </motion.div>
                  )}
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6 text-gray-900" />
                </motion.button>
              </div>

              <nav className="flex-1 overflow-y-auto p-6 relative z-10">
                <ul className="space-y-2">
                  {navLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <motion.li 
                        key={link.path}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
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
                          `}
                        >
                          {({ isActive }) => (
                            <>
                              <Icon className="w-5 h-5" />
                              <span>{link.name}</span>
                              {isActive && (
                                <motion.span
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  className="ml-auto"
                                >
                                  <Sparkles className="w-4 h-4" />
                                </motion.span>
                              )}
                            </>
                          )}
                        </NavLink>
                      </motion.li>
                    );
                  })}
                </ul>

                {user ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 pt-6 border-t border-gray-200"
                  >
                    <div className="p-4 bg-white/70 backdrop-blur-sm rounded-xl shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="Profile" className="w-12 h-12 rounded-full ring-2 ring-white shadow" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-semibold text-lg shadow">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                          <p className="text-sm text-gray-600 truncate">{user.email}</p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-600 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
                      >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 pt-6 border-t border-gray-200"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { setIsMenuOpen(false); handleGoogleSignIn(); }}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all font-medium sign"
                    >
                      {isLoading ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                          Signing in...
                        </>
                      ) : (
                        <>
                          <UserIcon size={18} />
                          <span>Sign In with Google</span>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </nav>

              <div className="p-6 border-t border-gray-200 bg-white/50 backdrop-blur-sm relative z-10">
                <p className="text-sm text-gray-600 text-center">
                  © {new Date().getFullYear()} Edizo. All rights reserved.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="mt-20"
        toastClassName="shadow-xl"
        limit={3}
      />
    </>
  );
};

export default Header;
