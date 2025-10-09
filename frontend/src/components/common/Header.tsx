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
  Sparkles,
  // New icons for the updated design


} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { auth, googleProvider } from '../../firebaseConfig';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Define a type for the user data
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
      // Set up auth state listener
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
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
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

  // Updated navigation links with more specific icons
  const navLinks = [
    { name: 'HOME', path: '/', icon: Home },
    { name: 'SERVICES', path: '/services', icon: Code },
    { name: 'PROJECTS', path: '/projects', icon: Briefcase },
    { name: 'INTERNSHIPS', path: '/internships', icon: Users },
    { name: 'CONTACT', path: '/contact', icon: Phone },
  ];

  const handleMobileNavigation = (path: string) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  // Show loading indicator while initializing auth
  if (isLoading) {
    return (
      <header className="fixed w-full z-50 bg-gradient-to-r from-red-600 to-orange-500/90 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto rounded-full px-4 md:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center">
              <div className="animate-pulse bg-white/20 rounded-full h-8 w-8"></div>
              <div className="ml-2 animate-pulse bg-white/20 h-6 w-24 rounded"></div>
            </div>
            <div className="animate-pulse bg-white/20 rounded-full h-10 w-10"></div>
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
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100/50'
            : 'bg-gradient-to-r from-red-600 to-orange-500/90 backdrop-blur-md shadow-lg'
        }`}
        role="banner"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className={`max-w-6xl mx-auto rounded-full px-4 md:px-8 h-14 flex items-center justify-between transition-all duration-300 ${
            isScrolled
              ? 'bg-white/90 backdrop-blur-md shadow-lg border border-gray-200'
              : 'bg-gradient-to-r from-red-600 to-orange-500/90 backdrop-blur-md border border-white/30'
          }`}>
            <Link
              to="/"
              className="z-10 flex items-center"
              aria-label="Edizo Home"
            >
              <Logo isScrolled={isScrolled} />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative font-medium tracking-wide transition-all duration-300 py-2.5 px-3.5 rounded-full text-sm ${
                      isActive
                        ? isScrolled
                          ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-md' // Active in scrolled state
                          : 'bg-white text-red-600 shadow-md' // Active in non-scrolled state
                        : isScrolled
                        ? 'text-gray-700 hover:text-red-600 hover:bg-red-50/80 border border-transparent hover:border-red-200' // Inactive scrolled
                        : 'text-white hover:text-white hover:bg-white/20 border border-transparent hover:border-white/30' // Inactive non-scrolled
                    }`
                  }
                >
                  {({ }) => (
                    <>
                      <div className="flex items-center gap-1.5">
                        <link.icon size={16} className="hidden md:block" />
                        {link.name}
                      </div>
                      {/* Removed layoutId underline as it caused layout issues with new bg */}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Profile Section */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="relative" ref={profileRef}>
                  {/* Profile Button with Google avatar */}
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1"
                    aria-haspopup="true"
                    aria-expanded={isProfileOpen}
                    aria-label="User profile"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={`${user.name}'s profile`}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-medium text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 origin-top-right"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            {user.photoURL ? (
                              <img
                                src={user.photoURL}
                                alt={`${user.name}'s profile`}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                              <p className="text-xs text-gray-500 truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                // Show Sign In button if not logged in
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                    isScrolled
                      ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white hover:from-red-700 hover:to-orange-600 shadow-md'
                      : 'bg-white text-red-600 hover:bg-gray-100 shadow-md'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Sign In
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden z-20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg p-2.5 transition-colors ${
                isScrolled ? 'text-gray-900 bg-gray-100 hover:bg-gray-200' : 'text-white bg-white/20 hover:bg-white/30'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
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
              className="fixed top-0 right-0 w-4/5 max-w-sm h-full bg-gradient-to-b from-red-600 to-orange-500 shadow-2xl z-40 flex flex-col"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/20">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/');
                  }}
                  className="text-xl font-bold text-white flex items-center gap-2"
                >
                  <Sparkles className="text-yellow-300" />
                  Edizo
                </button>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Close mobile menu"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <nav className="flex-1 p-6 bg-white/5 backdrop-blur-sm">
                <ul className="space-y-1">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <li key={link.name}>
                        <button
                          onClick={() => handleMobileNavigation(link.path)}
                          className={`flex items-center gap-4 p-3.5 rounded-xl transition-all duration-200 group font-semibold w-full text-left ${
                            isActive
                              ? 'bg-white text-red-600 shadow-md'
                              : 'text-white/90 hover:bg-white/10'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <link.icon
                            className={`w-5 h-5 ${isActive ? 'text-red-600' : 'text-white'}`}
                          />
                          <span>{link.name}</span>
                        </button>
                      </li>
                    );
                  })}

                  {/* Mobile Auth Section */}
                  {user ? (
                    <li className="pt-4 mt-4 border-t border-white/20">
                      <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={`${user.name}'s profile`}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-red-600 font-medium text-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate">{user.name}</p>
                          <p className="text-sm text-white/80 truncate">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </li>
                  ) : (
                    <li className="pt-4 mt-4 border-t border-white/20">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleGoogleSignIn();
                        }}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {isLoading ? (
                          <>
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></span>
                            Signing in...
                          </>
                        ) : (
                          <>
                            <UserIcon size={16} />
                            <span>Sign In with Google</span>
                          </>
                        )}
                      </button>
                    </li>
                  )}
                </ul>
              </nav>

              <div className="p-5 border-t border-white/20 bg-white/5 text-center">
                <p className="text-sm text-white/80">
                  © {new Date().getFullYear()} Edizo. All rights reserved.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default Header;