// src/components/common/Header.tsx
import { useState, useEffect, useRef } from 'react'; // Removed useCallback import
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'; // Ensure correct imports
import {
  Menu,
  X,
  Home,
  Briefcase,
  Code,
  Users,
  Phone,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo'; // Ensure correct path

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Check auth state - Simplified check
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    // Check auth state only once on mount or when needed, not on every pathname change
    // unless login/logout can happen from anywhere without a full page reload/context update
    const checkAuth = () => {
       const stored = localStorage.getItem('isAuthenticated');
       if (stored === 'true') {
         // Mock user — replace with real user data from context/API later
         setUser({ name: 'User' });
       } else {
         setUser(null);
       }
    };
    checkAuth();
    // If you have a global auth state (e.g., Context), listen to that instead.
    // For localStorage, checking on mount is often sufficient unless you expect
    // login/logout to happen via actions that don't trigger a full re-render.
  }, []); // Run only once on mount

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isProfileOpen && profileRef.current && !profileRef.current.contains(e.target as Node)) {
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isMenuOpen && mobileNavRef.current && !mobileNavRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Close menus when location changes (e.g., user navigates)
  useEffect(() => {
     // Close menus on navigation
     setIsMenuOpen(false);
     setIsProfileOpen(false);
     // Re-check auth state on location change if needed, but usually not necessary
     // checkAuth(); // Only if auth can change without component unmounting
  }, [location.pathname]); // Depend on pathname to close menus on nav

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    setUser(null);
    setIsProfileOpen(false);
    // Navigate after logout if needed, e.g., to home or login
    // navigate('/'); // or navigate('/login');
    // For now, let the user stay on the current page or let App redirect
  };

  const navLinks = [
    { name: 'HOME', path: '/', icon: Home },
    { name: 'SERVICES', path: '/services', icon: Code },
    { name: 'PROJECTS', path: '/projects', icon: Briefcase },
    { name: 'INTERNSHIPS', path: '/internships', icon: Users },
    { name: 'CONTACT', path: '/contact', icon: Phone },
  ];

  // Simplified navigation handler for mobile menu items
  const handleMobileNavigation = (path: string) => {
    // Close mobile menu immediately
    setIsMenuOpen(false);
    // setIsProfileOpen(false); // Not typically open on mobile menu click
    // Navigate using useNavigate hook
    // No need for setTimeout or preventing default on NavLinks
    navigate(path);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100/50'
            : 'bg-transparent'
        }`}
        style={{ backdropFilter: isScrolled ? 'blur(8px)' : 'none' }}
        role="banner"
      >
        {/* Curved Container */}
        <div className="container mx-auto px-4 md:px-6">
          <div className={`max-w-6xl mx-auto rounded-full px-4 md:px-8 h-16 flex items-center justify-between transition-all duration-300 ${
            isScrolled
              ? 'bg-white/90 backdrop-blur-md shadow-lg border border-gray-200'
              : 'bg-gradient-to-r from-red-600/90 to-purple-600/90 backdrop-blur-md border border-white/30'
          }`}>
            {/* Logo - Use standard Link behavior */}
            <Link
              to="/"
              className="z-20 flex items-center"
              aria-label="Edizo Home"
              // Removed preventDefault and custom handler
              // onClick={(e) => {
              //   e.preventDefault();
              //   handleNavigation('/');
              // }}
            >
              <Logo isScrolled={isScrolled} />
            </Link>

            {/* Desktop Navigation - Use standard NavLink behavior */}
            <nav className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative font-medium tracking-wide transition-all duration-300 py-2 px-4 rounded-full text-sm md:text-base font-semibold ${
                      isActive
                        ? 'bg-white text-red-600 shadow-md border border-red-200'
                        : isScrolled
                        ? 'text-gray-700 hover:text-red-600 hover:bg-red-50/80 border border-transparent hover:border-red-200'
                        : 'text-white hover:text-white hover:bg-white/20 border border-transparent hover:border-white/30'
                    }`
                  }
                  // Removed preventDefault and custom handler
                  // onClick={(e) => {
                  //   e.preventDefault();
                  //   handleLinkClick(link.path);
                  // }}
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      {isActive && !isScrolled && (
                        <motion.div
                          layoutId="underline"
                          className="absolute -bottom-1 left-0 w-full h-0.5 bg-white"
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

            {/* Desktop Profile Button - Only if logged in */}
            {user && (
              <div className="hidden md:block relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`flex items-center gap-2 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    isScrolled
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                  aria-haspopup="true"
                  aria-expanded={isProfileOpen}
                  aria-label="User profile"
                >
                  <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-medium text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={16} className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
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
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent closing profile dropdown immediately
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
            )}

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden z-30 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg p-2 transition-colors ${
                isScrolled ? 'text-gray-900 bg-gray-100 hover:bg-gray-200' : 'text-white bg-white/20 hover:bg-white/30'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
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
              className="fixed top-0 right-0 w-4/5 max-w-sm h-full bg-white shadow-2xl z-40 flex flex-col"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
                {/* Use standard navigate for logo/home in mobile menu */}
                <button
                  onClick={() => {
                      setIsMenuOpen(false);
                      navigate('/'); // Use navigate directly
                  }}
                  className="text-xl font-bold text-gray-900"
                >
                  Edizo
                </button>
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
                        {/* Use handleMobileNavigation for menu items */}
                        <button
                          onClick={() => handleMobileNavigation(link.path)} // Use simplified handler
                          className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-200 group font-semibold w-full text-left ${
                            isActive
                              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md'
                              : 'text-gray-800 hover:bg-gradient-to-r hover:from-red-500 hover:to-orange-500 hover:text-white'
                          }`}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <link.icon
                            className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600 group-hover:text-white'}`}
                          />
                          <span>{link.name}</span>
                        </button>
                      </li>
                    );
                  })}

                  {/* Mobile Auth Section */}
                  {user && (
                    <li className="pt-4 mt-4 border-t border-gray-200">
                      <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl text-white">
                        <div className="w-10 h-10 bg-white text-red-500 rounded-full flex items-center justify-center font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">Hello, {user.name}</p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLogout();
                              setIsMenuOpen(false); // Ensure menu closes
                            }}
                            className="mt-1 flex items-center gap-1 text-white text-sm hover:text-red-100"
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
    </>
  );
};

export default Header;