// frontend/src/pages/home/ServicesSection.tsx
import { memo, useMemo } from 'react';
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
      features: ["Blazing Fast Speeds", "Extensive Coverage", "Reliable Connectivity", "Uptime Guarantee"],
      startingPrice: 15000
    },
    {
      img: uiuxImg,
      title: "UI/UX Design",
      desc: "Human-centered design that users love.",
      link: "/services/ui-ux",
      features: ["Intuitive Interfaces", "User Testing", "Responsive Design", "Accessibility Compliance"],
      startingPrice: 7000
    },
    {
      img: appDesignImg,
      title: "App Development",
      desc: "Cross-platform apps with React Native & Flutter.",
      link: "/services/app-development",
      features: ["Native Performance", "Seamless Integration", "Scalable Architecture", "Push Notifications"],
      startingPrice: 25000
    }
  ], []);

  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Simple background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-50 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-40 translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 border border-gray-200 rounded-full mb-6 shadow-sm">
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">What We Offer</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Services</span>
            </h2>
            <p className="text-lg text-gray-600">
              Expert solutions loved by clients worldwide
            </p>
          </AnimatedSection>
        </div>

        {/* Services Grid - Simple CSS transitions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredServices.map((service, index) => (
            <div
              key={service.title}
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
            >
              <ServiceCard {...service} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

ServicesSection.displayName = 'ServicesSection';
export default ServicesSection;