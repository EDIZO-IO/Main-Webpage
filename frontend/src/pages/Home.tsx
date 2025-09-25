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
  Palette,
  Video,
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
  isGraphicsOrVideo?: boolean;
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
    initial={{ opacity: 0, y: 50 }}
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
      className="p-5 bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100/50 text-center hover:shadow-lg transition-shadow duration-300"
      whileHover={{ y: -4 }}
    >
      <h3 className="text-3xl font-bold text-red-600">{value}</h3>
      <p className="text-gray-600 text-sm mt-1">{label}</p>
    </motion.div>
  </AnimatedSection>
);

// Service Card
const ServiceCard: React.FC<ServiceCardProps> = ({ img, title, desc, link, isGraphicsOrVideo = false }) => (
  <AnimatedSection>
    <motion.div
      className={`relative rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden ${
        isGraphicsOrVideo ? 'bg-gradient-to-br from-red-100 via-orange-100 to-pink-100' : 'bg-white/90 backdrop-blur-sm'
      } transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl group`}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative h-40 overflow-hidden">
        <LazyImage
          src={img}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {isGraphicsOrVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center"
            >
              {title === 'Graphic Design' ? (
                <Palette className="text-red-600" size={28} />
              ) : (
                <Video className="text-red-600" size={28} />
              )}
            </motion.div>
          </motion.div>
        )}
        {isGraphicsOrVideo && (
          <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            {title === 'Graphic Design' ? 'BRANDING' : 'VIDEO'}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-red-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mt-2 mb-4 leading-relaxed">{desc}</p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to={link}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full font-medium text-sm hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-md"
          >
            Learn More
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </motion.div>
  </AnimatedSection>
);

// Portfolio Card (Projects & Internships)
const PortfolioCard: React.FC<PortfolioCardProps> = ({ img, title, category, link, isInternship = false }) => (
  <AnimatedSection>
    <motion.div
      className="relative rounded-xl shadow-md border border-gray-100/50 overflow-hidden bg-white/90 backdrop-blur-sm transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
      whileHover={{ y: -6 }}
    >
      <div className="relative h-40 overflow-hidden">
        <LazyImage src={img} alt={title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
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
        <Link to={link} className="absolute inset-0 z-10" aria-label={`View ${title}`} />
      </div>
    </motion.div>
  </AnimatedSection>
);

// CTA Button
const CTAButton: React.FC<CTAButtonProps> = ({ to, children, variant = "primary", icon: Icon }) => {
  const base = "inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 min-h-12";

  const variants = {
    primary: `${base} bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 hover:shadow-md focus:ring-red-500`,
    secondary: `${base} bg-white/90 backdrop-blur-sm text-gray-800 hover:bg-gray-50/80 border border-gray-300 focus:ring-gray-400`,
    event: `${base} bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 hover:shadow-md focus:ring-purple-500`,
  };

  return (
    <Link to={to} className={variants[variant]}>
      {children}
      {Icon && <Icon size={20} />}
    </Link>
  );
};

// Hero Section with 3D Effect over Old Background
const Hero: React.FC = () => {
  const y = useParallax(0.3);

  return (
    <section className="relative text-white pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden" aria-labelledby="hero-title">
      {/* Original Gradient Background with 3D Effect */}
      <div className="absolute inset-0 z-0">
        {/* Original Curved SVG with Gradient */}
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#FF6B6B', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path
            d="M0,0 L1440,0 C1440,400 1080,600 720,600 C360,600 0,400 0,800 L0,0 Z"
            fill="url(#heroGradient)"
          />
          <path
            d="M0,200 C360,400 1080,400 1440,200 L1440,800 C1080,600 360,600 0,800 Z"
            fill="url(#heroGradient)"
            opacity="0.3"
          />
        </svg>
        
        {/* Subtle Noise Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%27100%27 viewBox=%270 0 100 100%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%27 height=%27100%27 filter=%27url(%23noise)%27 opacity=%270.05%27/%3E%3C/svg%3E")',
          }}
        />
      </div>

      {/* 3D Floating Elements */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {/* Floating 3D Spheres */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-30"
            style={{
              width: `${40 + i * 10}px`,
              height: `${40 + i * 10}px`,
              background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.1))`,
              left: `${10 + (i * 20) % 80}%`,
              top: `${10 + (i * 15) % 80}%`,
              filter: 'blur(1px)',
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              y: { duration: 8 + i, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 10 + i, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}

        {/* Floating 3D Cubes */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`cube-${i}`}
            className="absolute w-12 h-12 opacity-40"
            style={{
              background: `linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))`,
              transform: 'rotateX(60deg) rotateY(45deg)',
              left: `${30 + i * 25}%`,
              top: `${40 + i * 20}%`,
              filter: 'blur(0.5px)',
            }}
            animate={{
              rotateX: [0, 360],
              rotateY: [0, 360],
              y: [0, -20, 0],
              x: [0, 10, 0],
            }}
            transition={{
              rotateX: { duration: 20 + i * 5, repeat: Infinity, ease: "linear" },
              rotateY: { duration: 15 + i * 3, repeat: Infinity, ease: "linear" },
              y: { duration: 6 + i, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 8 + i, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}

        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            animate={{
              y: [0, 20, 0],
              x: [0, 10, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              repeat: Infinity,
              duration: 5 + i % 3,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full"
            style={{
              left: `${10 + (i * 7) % 90}%`,
              top: `${10 + (i * 5) % 80}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="container mx-auto px-6 lg:px-12 relative z-20"
        style={{ y }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection delay={0.2}>
            <h1 id="hero-title" className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
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
  const featuredProjects = [
    {
      id: 'cybersecurity',
      img: 'https://placehold.co/600x400/eee/999?text=Cybersecurity',
      title: 'AI-Based Ransomware Detection System',
      category: 'Cybersecurity',
      link: 'https://bytecode.edizo.in', // Link to external site
      shortDescription: 'An AI system for detecting and preventing ransomware attacks in real-time'
    },
    {
      id: 'ai-computer-vision',
      img: 'https://placehold.co/600x400/eee/999?text=AI+%26+Computer+Vision',
      title: 'FaceGuard-GAN Deepfake Detection',
      category: 'Computer Vision & AI',
      link: 'https://bytecode.edizo.in', // Link to external site
      shortDescription: 'GAN-powered solution for detecting manipulated facial images and videos'
    },
    {
      id: 'web-development',
      img: 'https://placehold.co/600x400/eee/999?text=Web+Development',
      title: 'Epic Nexus Gaming Community Platform',
      category: 'Web Development',
      link: 'https://bytecode.edizo.in', // Link to external site
      shortDescription: 'Comprehensive gaming community platform with social features and reviews'
    }
  ];
  return (
    <div className="bg-gradient-to-b from-gray-50 to-blue-50" id="home" role="main">
      <Hero />

      {/* UPCOMING EVENTS */}
      <section className="py-16 bg-gradient-to-r from-purple-50 via-pink-50 to-blue-50">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-purple-100/80 backdrop-blur-sm text-purple-700 rounded-full font-medium text-sm mb-5 border border-purple-100/50">
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
      <section className="py-16 bg-gradient-to-b from-blue-50 to-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "10+", label: "Happy Clients" },
              { value: "25+", label: "Projects" },
              { value: "10+", label: "Experts" },
              { value: "5.0", label: "Client Rating" },
            ].map((stat, i) => (
              <StatCard key={i} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 text-center mb-10">Expert solutions loved by clients.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                img: webDevelopment, 
                title: "Web Development", 
                desc: "Fast, scalable websites with React & Next.js.", 
                link: "/services/web-development" 
              },
              { 
                img: uiuxImg, 
                title: "UI/UX Design", 
                desc: "Human-centered design that users love.", 
                link: "/services/ui-ux" 
              },
              { 
                img: appDesignImg, 
                title: "App Development", 
                desc: "Cross-platform apps with React Native & Flutter.", 
                link: "/services/app-development" 
              },
              { 
                img: videoEditingImg, 
                title: "Video Editing", 
                desc: "Engaging visuals for brand storytelling.", 
                link: "/services/video-editing",
                isGraphicsOrVideo: true 
              },
              { 
                img: graphicDesignImg, 
                title: "Graphic Design", 
                desc: "Brand-aligned visuals that elevate identity.", 
                link: "/services/graphic-design",
                isGraphicsOrVideo: true 
              },
            ].map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

     {/* PROJECTS - Updated Section to link to external site */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-blue-50">
        <div className="container mx-auto px-6">
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-4">Our Work</h2>
            <p className="text-gray-600 text-center mb-10">Award-worthy digital solutions. Explore our complete portfolio on our dedicated platform.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <AnimatedSection key={project.id}>
                <motion.div
                  className="relative rounded-xl shadow-md border border-gray-100/50 overflow-hidden bg-white/90 backdrop-blur-sm transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
                  whileHover={{ y: -6 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <LazyImage
                      src={project.img}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                      {project.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.shortDescription}</p>
                    {/* Changed from Link to external <a> tag */}
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-full font-medium text-sm hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-md"
                    >
                      View Details
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </a>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center mt-8">
            {/* Changed CTA button to link to external site */}
            <a
              href="https://bytecode.edizo.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-full transition-all duration-300 focus:outline-none focus:ring-2 min-h-12 bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 hover:shadow-md focus:ring-red-500"
            >
              View All Projects
              <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>


      {/* WHY CHOOSE US */}
      <section className="py-16 bg-gradient-to-r from-white via-gray-50 to-white">
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
                <div className="text-center p-5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white/95 border border-gray-100/50 hover:border-gray-200/50 transition-all duration-300">
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
      <section className="py-16 bg-gradient-to-b from-blue-50 to-gray-50">
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
      <section className="py-16 bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 text-white text-center">
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