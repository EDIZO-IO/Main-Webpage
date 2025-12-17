import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Import MainLayout and Home directly (critical path)
import MainLayout from './layouts/MainLayout';
import Home from './pages/home/Home';

// Lazy load all other pages for better code splitting
const Services = lazy(() => import('./pages/Services'));
const ServiceDetails = lazy(() => import('./pages/ServiceDetails'));
const Internships = lazy(() => import('./pages/Internships'));
const InternshipDetails = lazy(() => import('./pages/InternshipDetails'));
const Projects = lazy(() => import('./pages/Projects'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));
const InternshipApplication = lazy(() => import('./pages/InternshipApplication'));
const CertificateVerification = lazy(() => import('./pages/CertificateVerification'));
const Blogs = lazy(() => import('./pages/Blogs'));
const BlogView = lazy(() => import('./pages/BlogView'));
const UpcomingEvents = lazy(() => import('./pages/UpcomingEvents'));
const About = lazy(() => import('./pages/About'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
    <div className="text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-orange-200 rounded-full animate-spin border-t-orange-600 mx-auto" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-orange-400 mx-auto opacity-20" />
      </div>
      <p className="mt-4 text-gray-600 font-medium">Loading...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
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
          <Route path="blogs" element={<Blogs />} />
          <Route path="blogs/:slugOrId" element={<BlogView />} />
          <Route path="verify-certificate" element={<CertificateVerification />} />
          <Route path="about" element={<About />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsAndConditions />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
