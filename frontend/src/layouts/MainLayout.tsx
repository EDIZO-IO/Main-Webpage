// src/layouts/MainLayout.tsx

import React, { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';


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
     
  

      <Header />

      <main id="main-content" role="main" className="flex-grow pt-0">
        <div className="w-full">
          {children ? children : <Outlet />}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;