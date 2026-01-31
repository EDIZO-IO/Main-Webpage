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
import CaseStudyDetail from './pages/CaseStudyDetail.jsx';
import Contact from './pages/Contact.jsx';
import NotFound from './pages/NotFound.jsx';
import InternshipApplication from './pages/InternshipApplication.jsx';
import CertificateVerification from './pages/CertificateVerification.jsx';

import UpcomingEvents from './pages/UpcomingEvents.jsx';
import About from './pages/About.jsx';
import Team from './pages/Team.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsAndConditions from './pages/TermsAndConditions.jsx';
import SEO from './components/common/SEO.jsx';

const App = () => {
  return (
    <>
      <SEO
        title="Edizo | Design.Develop.Learn - Digital Agency"
        description="Edizo offers expert web development, UI/UX design, app development & digital marketing in India. Transform your business with our creative solutions."
        keywords="Edizo, digital agency India, UI/UX design, web development, app development, React development, Next.js, Flutter, internships India, creative agency, branding, SEO services, digital marketing"
        canonical="https://www.edizo.in/"
        ogTitle="Edizo | Design.Develop.Learn - Digital Agency"
        ogDescription="Transform your business with Edizo - India's leading creative digital agency. Expert UI/UX design, web development, app development & internships."
        ogImage="https://www.edizo.in/og-image.png"
        twitterTitle="Edizo | Design.Develop.Learn - Digital Agency"
        twitterDescription="Transform your business with Edizo - India's leading creative digital agency. Expert UI/UX design, web development, app development & internships."
        twitterImage="https://www.edizo.in/og-image.png"
        schemaData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Edizo",
          "url": "https://www.edizo.in",
          "logo": "https://www.edizo.in/logo.png",
          "description": "A top-rated digital agency: UI/UX design, web & app development, branding, and digital career internships.",
          "email": "edizoofficial@gmail.com",
          "telephone": "+917092435729",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "IN"
          },
          "contactPoint": [
            {
              "@type": "ContactPoint",
              "telephone": "+917092435729",
              "contactType": "Customer Service",
              "areaServed": "IN",
              "availableLanguage": ["English", "Hindi", "Tamil"]
            }
          ],
          "sameAs": [
            "https://www.linkedin.com/in/edizo-pvt-ltd-149748367/",
            "https://www.instagram.com/edizo_official",
            "https://x.com/edizo_official",
            "https://www.facebook.com/profile.php?id=61576742758066",
            "https://www.youtube.com/@edizo_official",
            "https://whatsapp.com/channel/0029VbAcqFjG3R3hEF6IsT2O"
          ]
        }}
      />
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
          <Route path="team" element={<Team />} />
          <Route path="casestudy/:id" element={<CaseStudyDetail />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsAndConditions />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
