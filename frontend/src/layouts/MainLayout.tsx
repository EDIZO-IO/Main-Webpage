// src/layouts/MainLayout.tsx
import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '../components/common/Header'; // This is the redesigned Header
import Footer from '../components/common/Footer';
import ScrollToTop from '../components/common/ScrollToTop';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
    
    // Handle auth state persistence
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const userData = {
          name: user.displayName || 'User',
          email: user.email || '',
          photoURL: user.photoURL || ''
        };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        // User is signed out
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
      }
      setIsLoading(false);
    });

    // Simulate any initial loading if needed
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 1000);
    
    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [isLoading]);

  // Show loading indicator while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        <span className="ml-3 text-gray-700">Initializing...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-blue-50"> {/* Updated background to match Home */}
      <ScrollToTop />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only absolute left-4 top-4 z-50 rounded-md bg-red-600 p-2 text-white shadow-lg outline-none ring-2 ring-offset-2 ring-red-500 transition focus:ring-red-500"
      >
        Skip to main content
      </a>

      <Header /> {/* This is the redesigned Header */}

      <main id="main-content" role="main" className="flex-grow pt-14"> {/* Adjusted padding-top to match header height */}
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