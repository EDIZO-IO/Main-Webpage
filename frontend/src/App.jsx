import { Routes, Route } from 'react-router-dom';

// Import critical components directly
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/home/Home.jsx';
import Services from './pages/Services.jsx';
import ServiceDetails from './pages/ServiceDetails.jsx';
import MultiServiceApplication from './pages/MultiServiceApplication.jsx';
import Internships from './pages/Internships.jsx';
import InternshipDetails from './pages/InternshipDetails.jsx';
import Projects from './pages/Projects.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';
import InternshipApplication from './pages/InternshipApplication.jsx';
import CertificateVerification from './pages/CertificateVerification.jsx';
// import Blogs from './pages/Blogs';
// import BlogView from './pages/BlogView';
import UpcomingEvents from './pages/UpcomingEvents.jsx';
import About from './pages/About.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsAndConditions from './pages/TermsAndConditions.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="services/apply-multiple" element={<MultiServiceApplication />} />
        <Route path="services/:id" element={<ServiceDetails />} />
        <Route path="internships" element={<Internships />} />
        <Route path="internships/:id" element={<InternshipDetails />} />
        <Route path="apply/:id" element={<InternshipApplication />} />
        <Route path="projects" element={<Projects />} />
        <Route path="contact" element={<Contact />} />
        <Route path="events" element={<UpcomingEvents />} />
        {/* <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/:slugOrId" element={<BlogView />} /> */}
        <Route path="verify-certificate" element={<CertificateVerification />} />
        <Route path="verification" element={<CertificateVerification />} />
        <Route path="about" element={<About />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="terms" element={<TermsAndConditions />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
