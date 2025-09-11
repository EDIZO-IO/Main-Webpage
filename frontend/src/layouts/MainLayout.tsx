// src/layouts/MainLayout.tsx
import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ScrollToTop from '../components/common/ScrollToTop';

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    // Check authentication status on mount and pathname change
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      setIsAuthenticated(authStatus);

      // If not authenticated and not on signup page, redirect to signup
      if (!authStatus && location.pathname !== '/signup') {
        navigate('/signup', { replace: true });
      }

      setIsLoading(false);
    };

    checkAuth();

    // Optional: Re-check auth status if localStorage changes (e.g., in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isAuthenticated') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [navigate, location.pathname]);

  // Show loading indicator while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        <span className="ml-3 text-gray-600">Checking access...</span>
      </div>
    );
  }

  // If not authenticated and somehow we are here (e.g., direct access), don't render content
  if (!isAuthenticated && location.pathname !== '/signup') {
    return null; // Redirect should have happened, but this is a safeguard
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ScrollToTop />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only absolute left-4 top-4 z-50 rounded-md bg-white p-2 text-gray-900 shadow-lg outline-none ring-2 ring-offset-2 ring-blue-500 transition focus:ring-blue-500"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" role="main" className="flex-grow pt-12">
        <div className="w-full">
          {children ? (
            children
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Only render Outlet if authenticated or on signup page */}
                {(isAuthenticated || location.pathname === '/signup') ? <Outlet /> : null}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;