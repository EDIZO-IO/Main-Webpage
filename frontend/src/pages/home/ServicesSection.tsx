// frontend/src/pages/home/ServicesSection.tsx
import React, { memo, useMemo } from 'react';
import { AnimatedSection } from './AnimatedSection';
import ServiceCard from './ServiceCard';

// Service Images
import webDevelopment from '../../assets/services/website design.webp';
import uiuxImg from '../../assets/services/uiux.webp';
import appDesignImg from '../../assets/services/app design.webp';

const ServicesSection = memo(() => {
  const featuredServices = useMemo(() => [
    { 
      img: webDevelopment, 
      title: "Web Development", 
      desc: "Fast, scalable websites with React & Next.js.", 
      link: "/services/web-development",
      features: ["Blazing Fast Speeds", "Extensive Coverage", "Reliable Connectivity", "Uptime Guarantee"]
    },
    { 
      img: uiuxImg, 
      title: "UI/UX Design", 
      desc: "Human-centered design that users love.", 
      link: "/services/ui-ux",
      features: ["Intuitive Interfaces", "User Testing", "Responsive Design", "Accessibility Compliance"]
    },
    { 
      img: appDesignImg, 
      title: "App Development", 
      desc: "Cross-platform apps with React Native & Flutter.", 
      link: "/services/app-development",
      features: ["Native Performance", "Seamless Integration", "Scalable Architecture", "Push Notifications"]
    }
  ], []);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full mb-6">
              <span className="text-sm font-semibold text-red-700">What We Offer</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Our Services
            </h2>
            <p className="text-xl text-gray-600">
              Expert solutions loved by clients worldwide
            </p>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
});

ServicesSection.displayName = 'ServicesSection';
export default ServicesSection;