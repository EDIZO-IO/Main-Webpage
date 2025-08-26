// src/pages/Home.jsx
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

// Service Images (consistent with Services page)
import webDevelopment from '../assets/services/website design.webp';
import uiuxImg from '../assets/services/uiux.webp';
import appDesignImg from '../assets/services/app design.webp';
import videoEditingImg from '../assets/services/video editing.webp';
import graphicDesignImg from '../assets/services/graphic design.webp';

// internship
import uiux from '../assets/images/web-design.png';
import webdevelop from '../assets/images/web-development.png';
import aiml from '../assets/images/ai-assistant.png';

// Lazy Load Images
const LazyImage = ({ src, alt, className = "" }) => (
  <img src={src} alt={alt} loading="lazy" className={className} />
);

// Animated Section with Scroll Trigger
const AnimatedSection = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// Parallax Scroll Hook
const useParallax = (speed = 0.2) => {
  const { scrollY } = useScroll();
  return useTransform(scrollY, [0, 1000], [0, scrollY.current * speed]);
};

// Stat Card
const StatCard = ({ value, label }) => (
  <AnimatedSection>
    <motion.div
      className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-center"
      whileHover={{ y: -10, scale: 1.02 }}
    >
      <h3 className="text-4xl font-bold text-red-600 mt-3">{value}</h3>
      <p className="text-gray-500 mt-1">{label}</p>
    </motion.div>
  </AnimatedSection>
);

// Service Card (Image-Based, No Icons)
const ServiceCard = ({ img, title, desc, link }) => (
  <AnimatedSection>
    <motion.div
      className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      tabIndex="0"
      role="article"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <LazyImage src={img} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <p className="text-gray-600 mb-4 mt-2">{desc}</p>
        <Link
          to={link}
          className="text-red-600 font-medium flex items-center hover:text-red-700 group"
        >
          Learn more
          <ArrowRight
            size={16}
            className="ml-1 group-hover:translate-x-1 transition-transform"
            aria-hidden="true"
          />
        </Link>
      </div>
    </motion.div>
  </AnimatedSection>
);

// Portfolio Card (Projects & Internships)
const PortfolioCard = ({ img, title, category, link, isInternship = false }) => (
  <AnimatedSection>
    <motion.div
      className="bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative"
      whileHover={{ y: -10, scale: 1.02 }}
    >
      <LazyImage src={img} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        {!isInternship && (
          <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">
            {category}
          </span>
        )}
        <h3 className="text-xl font-bold text-gray-900 mt-2">{title}</h3>
        {isInternship && (
          <p className="text-gray-600 text-sm mt-2">
            Gain real-world experience, work on live projects, and learn from industry experts.
          </p>
        )}
      </div>
      <Link to={link} className="absolute inset-0 z-10" aria-label={`View ${title}`} />
    </motion.div>
  </AnimatedSection>
);

// Testimonial Card
const TestimonialCard = ({ name, role, rating, content }) => (
  <AnimatedSection>
    <motion.div
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
            aria-hidden="true"
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
      </div>
      <blockquote className="text-gray-700 italic mb-4">"{content}"</blockquote>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold">
          {name[0]}
        </div>
        <div className="ml-3">
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </motion.div>
  </AnimatedSection>
);

// CTA Button
const CTAButton = ({ to, children, variant = "primary", icon: Icon }) => {
  const base = "inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-full shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 min-h-12";

  const variants = {
    primary: `${base} bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 transform hover:scale-105 focus:ring-red-500`,
    secondary: `${base} border-2 border-white text-white bg-transparent hover:bg-white hover:text-gray-900 transform hover:scale-105 focus:ring-white`,
    event: `${base} from-purple-600 to-pink-600 bg-gradient-to-r text-white hover:shadow-xl hover:scale-105 focus:ring-purple-500`,
  };

  return (
    <Link to={to} className={variants[variant]}>
      {children}
      {Icon && <Icon size={20} />}
    </Link>
  );
};

// Hero Section
const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -50]);
  const scale = useTransform(scrollY, [0, 600], [1, 0.95]);

  return (
    <section
      className="relative text-white overflow-hidden min-h-screen flex items-center"
      aria-labelledby="hero-title"
    >
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-red-900 via-gray-900 to-black z-0"
        style={{ scale }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, 100, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              repeat: Infinity,
              duration: 6 + i * 2,
              delay: i * 1.5,
              ease: "easeInOut",
            }}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full"
            style={{
              left: `${20 + (i * 15) % 80}%`,
              top: `${10 + i * 15}%`,
            }}
          />
        ))}
      </div>

      {/* Hero Content */}
      <motion.div
        className="container mx-auto px-6 lg:px-12 relative z-20 py-20 text-center"
        style={{ y }}
      >


        {/* Headline */}
        <AnimatedSection delay={0.3}>
          <h1 id="hero-title" className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-red-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Digital Excellence,
            </span>
            <br />
            <span className="text-white">Backed by Reviews</span>
          </h1>
        </AnimatedSection>

        {/* Subtitle */}
        <AnimatedSection delay={0.4}>
          <p className="text-lg md:text-xl font-light mb-10 text-gray-200 max-w-2xl mx-auto">
            We craft digital experiences that <strong>clients love</strong>. Rated <strong>5.0/5</strong> by 50+ satisfied partners.
          </p>
        </AnimatedSection>

        {/* CTA Buttons */}
        <AnimatedSection delay={0.5}>
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xs sm:max-w-md mx-auto">
            <CTAButton to="/services" variant="primary">
              Explore Services
            </CTAButton>
            <CTAButton to="/contact" variant="secondary">
              Get Free Consultation
            </CTAButton>
          </div>
        </AnimatedSection>

        {/* Stats */}
        <AnimatedSection delay={0.6}>
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80 text-sm md:text-base">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span>5.0 Rating • 10+ Reviews</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/30"></div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>10+ Happy Clients</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/30"></div>
            <div className="flex items-center gap-2">
              <ProjectsIcon className="w-5 h-5" />
              <span>25+ Projects Delivered</span>
            </div>
          </div>
        </AnimatedSection>
      </motion.div>
    </section>
  );
};

// Main Home Component
const Home = () => {
  return (
    <div className="bg-white" id="home" role="main">
      <Hero />

      {/* UPCOMING EVENTS */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full font-semibold text-lg mb-6 shadow-sm border border-purple-200">
              <span className="w-5 h-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              Upcoming Events
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Join Our <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Free Webinars & Workshops</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">Learn from industry experts — all for free.</p>
            <CTAButton to="/events" variant="event" icon={() => (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}>
              🚀 View All Events & Register
            </CTAButton>
            <p className="text-sm text-gray-500 mt-6">1,000+ professionals attended</p>
          </AnimatedSection>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "10+", label: "Happy Clients" },
              { value: "25+", label: "Projects" },
              { value: "10+", label: "Experts" },
              { value: "5.0", label: "Client Rating" },
            ].map((stat, i) => (
              <StatCard key={i} {...stat} delay={i * 0.15} />
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-center text-gray-600 mb-12">Expert solutions loved by clients.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { img: webDevelopment, title: "Web Development", desc: "Fast, scalable websites with React & Next.js.", link: "/services/web-development" },
              { img: uiuxImg, title: "UI/UX Design", desc: "Human-centered design that users love.", link: "/services/ui-ux-design" },
              { img: appDesignImg, title: "App Development", desc: "Cross-platform apps with React Native & Flutter.", link: "/services/app-development" },
              { img: videoEditingImg, title: "Video Editing", desc: "Engaging visuals for brand storytelling.", link: "/services/video-editing" },
              { img: graphicDesignImg, title: "Graphic Design", desc: "Brand-aligned visuals that elevate identity.", link: "/services/graphic-design" },
            ].map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {/* <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">What Clients Say</h2>
            <p className="text-lg text-center text-gray-600 mb-12">Real feedback from real clients.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Kim", role: "Marketing Director", rating: 5, content: "Edizo transformed our brand presence — on time, under budget, stunning results." },
              { name: "James Patel", role: "Founder", rating: 5, content: "A game-changer! Their app is loved by users from day one." },
              { name: "Lena Wu", role: "CEO", rating: 5, content: "Professional, creative, and deeply impactful." },
            ].map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
          <div className="text-center mt-10">
            <CTAButton to="/reviews" variant="primary" icon={MessageCircle}>
              Read All Reviews
            </CTAButton>
          </div>
        </div>
      </section> */}

{/* PROJECTS */}
<section className="py-20 bg-white">
  <div className="container mx-auto px-6">
    <AnimatedSection>
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">Our Work</h2>
      <p className="text-lg text-center text-gray-600 mb-12">Award-worthy digital solutions.</p>
    </AnimatedSection>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { img: faceguard, title: "FaceGuard UI/UX" },
        { img: ransomware, title: "Ransomware Awareness" },
        { img: Epicnexus, title: "Epic Nexus App" },
      ].map((p) => (
        <PortfolioCard key={p.title} {...p} />
      ))}
    </div>
  </div>
</section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">Why Choose Edizo?</h2>
            <p className="text-lg text-center text-gray-600 mb-12">We deliver unmatched results.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Fast Delivery", desc: "On schedule — every time." },
              { icon: Shield, title: "100% Satisfaction", desc: "We revise until you're thrilled." },
              { icon: Target, title: "Results-Driven", desc: "Optimized for growth & impact." },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={0.2 * i}>
                <div className="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* INTERNSHIPS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">Internships</h2>
            <p className="text-lg text-center text-gray-600 mb-12">Launch your career with hands-on experience.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { img: webdevelop, title: "Web Development ", link: "/internships/web-development" },
              { img: uiux, title: "UI/UX Design Intern", link: "/internships/ui-ux-design" },
              { img: aiml, title: "AI & Machine Learning", link: "/internships/ai-ml" },
            ].map((item) => (
              <PortfolioCard key={item.title} {...item} isInternship />
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-gray-900 text-white text-center">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Ready to Be Our Next Success Story?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-300">
              Join 50+ clients who trust us with their digital transformation.
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