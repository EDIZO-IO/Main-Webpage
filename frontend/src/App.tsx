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
// import EventDebug from './components/EventDebug'; // ✅ Add this import

const App: React.FC = () => {
  // Only show EventDebug in development mode
  const isDevelopment = import.meta.env.MODE === 'development';

  return (
    <>
      <Routes>
        {/* Main routes within MainLayout */}
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

      {/* Event Debug Panel - Only in Development */}
      {/* {isDevelopment && <EventDebug />} */}
    </>
  );
};

export default App;
