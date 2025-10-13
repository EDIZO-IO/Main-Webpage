// src/components/common/Header.tsx - COMPLETE UPDATED VERSION
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Logo from './Logo';
import { auth, googleProvider } from '../../firebaseConfig';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import { useGoogleEvents } from '../hooks/useGoogleEvents';
import 'react-toastify/dist/ReactToastify.css';

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
  const location = useLocation();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // Google Events Integration - Only for getting active event
  const { getActiveEvent } = useGoogleEvents();
  const activeEvent = getActiveEvent();

  // Navigation links configuration
  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Services', path: '/services', icon: Code },
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Internships', path: '/internships', icon: Users },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  // Handle authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
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
    });

    return () => unsubscribe();
  }, []);

  // Optimized scroll handler with throttling
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on Escape key
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

  // Close menus on outside click
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

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Handle Google Sign In with improved error handling
  const handleGoogleSignIn = useCallback(async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Welcome! Successfully signed in.', {
        className: 'custom-toast-success',
        style: { borderLeft: '4px solid #10b981' }
      });
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      
      const errorMessages: Record<string, string> = {
        'auth/popup-blocked': 'Popup blocked. Please allow popups for this site.',
        'auth/cancelled-popup-request': 'Sign-in cancelled. Please try again.',
        'auth/network-request-failed': 'Network error. Check your connection.',
        'auth/operation-not-allowed': 'Sign-in method disabled. Contact support.',
        'auth/popup-closed-by-user': 'Sign-in popup closed. Please try again.',
        'auth/unauthorized-domain': 'This domain is not authorized for sign-in.',
      };
      
      const errorMessage = errorMessages[error.code] || error.message || 'Failed to sign in. Please try again.';
      toast.error(errorMessage, {
        className: 'custom-toast-error',
        style: { borderLeft: '4px solid #ef4444' }
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      setIsProfileOpen(false);
      toast.info('Signed out successfully', {
        className: 'custom-toast-info',
        style: { borderLeft: '4px solid #3b82f6' }
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  }, []);

  // Handle mobile navigation
  const handleMobileNavigation = useCallback((path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  }, [navigate]);

  // Get festival background class based on active event
  const getFestivalBackground = () => {
    if (!activeEvent) return '';
    
    // Map event types to background themes
    const themeMap: Record<string, string> = {
      'tricolor-wave': 'tricolor',
      'color-burst': 'holi',
      'diya-glow': 'diwali',
      'harvest-celebration': 'pongal',
      'fireworks': 'newyear',
      'festive-snow': 'christmas',
      'garba-dance': 'holi',
      'kite-fly': 'pongal'
    };

    const theme = themeMap[activeEvent.animation] || 'default';
    return `festival-bg-${theme}`;
  };

  // Animation variants
  const headerVariants = {
    hidden: { y: shouldReduceMotion ? 0 : -100, opacity: shouldReduceMotion ? 1 : 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: shouldReduceMotion ? 0 : 0.5, 
        ease: [0.22, 1, 0.36, 1] 
      }
    }
  };

  const mobileMenuVariants = {
    hidden: { x: shouldReduceMotion ? 0 : '100%', opacity: shouldReduceMotion ? 0 : 1 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: shouldReduceMotion ? { duration: 0.2 } : { type: 'spring', damping: 30, stiffness: 300 }
    },
    exit: { 
      x: shouldReduceMotion ? 0 : '100%', 
      opacity: shouldReduceMotion ? 0 : 1,
      transition: { duration: shouldReduceMotion ? 0.2 : 0.3 }
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10, scale: shouldReduceMotion ? 1 : 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, y: shouldReduceMotion ? 0 : 10, scale: shouldReduceMotion ? 1 : 0.95, transition: { duration: 0.1 } }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <header 
        className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
        role="banner"
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <style>{`
        /* Toast Custom Styles */
        .custom-toast-success::before { content: '🎉'; font-size: 20px; margin-right: 8px; }
        .custom-toast-error::before { content: '⚠️'; font-size: 20px; margin-right: 8px; }
        .custom-toast-info::before { content: '👋'; font-size: 20px; margin-right: 8px; }

        /* Tricolor Theme - Independence Day, Republic Day, Gandhi Jayanti */
        .festival-bg-tricolor::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, 
            #FF9933 0%, #FF9933 20%,
            #FFFFFF 20%, #FFFFFF 50%,
            #138808 50%, #138808 80%,
            transparent 80%
          );
          opacity: 0.15;
          animation: tricolor-wave 8s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes tricolor-wave {
          0%, 100% { background-position: 0% 50%; opacity: 0.15; }
          50% { background-position: 100% 50%; opacity: 0.25; }
        }

        .festival-bg-tricolor::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(255, 153, 51, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(19, 136, 8, 0.1) 0%, transparent 50%);
          animation: flag-sparkle 4s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes flag-sparkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        /* Holi Theme - Color Festival */
        .festival-bg-holi::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 10% 20%, rgba(255, 107, 157, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 90% 40%, rgba(255, 217, 61, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(107, 203, 119, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 30% 60%, rgba(77, 150, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(199, 36, 177, 0.15) 0%, transparent 50%);
          animation: holi-burst 6s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes holi-burst {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }

        .festival-bg-holi::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            repeating-radial-gradient(circle at 15% 30%, transparent 0, transparent 10px, rgba(255, 107, 157, 0.05) 10px, rgba(255, 107, 157, 0.05) 20px),
            repeating-radial-gradient(circle at 85% 70%, transparent 0, transparent 10px, rgba(255, 217, 61, 0.05) 10px, rgba(255, 217, 61, 0.05) 20px);
          animation: color-splash 5s linear infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes color-splash {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Diwali Theme - Lights and Diyas */
        .festival-bg-diwali::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 80% 50%, rgba(255, 107, 53, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 50% 70%, rgba(247, 184, 1, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 15% 80%, rgba(230, 57, 70, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 85% 20%, rgba(255, 215, 0, 0.15) 0%, transparent 40%);
          animation: diya-glow 4s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes diya-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }

        .festival-bg-diwali::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(2px 2px at 20% 30%, rgba(255, 215, 0, 0.8), transparent),
            radial-gradient(2px 2px at 60% 70%, rgba(255, 107, 53, 0.8), transparent),
            radial-gradient(2px 2px at 50% 50%, rgba(247, 184, 1, 0.8), transparent),
            radial-gradient(2px 2px at 80% 10%, rgba(255, 215, 0, 0.8), transparent),
            radial-gradient(2px 2px at 90% 60%, rgba(230, 57, 70, 0.8), transparent),
            radial-gradient(2px 2px at 30% 80%, rgba(255, 215, 0, 0.8), transparent);
          background-size: 200px 200px;
          animation: sparkle 3s linear infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }

        /* Pongal/Tamil New Year Theme - Harvest Colors */
        .festival-bg-pongal::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 30% 40%, rgba(247, 184, 1, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 60%, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(255, 153, 51, 0.15) 0%, transparent 50%),
            linear-gradient(135deg, rgba(247, 184, 1, 0.05) 0%, transparent 50%);
          animation: harvest-glow 5s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes harvest-glow {
          0%, 100% { opacity: 0.5; transform: translateY(0); }
          50% { opacity: 0.8; transform: translateY(-5px); }
        }

        .festival-bg-pongal::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(247, 184, 1, 0.03) 20px, rgba(247, 184, 1, 0.03) 40px),
            repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(255, 153, 51, 0.03) 20px, rgba(255, 153, 51, 0.03) 40px);
          animation: kolam-pattern 20s linear infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes kolam-pattern {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }

        /* New Year Theme - Fireworks */
        .festival-bg-newyear::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.2) 0%, transparent 30%),
            radial-gradient(circle at 75% 35%, rgba(255, 20, 147, 0.2) 0%, transparent 30%),
            radial-gradient(circle at 50% 60%, rgba(0, 206, 209, 0.2) 0%, transparent 30%),
            radial-gradient(circle at 20% 80%, rgba(255, 99, 71, 0.2) 0%, transparent 30%),
            radial-gradient(circle at 85% 75%, rgba(255, 215, 0, 0.2) 0%, transparent 30%);
          animation: firework-burst 3s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes firework-burst {
          0% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 0.8; transform: scale(1.1); }
          100% { opacity: 0; transform: scale(1.5); }
        }

        /* Christmas Theme - Snow and Lights */
        .festival-bg-christmas::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 40%, rgba(196, 30, 58, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 80% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 50% 70%, rgba(15, 134, 68, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 70% 80%, rgba(196, 30, 58, 0.1) 0%, transparent 40%);
          animation: christmas-glow 4s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes christmas-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }

        .festival-bg-christmas::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(2px 2px at 20% 10%, white, transparent),
            radial-gradient(2px 2px at 60% 30%, white, transparent),
            radial-gradient(2px 2px at 50% 60%, white, transparent),
            radial-gradient(2px 2px at 80% 40%, white, transparent),
            radial-gradient(2px 2px at 90% 70%, white, transparent);
          background-size: 150px 150px;
          animation: snowfall 15s linear infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes snowfall {
          0% { background-position: 0 0; opacity: 0.5; }
          100% { background-position: 0 150px; opacity: 0.8; }
        }

        /* Company Events Background */
        .festival-bg-default::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(239, 68, 68, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 80% 50%, rgba(249, 115, 22, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 50% 70%, rgba(251, 191, 36, 0.1) 0%, transparent 40%);
          animation: company-glow 5s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes company-glow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }

        /* Ensure content is above festival backgrounds */
        .header-content {
          position: relative;
          z-index: 1;
        }
      `}</style>

      <motion.header
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${getFestivalBackground()} ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100'
            : 'bg-white/80 backdrop-blur-md'
        }`}
        role="banner"
      >
        <div className="container mx-auto px-6 lg:px-8 header-content">
          <div className="flex items-center justify-between h-20">
            {/* Logo with Festival Animation */}
            <Link
              to="/"
              className="relative z-10 flex items-center group focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg"
              aria-label="Edizo Home - Navigate to homepage"
            >
              <Logo isScrolled={isScrolled} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative font-medium text-sm px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                      isActive
                        ? 'text-red-600 bg-red-50'
                        : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                    }`
                  }
                  aria-label={`Navigate to ${link.name}`}
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Auth Section - ONLY Google Sign In */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-haspopup="true"
                    aria-expanded={isProfileOpen}
                    aria-label={`User menu for ${user.name}`}
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                        loading="lazy"
                      />
                    ) : (
                      <div 
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-semibold text-sm"
                        aria-label={`Profile picture for ${user.name}`}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <ChevronDown 
                      className={`w-4 h-4 text-gray-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden origin-top-right"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            {user.photoURL ? (
                              <img
                                src={user.photoURL}
                                alt=""
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                              <p className="text-xs text-gray-600 truncate flex items-center gap-1">
                                <Mail size={12} aria-hidden="true" />
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="p-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                            role="menuitem"
                          >
                            <LogOut size={18} aria-hidden="true" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  aria-label="Sign in with Google"
                >
                  {isLoading ? (
                    <>
                      <span 
                        className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
                        aria-hidden="true"
                      />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <UserIcon size={18} aria-hidden="true" />
                      <span>Sign In</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden z-20 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-controls="mobile-menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-900" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              ref={mobileNavRef}
              id="mobile-menu"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col lg:hidden ${getFestivalBackground()}`}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation menu"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50 header-content">
                <Link 
                  to="/" 
                  className="flex items-center focus:outline-none focus:ring-2 focus:ring-red-500 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Edizo Home"
                >
                  <Logo isScrolled={true} />
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Close mobile menu"
                >
                  <X className="w-6 h-6 text-gray-900" aria-hidden="true" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-6 header-content" aria-label="Mobile primary navigation">
                <ul className="space-y-2" role="list">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <li key={link.name}>
                        <button
                          onClick={() => handleMobileNavigation(link.path)}
                          className={`flex items-center gap-4 w-full p-4 rounded-xl transition-all duration-200 font-medium text-left focus:outline-none focus:ring-2 focus:ring-red-500 ${
                            isActive
                              ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg'
                              : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <link.icon className="w-5 h-5" aria-hidden="true" />
                          <span>{link.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {user ? (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow" loading="lazy" />
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
                      <button
                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-600 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <LogOut size={18} aria-hidden="true" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <button
                      onClick={() => { setIsMenuOpen(false); handleGoogleSignIn(); }}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg hover:shadow-lg active:scale-95 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      aria-label="Sign in with Google"
                    >
                      {isLoading ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" aria-hidden="true" />
                          <span>Signing in...</span>
                        </>
                      ) : (
                        <>
                          <UserIcon size={18} aria-hidden="true" />
                          <span>Sign In with Google</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </nav>

              <div className="p-6 border-t border-gray-100 bg-gray-50 header-content">
                <p className="text-sm text-gray-600 text-center">© {new Date().getFullYear()} Edizo. All rights reserved.</p>
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
