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
import type { User } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
import { useGoogleEvents } from '../hooks/useGoogleEvents';
import 'react-toastify/dist/ReactToastify.css';
import './Header.animation.css';

interface UserData {
  name: string;
  email: string;
  photoURL?: string;
}

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
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const mobileNavRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { getActiveEvent } = useGoogleEvents();
  const activeEvent = getActiveEvent();

  // Auth logic
  const handleAuthStateChange = useCallback((firebaseUser: User | null) => {
    if (firebaseUser) {
      const userData: UserData = {
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        photoURL: firebaseUser.photoURL || '',
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
    setIsLoading(true);
    unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [handleAuthStateChange]);

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

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Successfully signed in! 🎉', { className: 'custom-toast-success' });
    } catch (error: any) {
      let errorMessage = 'Failed to sign in. Please try again.';
      switch (error.code) {
        case 'auth/popup-blocked':
          errorMessage = 'Popup blocked by browser. Please allow popups for this site.'; break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Sign-in process was cancelled.'; break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.'; break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Sign-in method not enabled. Please contact support.'; break;
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
      setIsProfileOpen(false);
      toast.info('You have been signed out 👋', { className: 'custom-toast-info' });
    } catch (error) {
      toast.error('Failed to sign out. Please try again.');
    }
  };

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
            <div className="animate-pulse bg-gray-200 rounded h-8 w-32"></div>
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

            {/* Profile/Auth Controls */}
            <div className="flex items-center gap-2">
              {/* Auth/Profile dropdown */}
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="profile" className="w-8 h-8 rounded-full object-cover"/>
                    ) : (
                      <span className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-red-600 to-orange-500 text-white rounded-full font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                    )}
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        className="absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-2xl border border-gray-100 z-30 p-4"
                      >
                        <div className="mb-2 text-gray-700 font-medium">{user.name}</div>
                        <div className="mb-2 text-gray-500 text-xs flex items-center gap-1"><Mail size={13}/> {user.email}</div>
                        <button onClick={handleLogout} className="w-full mt-2 py-2 rounded-xl text-red-600 hover:bg-gray-50 flex items-center justify-center gap-2 font-semibold">
                          <LogOut size={17}/> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition disabled:opacity-50"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              )}

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
                {/* Auth Buttons for Mobile */}
                {user ? (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="p-4 bg-white/70 rounded-xl shadow-sm flex flex-row items-center gap-3">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full"/>
                      ) : (
                        <span className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-red-600 to-orange-500 text-white rounded-full font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                      )}
                      <span className="font-semibold">{user.name}</span>
                    </div>
                    <button
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                      className="w-full mt-4 px-4 py-2.5 bg-white text-red-600 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm flex gap-2 items-center justify-center"
                    >
                      <LogOut size={18} /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => { setIsMenuOpen(false); handleGoogleSignIn(); }}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg hover:shadow-lg font-medium"
                    >
                      <UserIcon size={18} />
                      {isLoading ? 'Signing in...' : 'Sign In with Google'}
                    </button>
                  </div>
                )}
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