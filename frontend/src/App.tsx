// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your components
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Internships from './pages/Internships';
import InternshipDetails from './pages/InternshipDetails';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import InternshipApplication from './pages/InternshipApplication';
import CertificateVerification from './pages/CertificateVerification';
import UpcomingEvents from './pages/UpcomingEvents';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Main routes within MainLayout. MainLayout will persist across these routes.
           The Header inside MainLayout should no longer interfere with navigation. */}
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
        <Route path="verify-certificate" element={<CertificateVerification />} />

        {/* Catch-all route for 404 within the main layout */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;