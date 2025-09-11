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
import Projects from './pages/Projects'; // Updated Projects.tsx

import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import InternshipApplication from './pages/InternshipApplication';
import CertificateVerification from './pages/CertificateVerification';
import UpcomingEvents from './pages/UpcomingEvents';
import Signup from './pages/Signup'; // Import the new Signup page

const App: React.FC = () => {

  return (
    <Routes>
      {/* Public route for Signup */}
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes within MainLayout */}
      {/* The MainLayout component itself now handles redirecting unauthenticated users */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:id" element={<ServiceDetails />} />
        <Route path="internships" element={<Internships />} />
        <Route path="internships/:id" element={<InternshipDetails />} />
        <Route path="apply/:id" element={<InternshipApplication />} />
        <Route path="projects" element={<Projects />} /> {/* Updated Projects page */}
        <Route path="contact" element={<Contact />} />
        <Route path="events" element={<UpcomingEvents />} />
        <Route path="verify-certificate" element={<CertificateVerification />} />

        {/* Catch-all route for 404 within protected area */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;