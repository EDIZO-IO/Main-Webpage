// src/layouts/MainLayout.tsx
// Simplified Layout - Removed page transition animations for better performance
import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
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
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      <ScrollToTop />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only absolute left-4 top-4 z-50 rounded-md bg-red-600 p-2 text-white shadow-lg outline-none ring-2 ring-offset-2 ring-red-500 transition focus:ring-red-500"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main-content" role="main" className="flex-grow pt-14">
        <div className="w-full">
          {children ? children : <Outlet />}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;