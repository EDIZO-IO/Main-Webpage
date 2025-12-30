import { Routes, Route } from 'react-router-dom';

// Import critical components directly
import MainLayout from './layouts/MainLayout';
import Home from './pages/home/Home';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import MultiServiceApplication from './pages/MultiServiceApplication';
import Internships from './pages/Internships';
import InternshipDetails from './pages/InternshipDetails';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import InternshipApplication from './pages/InternshipApplication';
import CertificateVerification from './pages/CertificateVerification';
// import Blogs from './pages/Blogs';
// import BlogView from './pages/BlogView';
import UpcomingEvents from './pages/UpcomingEvents';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import WriteReview from './pages/WriteReview';

const App: React.FC = () => {
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
        <Route path="write-review" element={<WriteReview />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
