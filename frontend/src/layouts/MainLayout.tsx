// src/layouts/MainLayout.tsx
import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
// ✅ Import AnimatePresence and motion from framer-motion
import { AnimatePresence, motion } from 'framer-motion'; 
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ScrollToTop from '../components/common/ScrollToTop';

// ✅ Define the page transition wrapper component
const PageTransition: React.FC<{ children: ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}  // Initial animation state
    animate={{ opacity: 1, y: 0 }}   // Animation when entering
    exit={{ opacity: 0, y: -20 }}    // Animation when exiting (crucial for AnimatePresence)
    transition={{ duration: 0.3 }}   // Transition duration
  >
    {children}
  </motion.div>
);

interface MainLayoutProps {
  children?: ReactNode; // Kept for potential flexibility, though primarily uses Outlet
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top instantly on route change
    window.scrollTo(0, 0);
  }, [location.pathname]); // Dependency array ensures it runs on pathname change

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ScrollToTop />

      {/* Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only absolute left-4 top-4 z-50 rounded-md bg-white p-2 text-gray-900 shadow-lg outline-none ring-2 ring-offset-2 ring-blue-500 transition focus:ring-blue-500"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" role="main" className="flex-grow">
        <div className="w-full">
          {/* ✅ Use children if explicitly passed, otherwise render the animated Outlet */}
          {children ? (
            children
          ) : (
            // ✅ AnimatePresence wraps the content that changes (Outlet's rendered component)
            // ✅ key is on the direct child of AnimatePresence (PageTransition) for route change detection
            <AnimatePresence mode="wait">
              <PageTransition key={location.pathname}>
                {/* Outlet renders the matched child route component (e.g., Home, Projects) */}
                <Outlet />
              </PageTransition>
            </AnimatePresence>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;