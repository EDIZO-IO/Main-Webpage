import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Users,
  Briefcase as ProjectsIcon,
  UserCheck,
  Star,
  ArrowRight,
  MessageCircle,
  Target,
  Zap,
  Shield,
} from 'lucide-react';

// Import Assets
import faceguard from '../assets/project/face-Guard.png';
import ransomware from '../assets/project/Ransomware.png';
import Epicnexus from '../assets/project/Epic-nexus.png';

// Service Images
import webDevelopment from '../assets/services/website design.webp';
import uiuxImg from '../assets/services/uiux.webp';
import appDesignImg from '../assets/services/app design.webp';
import videoEditingImg from '../assets/services/video editing.webp';
import graphicDesignImg from '../assets/services/graphic design.webp';

// Internship Images
import uiux from '../assets/images/web-design.png';
import webdevelop from '../assets/images/web-development.png';
import aiml from '../assets/images/ai-assistant.png';

// Type definitions
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
}

interface StatCardProps {
  value: string;
  label: string;
}

interface ServiceCardProps {
  img: string;
  title: string;
  desc: string;
  link: string;
}

interface PortfolioCardProps {
  img: string;
  title: string;
  category?: string;
  link: string;
  isInternship?: boolean;
}

interface CTAButtonProps {
  to: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'event';
  icon?: React.ComponentType<{ size: number }>;
}

// Lazy Load Images
const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className = "" }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    className={className}
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      target.src = `https://placehold.co/400x250/D1D5DB/4B5563?text=${encodeURIComponent(alt)}`;
    }}
  />
);

// Animated Section
const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// Parallax Hook
const useParallax = (speed = 0.2) => {
  const { scrollY } = useScroll();
  return useTransform(scrollY, [0, 1000], [0, scrollY.get() * speed]);
};

// Stat Card
const StatCard: React.FC<StatCardProps> = ({ value, label }) => (
  <AnimatedSection>
    <motion.div
      className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow duration-300"
      whileHover={{ y: -4 }}
    >
      <h3 className="text-3xl font-bold text-red-600">{value}</h3>
      <p className="text-gray-600 text-sm mt-1">{label}</p>
    </motion.div>
  </AnimatedSection>
);

// Service Card
const ServiceCard: React.FC<ServiceCardProps> = ({ img, title, desc, link }) => (
  <AnimatedSection>
    <motion.div
      className="service-card"
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative h-40 overflow-hidden">
        <LazyImage
          src={img}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm mt-2 mb-4 leading-relaxed">{desc}</p>
        <Link
          to={link}
          className="text-red-600 font-medium text-sm flex items-center hover:underline"
        >
          Learn more
          <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  </AnimatedSection>
);

// Portfolio Card (Projects & Internships)
const PortfolioCard: React.FC<PortfolioCardProps> = ({ img, title, category, link, isInternship = false }) => (
  <AnimatedSection>
    <motion.div
      className="project-card"
      whileHover={{ y: -6 }}
    >
      <div className="relative h-40 overflow-hidden">
        <LazyImage src={img} alt={title} className="w-full h-full object-cover" />
        {category && (
          <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
            {category}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        {isInternship && (
          <p className="text-gray-600 text-sm mt-1">
            Gain real-world experience on live projects.
          </p>
        )}
      </div>
      <Link to={link} className="absolute inset-0 z-10" aria-label={`View ${title}`} />
    </motion.div>
  </AnimatedSection>
);

// CTA Button
const CTAButton: React.FC<CTAButtonProps> = ({ to, children, variant = "primary", icon: Icon }) => {
  const base = "inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 min-h-12";

  const variants = {
    primary: `${base} bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 hover:shadow-md focus:ring-red-500`,
    secondary: `${base} bg-white text-gray-800 hover:bg-gray-50 border border-gray-300 focus:ring-gray-400`,
    event: `${base} bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:shadow-md focus:ring-purple-500`,
  };

  return (
    <Link to={to} className={variants[variant]}>
      {children}
      {Icon && <Icon size={20} />}
    </Link>
  );
};

// Hero Section
const Hero: React.FC = () => {
  const y = useParallax(0.3);

  return (
    <section className="relative text-white min-h-screen flex items-center" aria-labelledby="hero-title">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-gray-900 to-black z-0" />

      {/* Floating Particles (Subtle) */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, 20, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 5 + i * 2,
              delay: i * 1,
              ease: "easeInOut",
            }}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full"
            style={{
              left: `${20 + (i * 20) % 80}%`,
              top: `${20 + i * 15}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="container mx-auto px-6 lg:px-12 relative z-20 py-20 text-center"
        style={{ y }}
      >
        <div className="max-w-4xl mx-auto">
          <AnimatedSection delay={0.2}>
            <h1 id="hero-title" className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
             <span className="text-white">Welcome to</span> <span className="text-red-500">EDIZO</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <p className="text-lg md:text-xl font-light mb-8 text-white max-w-lg mx-auto">
              Creative Services & Real-World Learning — All in One Place
            </p>
            <p className="text-lg md:text-xl font-light mb-8 text-white max-w-xl mx-auto">
              Get premium{' '}
              <span className="text-red-500 font-bold">video editing</span>,
              <span className="text-red-500 font-bold"> graphic design</span>, and{' '}
              <span className="text-red-500 font-bold">web development services</span>.
              <br />
              Launch your career with our exclusive{' '}
              <span className="text-red-500 font-bold">internship programs</span>.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xs sm:max-w-md mx-auto">
              <CTAButton to="/services" variant="primary">
                Explore Services
              </CTAButton>
              <CTAButton to="/contact" variant="secondary">
                Get in Touch
              </CTAButton>
            </div>
          </AnimatedSection>
        </div>
      </motion.div>
    </section>
  );
};

// Main Home Component
const Home: React.FC = () => {
  return (
    <div className="bg-white" id="home" role="main">
      <Hero />

      {/* UPCOMING EVENTS */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-purple-50 text-purple-700 rounded-full font-medium text-sm mb-5 border border-purple-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Upcoming Events
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-5">
              Join Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Free Webinars</span>
            </h2>
            <p className="text-gray-600 mb-6">Learn from industry experts — no cost, no risk.</p>
            <CTAButton to="/events" variant="event">
              🚀 View Events & Register
            </CTAButton>
            <p className="text-sm text-gray-500 mt-4">1,000+ professionals attended</p>
          </AnimatedSection>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "10+", label: "Happy Clients" },
              { value: "25+", label: "Projects" },
              { value: "10+", label: "Experts" },
              { value: "5.0", label: "Client Rating" },
            ].map((stat, i) => (
              <StatCard key={i} {...stat} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 text-center mb-10">Expert solutions loved by clients.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { img: webDevelopment, title: "Web Development", desc: "Fast, scalable websites with React & Next.js.", link: "/services/web-development" },
              { img: uiuxImg, title: "UI/UX Design", desc: "Human-centered design that users love.", link: "/services/ui-ux" },
              { img: appDesignImg, title: "App Development", desc: "Cross-platform apps with React Native & Flutter.", link: "/services/app-development" },
              { img: videoEditingImg, title: "Video Editing", desc: "Engaging visuals for brand storytelling.", link: "/services/video-editing" },
              { img: graphicDesignImg, title: "Graphic Design", desc: "Brand-aligned visuals that elevate identity.", link: "/services/graphic-design" },
            ].map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">Our Work</h2>
            <p className="text-gray-600 text-center mb-10">Award-worthy digital solutions.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { img: faceguard, title: "FaceGuard UI/UX", category: "UI/UX" },
              { img: ransomware, title: "Ransomware Awareness", category: "Security" },
              { img: Epicnexus, title: "Epic Nexus App", category: "App" },
            ].map((p) => (
              <PortfolioCard key={p.title} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">Why Choose Edizo?</h2>
            <p className="text-gray-600 text-center mb-10">We deliver unmatched results.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: "Fast Delivery", desc: "On schedule — every time." },
              { icon: Shield, title: "100% Satisfaction", desc: "We revise until you're thrilled." },
              { icon: Target, title: "Results-Driven", desc: "Optimized for growth & impact." },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={0.1 * i}>
                <div className="text-center p-5 bg-gray-50 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 transition-all duration-300">
                  <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <item.icon size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 text-sm mt-1">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* INTERNSHIPS */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">Internships</h2>
            <p className="text-gray-600 text-center mb-10">Launch your career with hands-on experience.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { img: webdevelop, title: "Web Development", link: "/internships/web-development" },
              { img: uiux, title: "UI/UX Design Intern", link: "/internships/ui-ux-design" },
              { img: aiml, title: "AI & Machine Learning", link: "/internships/ai-ml" },
            ].map((item) => (
              <PortfolioCard key={item.title} {...item} isInternship />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 bg-gray-900 text-white text-center">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Ready to Be Our Next Success Story?
            </h2>
            <p className="text-gray-300 mb-6 max-w-lg mx-auto text-sm md:text-base">
              Join 10+ clients who trust us with their digital transformation.
            </p>
            <CTAButton to="/contact" variant="primary" icon={ArrowRight}>
              Contact Us
            </CTAButton>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Home;