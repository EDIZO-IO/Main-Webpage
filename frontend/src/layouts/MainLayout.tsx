// src/layouts/MainLayout.tsx
import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '../components/common/Header'; // Updated Header that handles auth and location internally
import Footer from '../components/common/Footer';
import ScrollToTop from '../components/common/ScrollToTop';

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]); // Add location.pathname as dependency to trigger on route changes

  // Removed isLoading state and auth check from MainLayout.
  // These are now handled by the Header component.

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <ScrollToTop />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only absolute left-4 top-4 z-50 rounded-md bg-red-600 p-2 text-white shadow-lg outline-none ring-2 ring-offset-2 ring-red-500 transition focus:ring-red-500"
      >
        Skip to main content
      </a>

      <Header /> {/* This is the updated Header that handles auth and location */}

      <main id="main-content" role="main" className="flex-grow pt-14">
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
                <Outlet />
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