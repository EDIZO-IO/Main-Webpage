// src/layouts/MainLayout.jsx

import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';


const MainLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-white">



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