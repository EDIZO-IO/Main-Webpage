// frontend/src/pages/home/index.tsx
import React from 'react';
import Hero from './Hero';
import EventsSection from './EventsSection';
import ServicesSection from './ServicesSection';
import TestimonialsSection from './TestimonialsSection';
// import BlogsSection from './BlogSection';
import ProjectsSection from './ProjectSection';
import WhyChooseSection from './WhyChooseSection';
import InternshipsSection from './InternshipSection';
import FinalCTA from './FinalCTA';
import SocialMediaFab from '../../components/common/SocialMediaFab';

const Home: React.FC = () => {
  return (
    <div className="bg-white" id="home" role="main">
      <Hero />
      <EventsSection />
      <ServicesSection />
      <TestimonialsSection />
      {/* <BlogsSection /> */}
      <ProjectsSection />
      <WhyChooseSection />
      <InternshipsSection />
      <FinalCTA />
      <SocialMediaFab />
    </div>
  );
};

export default Home;
