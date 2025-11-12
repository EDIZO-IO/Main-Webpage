// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your components
import MainLayout from './layouts/MainLayout';
import Home from './pages/home/Home';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Internships from './pages/Internships';
import InternshipDetails from './pages/InternshipDetails';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import InternshipApplication from './pages/InternshipApplication';
import CertificateVerification from './pages/CertificateVerification';
import Blogs from './pages/Blogs';      // <-- Blogs import here is correct!
import UpcomingEvents from './pages/UpcomingEvents';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Main routes within MainLayout. MainLayout will persist across these routes. */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:id" element={<ServiceDetails />} />
        <Route path="internships" element={<Internships />} />
        <Route path="internships/:id" element={<InternshipDetails />} />
        <Route path="apply/:id" element={<InternshipApplication />} />
        <Route path="projects" element={<Projects />} />
        <Route path="contact" element={<Contact />} />
        <Route path="events" element={<UpcomingEvents />} />
        <Route path="blogs" element={<Blogs />} />  {/* <-- This is the Blogs route */}
        <Route path="verify-certificate" element={<CertificateVerification />} />
          <Route path="About" element={<About />} /> 
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="terms" element={<TermsAndConditions />} />
        {/* Catch-all route for 404 within the main layout */}
        <Route path="*" element={<NotFound />} />

      </Route>
    </Routes>
  );
};

export default App;
