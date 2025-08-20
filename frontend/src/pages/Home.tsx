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
  PenTool,
  Code,
  Smartphone,
  Video,
  ImageIcon,
  Calendar,
  MessageCircle,
  Target,
  Zap,
  Shield,
} from 'lucide-react';

// Import Assets
import faceguard from '../assets/project/face-Guard.png';
import ransomware from '../assets/project/Ransomware.png';
import Epicnexus from '../assets/project/Epic-nexus.png';
import webDevelopment from '../assets/images/web-development.png';
import responsiveDesign from '../assets/images/responsive-design.png';
import contentStrategy from '../assets/images/content-strategy.png';

// Lazy Load Images
const LazyImage = ({ src, alt, className = "" }) => (
  <img src={src} alt={alt} loading="lazy" className={className} />
);

// Enhanced Animated Section with Stagger & Scroll
const AnimatedSection = ({ children, delay = 0, threshold = 0.2 }) => (
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "0px 0px -100px 0px", amount: threshold }}
    transition={{ duration: 0.7, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// Floating Header Effect (Optional: subtle parallax on hero)
const useScrollAnimation = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -30]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.95]);
  return { y, scale };
};

// Stat Card
const StatCard = ({ icon: Icon, value, label }) => (
  <motion.div
    className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 text-center"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.03 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
  >
    <Icon className="w-10 h-10 mx-auto text-red-600" aria-hidden="true" />
    <h3 className="text-4xl font-bold text-gray-900 mt-3">{value}</h3>
    <p className="text-gray-500 mt-1">{label}</p>
  </motion.div>
);

// Service Card
const ServiceCard = ({ icon: Icon, title, desc, link }) => (
  <AnimatedSection threshold={0.3}>
    <motion.div
      className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
      whileHover={{ scale: 1.02 }}
      tabIndex="0"
      role="article"
      aria-labelledby={`service-title-${title}`}
    >
      <div className="flex items-center mb-4">
        <div className="p-3 bg-red-100 rounded-lg text-red-600 mr-4">
          <Icon size={24} aria-hidden="true" />
        </div>
        <h3 id={`service-title-${title}`} className="text-xl font-bold text-gray-900">
          {title}
        </h3>
      </div>
      <p className="text-gray-600 mb-4">{desc}</p>
      <Link
        to={link}
        className="text-red-600 font-medium flex items-center hover:text-red-700 group"
      >
        Learn more
        <ArrowRight
          size={16}
          className="ml-1 group-hover:translate-x-1 transition-transform duration-300"
          aria-hidden="true"
        />
      </Link>
    </motion.div>
  </AnimatedSection>
);

// Portfolio Card (Projects & Internships)
const PortfolioCard = ({ img, title, category, link, isInternship = false }) => (
  <AnimatedSection threshold={0.3}>
    <div className="bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 relative">
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
      <Link
        to={link}
        className="absolute inset-0 z-10"
        aria-label={`View details of ${title}`}
      />
    </div>
  </AnimatedSection>
);

// Testimonial Card
const TestimonialCard = ({ name, role, rating, content }) => (
  <AnimatedSection threshold={0.4}>
    <div
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
      itemScope
      itemType="http://schema.org/Review"
    >
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, idx) => (
          <Star
            key={idx}
            size={16}
            className={
              idx < Math.round(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }
            aria-hidden="true"
          />
        ))}
        <span className="ml-2 text-sm text-gray-600 font-medium">{rating}/5</span>
      </div>
      <blockquote className="text-gray-700 italic mb-4" itemProp="reviewBody">
        "{content}"
      </blockquote>
      <div className="flex items-center">
        <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold" aria-hidden="true">
          {name[0]}
        </div>
        <div className="ml-3">
          <h4 className="font-semibold text-gray-900" itemProp="author" itemScope itemType="http://schema.org/Person">
            <span itemProp="name">{name}</span>
          </h4>
          <p className="text-sm text-gray-500" itemProp="jobTitle">{role}</p>
        </div>
      </div>
    </div>
  </AnimatedSection>
);

// CTA Button
const CTAButton = ({ to, children, variant = "primary", icon: Icon }) => {
  const baseClasses =
    "inline-flex items-center gap-2 px-8 py-3 font-semibold rounded-full shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2";

  const variants = {
    primary: `${baseClasses} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`,
    secondary: `${baseClasses} border-2 border-white text-white bg-transparent hover:bg-white hover:text-gray-900 focus:ring-white`,
    event: `${baseClasses} from-purple-600 to-pink-600 bg-gradient-to-r text-white hover:shadow-xl focus:ring-purple-500`,
  };

  return (
    <Link to={to} className={variants[variant]}>
      {children}
      {Icon && <Icon size={20} />}
    </Link>
  );
};

// Hero Section with Subtle Scroll Parallax
const Hero = () => {
  const { y, scale } = useScrollAnimation();

  return (
    <section className="relative text-white overflow-hidden min-h-screen flex items-center" aria-labelledby="hero-title">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-gray-900 to-black z-0"></div>
      <motion.div
        className="container mx-auto px-6 lg:px-12 relative z-10 py-20 text-center"
        style={{ y, scale }}
      >
        <AnimatedSection delay={0.1}>
          <p className="uppercase tracking-widest text-sm md:text-base text-red-300 font-semibold mb-4">
            Trusted by 50+ Global Clients
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <h1 id="hero-title" className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-red-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Digital Excellence, Backed by Reviews
          </h1>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <p className="text-lg md:text-xl font-light mb-10 text-gray-200 max-w-2xl mx-auto">
            We craft digital experiences that <strong>clients love</strong>. Rated <strong>5.0/5</strong> by 50+ satisfied partners.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.4}>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <CTAButton to="/services" variant="primary">
              Explore Services
            </CTAButton>
            <CTAButton to="/contact" variant="secondary">
              Get Free Consultation
            </CTAButton>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.5}>
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium">5.0 Rating • 50+ Reviews</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/30"></div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span className="text-sm font-medium">50+ Happy Clients</span>
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
      <section className="py-20 bg-gradient-to-b from-white to-gray-50" aria-labelledby="events-title">
        <div className="container mx-auto px-6 text-center max-w-4xl">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full font-semibold text-lg mb-6 shadow-sm border border-purple-200">
              <Calendar className="w-5 h-5 text-purple-600" />
              Upcoming Events
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Join Our <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Free Webinars & Workshops</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">Learn from industry experts — all for free.</p>
            <CTAButton to="/events" variant="event" icon={Calendar}>
              🚀 View All Events & Register
            </CTAButton>
            <p className="text-sm text-gray-500 mt-6">1,000+ professionals attended</p>
          </AnimatedSection>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Users, value: "50+", label: "Happy Clients" },
              { icon: ProjectsIcon, value: "75+", label: "Projects" },
              { icon: UserCheck, value: "30+", label: "Experts" },
              { icon: Star, value: "5.0", label: "Rating" },
            ].map((stat, i) => (
              <StatCard key={i} {...stat} delay={i * 0.1} />
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
              { icon: PenTool, title: "UI/UX Design", desc: "Human-centered design that users love.", link: "/services/ui-ux-design" },
              { icon: Code, title: "Web Development", desc: "Fast, scalable websites with React & Next.js.", link: "/services/web-development" },
              { icon: Smartphone, title: "App Development", desc: "Cross-platform apps with React Native & Flutter.", link: "/services/app-development" },
              { icon: Video, title: "Video Editing", desc: "Engaging visuals for brand storytelling.", link: "/services/video-editing" },
              { icon: ImageIcon, title: "Graphic Design", desc: "Brand-aligned visuals that elevate identity.", link: "/services/graphic-design" },
            ].map((s) => (
              <ServiceCard key={s.title} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-gray-50">
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
      </section>

      {/* PROJECTS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">Our Work</h2>
            <p className="text-lg text-center text-gray-600 mb-12">Award-worthy digital solutions.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { img: faceguard, title: "FaceGuard UI/UX", category: "Design", link: "/projects/faceguard" },
              { img: ransomware, title: "Ransomware Awareness", category: "Web", link: "/projects/ransomware" },
              { img: Epicnexus, title: "Epic Nexus App", category: "App", link: "/projects/epic-nexus" },
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
            <p className="text-lg text-center text-gray-600 mb-12">Unmatched results through creativity & tech.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Fast Delivery", desc: "On schedule — every time." },
              { icon: Shield, title: "100% Satisfaction", desc: "We revise until you're thrilled." },
              { icon: Target, title: "Results-Driven", desc: "Optimized for growth & impact." },
            ].map((item) => (
              <AnimatedSection key={item.title} delay={0.2}>
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
              { img: webDevelopment, title: "Web Development Intern", link: "/internships/web-dev" },
              { img: responsiveDesign, title: "UI/UX Design Intern", link: "/internships/ui-ux" },
              { img: contentStrategy, title: "Content & Strategy Intern", link: "/internships/content-strategy" },
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
            <h2 className="text-3xl text-yellow-400 font-bold mb-4">Ready to Be Our Next Success Story?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-gray-300">
              Join 50+ clients who trust us.
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