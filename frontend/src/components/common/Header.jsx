import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Menu, X, Home, Briefcase, Code, Users, Phone, ChevronRight, Sparkles, GraduationCap,
} from 'lucide-react';
import Logo from './Logo.jsx';


const navLinks = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Services', path: '/services', icon: Code },
  { name: 'Projects', path: '/projects', icon: Briefcase },
  { name: 'Internships', path: '/internships', icon: GraduationCap },
  { name: 'About', path: '/about', icon: Users },
  { name: 'Contact', path: '/contact', icon: Phone },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const mobileNavRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 18);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && mobileNavRef.current && !mobileNavRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* HEADER */}
      <header
        className={`
          fixed w-full top-0 z-50 transition-all duration-300
          ${isScrolled ? 'py-2' : 'py-3'}
        `}
        role="banner"
      >
        {/* Header Container */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`
              relative flex items-center justify-between
              px-4 sm:px-6 lg:px-8
              rounded-2xl
              transition-all duration-300
              ${isScrolled
                ? 'h-16 bg-white shadow-lg border border-gray-200'
                : 'h-16 bg-white shadow-md border border-gray-200'}
            `}
          >
            {/* Gradient accent line at top */}
            <div className="absolute top-0 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent rounded-full" />

            {/* Logo */}
            <Link to="/" className="relative z-10 flex-shrink-0 hover:scale-[1.02] transition-transform duration-200" aria-label="Edizo Home">
              <Logo isScrolled={isScrolled} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isHovered = hoveredLink === link.path;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onMouseEnter={() => setHoveredLink(link.path)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={({ isActive }) =>
                      `
                      relative font-semibold text-base px-4 py-3 rounded-xl
                      flex items-center gap-2 group transition-all duration-200
                      ${isActive
                        ? 'text-white bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 shadow-lg shadow-orange-500/25'
                        : isHovered
                          ? 'text-gray-800 bg-gray-100'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}
                      `
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* Icon */}
                        <span className="relative z-10">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-700'}`} />
                        </span>
                        {/* Text */}
                        <span className="relative z-10">{link.name}</span>
                        {/* Underline for active state */}
                        {isActive && (
                          <div className="absolute bottom-1 left-4 right-4 h-0.5 bg-white/50 rounded-full" />
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>

            {/* Mobile menu button */}
            <button
              className={`
                lg:hidden relative z-20 p-3 rounded-xl
                transition-all duration-200
                ${isMenuOpen
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              `}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer with Glass Effect - More Transparent */}
          <div
            ref={mobileNavRef}
            className="fixed top-0 right-0 bottom-0 w-full max-w-sm z-50 flex flex-col transform transition-transform duration-300 overflow-hidden"
            style={{
              background: 'white',
              boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.1)',
            }}
          >
            {/* Decorative gradient overlays */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-500/20 via-red-100/10 to-transparent rounded-bl-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-red-200/20 to-transparent rounded-tr-full pointer-events-none" />

            {/* Header - Very Transparent Glass */}
            <div
              className="relative z-10 m-4 mb-2 p-5 rounded-2xl"
              style={{
                background: 'white',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div className="flex items-center justify-between">
                <Logo isScrolled={true} />
                <button
                  className="p-3 rounded-xl transition-all duration-200 group hover:scale-105"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <X className="w-5 h-5 text-gray-700 group-hover:text-orange-600 transition-colors" />
                </button>
              </div>
            </div>

            {/* Navigation - Slightly more opaque for readability */}
            <nav className="flex-1 overflow-y-auto px-4 py-2 relative z-10">
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
                          flex items-center justify-between w-full p-4 rounded-2xl
                          font-semibold text-base transition-all duration-200
                          ${isActive
                            ? 'bg-gradient-to-r from-orange-500 via-red-500 to-orange-400 text-white shadow-lg shadow-orange-500/30'
                            : 'text-gray-800 hover:text-orange-600'}
                          `
                        }
                        style={({ isActive }) => !isActive ? {
                          background: 'white',
                          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                        } : undefined}
                      >
                        {({ isActive }) => (
                          <>
                            <div className="flex items-center gap-4">
                              <div className={`
                                p-2.5 rounded-xl shadow-lg
                                ${isActive
                                  ? 'bg-gray-100 shadow-gray-200/50'
                                  : 'bg-gradient-to-br from-orange-500 to-red-500 shadow-orange-300/50'}
                              `}>
                                <Icon className={`w-5 h-5 ${isActive ? 'text-gray-800' : 'text-white'}`} />
                              </div>
                              <span className={`font-semibold ${isActive ? 'text-white' : 'text-gray-800'}`}>{link.name}</span>
                            </div>
                            <ChevronRight className={`w-5 h-5 ${isActive ? 'text-white/20' : 'text-gray-600'}`} />
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}

              </ul>
            </nav>


          </div>
        </>
      )}
    </>
  );
};

export default Header;
