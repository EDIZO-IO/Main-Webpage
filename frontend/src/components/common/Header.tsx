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
  User as UserIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { auth, googleProvider } from '../../firebaseConfig';
import { signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
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
      <header className="fixed w-full z-50 bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-blue-800/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto rounded-full px-4 md:px-8 h-12 flex items-center justify-between bg-gray-800/90 backdrop-blur-md shadow-lg border border-blue-700/30">
            <div className="flex items-center">
              <div className="animate-pulse bg-blue-700 rounded-full h-8 w-8"></div>
              <div className="ml-2 animate-pulse bg-blue-700 h-6 w-24 rounded"></div>
            </div>
            <div className="animate-pulse bg-blue-700 rounded-full h-9 w-9"></div>
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
            ? 'bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-blue-800/50'
            : 'bg-transparent'
        }`}
        role="banner"
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className={`max-w-6xl mx-auto rounded-full px-4 md:px-8 h-12 flex items-center justify-between transition-all duration-300 ${
            isScrolled
              ? 'bg-gray-800/90 backdrop-blur-md shadow-lg border border-blue-700/30'
              : 'bg-gradient-to-r from-blue-900/90 via-indigo-900/90 to-purple-900/90 backdrop-blur-md border border-blue-500/20'
          }`}>
            <Link
              to="/"
              className="z-10 flex items-center"
              aria-label="Edizo Home"
            >
              <Logo isScrolled={isScrolled} />
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative font-medium tracking-wide transition-all duration-300 py-2 px-4 rounded-full text-sm md:text-base ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md border border-cyan-400/30'
                        : isScrolled
                        ? 'text-blue-200 hover:text-cyan-300 hover:bg-blue-800/50 border border-transparent hover:border-blue-600/30'
                        : 'text-blue-100 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {isActive && !isScrolled && (
                        <motion.div
                          layoutId="underline"
                          className="absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-400"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
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
                    className="flex items-center focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-full p-1"
                    aria-haspopup="true"
                    aria-expanded={isProfileOpen}
                    aria-label="User profile"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={`${user.name}'s profile`}
                        className="w-9 h-9 rounded-full object-cover border-2 border-cyan-500 shadow"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center text-white font-medium text-sm">
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
                        className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-lg border border-blue-700/50 py-2 z-50 origin-top-right"
                      >
                        <div className="px-4 py-3 border-b border-blue-700/30">
                          <div className="flex items-center gap-3">
                            {user.photoURL ? (
                              <img
                                src={user.photoURL}
                                alt={`${user.name}'s profile`}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center text-white font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-white truncate">{user.name}</p>
                              <p className="text-xs text-blue-300 truncate">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLogout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-400 hover:bg-red-900/30 transition-colors"
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                    isScrolled
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700'
                      : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <UserIcon size={16} />
                      Sign In
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden z-20 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 rounded-lg p-2 transition-colors ${
                isScrolled ? 'text-white bg-blue-800 hover:bg-blue-700' : 'text-white bg-white/20 hover:bg-white/30'
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
              className="fixed top-0 right-0 w-4/5 max-w-sm h-full bg-gray-800 shadow-2xl z-40 flex flex-col"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between p-5 border-b border-blue-700/30 bg-gray-900">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate('/');
                  }}
                  className="text-xl font-bold text-white"
                >
                  Edizo
                </button>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-700 transition-colors"
                  aria-label="Close mobile menu"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              <nav className="flex-1 p-6 bg-gray-900/50">
                <ul className="space-y-1">
                  {navLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <li key={link.name}>
                        <button
                          onClick={() => handleMobileNavigation(link.path)}
                          className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group font-semibold w-full text-left ${
                            isActive
                              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                              : 'text-blue-200 hover:bg-gradient-to-r hover:from-cyan-700 hover:to-blue-700 hover:text-white'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <link.icon
                            className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-300 group-hover:text-white'}`}
                          />
                          <span>{link.name}</span>
                        </button>
                      </li>
                    );
                  })}

                  {/* Mobile Auth Section */}
                  {user ? (
                    <li className="pt-4 mt-4 border-t border-blue-700/30">
                      <div className="flex items-center gap-3 p-3">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={`${user.name}'s profile`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 flex items-center justify-center text-white font-medium text-lg">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate">{user.name}</p>
                          <p className="text-sm text-blue-300 truncate">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </li>
                  ) : (
                    <li className="pt-4 mt-4 border-t border-blue-700/30">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          handleGoogleSignIn();
                        }}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-colors"
                      >
                        {isLoading ? (
                          <>
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
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

              <div className="p-5 border-t border-blue-700/30 bg-gray-900 text-center">
                <p className="text-sm text-blue-400">
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
        theme="dark"
      />
    </>
  );
};

export default Header;