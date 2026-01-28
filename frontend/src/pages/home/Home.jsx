// frontend/src/pages/home/index.jsx
import React, { useEffect } from 'react';
import Hero from './Hero.jsx';
import EventsSection from './EventsSection.jsx';
import ServicesSection from './ServicesSection.jsx';
// import BlogsSection from './BlogSection';
import ProjectsSection from './ProjectSection.jsx';
import WhyChooseSection from './WhyChooseSection.jsx';
import InternshipsSection from './InternshipSection.jsx';
import FinalCTA from './FinalCTA.jsx';
import SocialMediaFab from '../../components/common/SocialMediaFab.jsx';

// Scroll reveal animation function
const useScrollReveal = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    // Observe all elements with the 'scroll-reveal' class
    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach(el => observer.observe(el));

    // Cleanup
    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);
};

const Home = () => {
  useScrollReveal();

  return (
    <div className="bg-white" id="home" role="main">
      <Hero />
      <div className="scroll-reveal opacity-0 translate-y-10 transition-all duration-700 ease-out">
        <EventsSection />
      </div>
      <div className="scroll-reveal opacity-0 translate-y-10 transition-all duration-700 ease-out delay-100">
        <ServicesSection />
      </div>
      {/* <BlogsSection /> */}
      <div className="scroll-reveal opacity-0 translate-y-10 transition-all duration-700 ease-out delay-300">
        <ProjectsSection />
      </div>
      <div className="scroll-reveal opacity-0 translate-y-10 transition-all duration-700 ease-out delay-400">
        <WhyChooseSection />
      </div>
      <div className="scroll-reveal opacity-0 translate-y-10 transition-all duration-700 ease-out delay-500">
        <InternshipsSection />
      </div>
      <div className="scroll-reveal opacity-0 translate-y-10 transition-all duration-700 ease-out delay-600">
        <FinalCTA />
      </div>
      <SocialMediaFab />
    </div>
  );
};

export default Home;