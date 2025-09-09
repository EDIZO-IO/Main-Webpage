import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import ScrollToTop from '../components/common/ScrollToTop';

const MainLayout: React.FC = () => {
  const location = useLocation();
  
  // Optimize scroll behavior for instant navigation
  useEffect(() => {
    // Scroll to top immediately when route changes
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50" style={{ scrollBehavior: 'smooth' }}>
      <ScrollToTop />
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:bg-white focus:text-gray-900 focus:p-2 focus:rounded-md focus:z-50 focus:shadow-lg focus:border focus:border-gray-300"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-grow">
        {/* Remove pt-16 since we fixed the header positioning */}
        <div className="w-full">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;