import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Internships from './pages/Internships';
import InternshipDetails from './pages/InternshipDetails';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import InternshipApplication from './pages/InternshipApplication';
import CertificateVerification from './pages/CertificateVerification';
import UpcomingEvents from './pages/UpcomingEvents';
import ReviewPage from './pages/ReviewPage';

import Preloader from './components/Preloader';

const App: React.FC = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading or use your actual loading logic
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2100);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <Preloader onLoaded={() => setLoading(false)} duration={2100} />;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<ServiceDetails />} />
          <Route path="internships" element={<Internships />} />
          <Route path="internships/:id" element={<InternshipDetails />} />
          <Route path="apply/:id" element={<InternshipApplication />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="contact" element={<Contact />} />
          <Route path="events" element={<UpcomingEvents />} />
          <Route path="verify-certificate" element={<CertificateVerification />} />
          <Route path="reviews" element={<ReviewPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default App;