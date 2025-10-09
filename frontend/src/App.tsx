// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your components
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home'; // This is the redesigned Home page
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Internships from './pages/Internships'; // This is the redesigned Internships page
import InternshipDetails from './pages/InternshipDetails'; // This is the redesigned InternshipDetails page
import Projects from './pages/Projects';
import Contact from './pages/Contact'; // This is the updated Contact page
import NotFound from './pages/NotFound';
import InternshipApplication from './pages/InternshipApplication'; // This is the redesigned InternshipApplication page
import CertificateVerification from './pages/CertificateVerification';
import UpcomingEvents from './pages/UpcomingEvents'; // This is the updated UpcomingEvents page

const App: React.FC = () => {
  return (
    <Routes>
      {/* Main routes within MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} /> {/* Redesigned Home page */}
        <Route path="services" element={<Services />} />
        <Route path="services/:id" element={<ServiceDetails />} />
        <Route path="internships" element={<Internships />} /> {/* Redesigned Internships page */}
        <Route path="internships/:id" element={<InternshipDetails />} /> {/* Redesigned InternshipDetails page */}
        <Route path="apply/:id" element={<InternshipApplication />} /> {/* Redesigned InternshipApplication page */}
        <Route path="projects" element={<Projects />} />
        <Route path="contact" element={<Contact />} /> {/* Updated Contact page */}
        <Route path="events" element={<UpcomingEvents />} /> {/* Updated UpcomingEvents page */}
        <Route path="verify-certificate" element={<CertificateVerification />} />

        {/* Catch-all route for 404 within the main layout */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;