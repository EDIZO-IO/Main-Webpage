// src/components/common/Header.tsx
import { useState, useEffect, useRef } from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { auth, googleProvider } from '../../firebaseConfig';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { toast, ToastContainer } from 'react-toastify';
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

  // Handle authentication state changes
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    
    const initAuth = async () => {
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
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
    };

    initAuth();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on Escape
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

  // Close menus when location changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Successfully signed in!');
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
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsProfileOpen(false);
      toast.info('You have been signed out');
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

  const handleMobileNavigation = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  // Show loading indicator while initializing auth
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

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100'
            : 'bg-white/80 backdrop-blur-md'
        }`}
        role="banner"
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              className="relative z-10 flex items-center gap-3 group"
              aria-label="Edizo Home"
            >
              <Logo isScrolled={isScrolled} />
           
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative font-medium text-sm px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-red-600 bg-red-50'
                        : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            {/* Desktop CTA & Profile */}
            <div className="hidden lg:flex items-center gap-4">
              {user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-haspopup="true"
                    aria-expanded={isProfileOpen}
                    aria-label="User profile"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={`${user.name}'s profile`}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden origin-top-right"
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
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLogout();
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                          >
                            <LogOut size={18} />
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
                  className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <UserIcon size={18} />
                      Sign In
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden z-20 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-900" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900" />
              )}
            </button>
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
              aria-hidden="true"
            />

            <motion.div
              ref={mobileNavRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col"
              role="navigation"
              aria-label="Mobile navigation"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Logo isScrolled={true} />
             
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close mobile menu"
                >
                  <X className="w-6 h-6 text-gray-900" />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex-1 overflow-y-auto p-6">
                <ul className="space-y-2">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <li key={link.name}>
                        <button
                          onClick={() => handleMobileNavigation(link.path)}
                          className={`flex items-center gap-4 w-full p-4 rounded-xl transition-all duration-200 font-medium text-left ${
                            isActive
                              ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <link.icon className="w-5 h-5" />
                          <span>{link.name}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {/* Mobile Auth Section */}
                {user ? (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl">
                      <div className="flex items-center gap-3 mb-4">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={`${user.name}'s profile`}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow"
                          />
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-600 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
                      >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleGoogleSignIn();
                      }}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
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
                    </button>
                  </div>
                )}
              </nav>

              {/* Mobile Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50">
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
      />
    </>
  );
};

export default Header;
