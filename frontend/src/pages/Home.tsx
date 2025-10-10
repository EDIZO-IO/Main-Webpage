// src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  Target as TargetIcon,
  Zap as ZapIcon,
  Shield as ShieldIcon2,
  CheckCircle,
  Sparkles,
  TrendingUp,
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
import apiDevelopmentImg from '../assets/services/api-development.webp';
import seoImg from '../assets/services/seo.webp';
import digitalMarketingImg from '../assets/services/digital-marketing.webp';

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
  icon?: React.ComponentType<{ size: number; className?: string }>;
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
  shortDescription?: string;
  isExternal?: boolean;
  isInternship?: boolean;
}

interface CTAButtonProps {
  to: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'event' | 'outline';
  icon?: React.ComponentType<{ size: number }>;
  className?: string;
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
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

// Parallax Hook
const useParallax = (speed = 0.2) => {
  const { scrollY } = useScroll();
  return useTransform(scrollY, [0, 1000], [0, scrollY.get() * speed]);
};

// Stat Card - Enhanced with Icons
const StatCard: React.FC<StatCardProps> = ({ value, label, icon: Icon }) => (
  <AnimatedSection>
    <motion.div
      className="relative p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-red-100 transition-all duration-300 overflow-hidden group"
      whileHover={{ y: -8, scale: 1.02 }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10 text-center">
        {Icon && (
          <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Icon size={24} className="text-white" />
          </div>
        )}
        <h3 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
          {value}
        </h3>
        <p className="text-gray-600 font-medium">{label}</p>
      </div>
    </motion.div>
  </AnimatedSection>
);

// Service Card - Professional Card Design
const ServiceCard: React.FC<ServiceCardProps> = ({ img, title, desc, link }) => (
  <AnimatedSection>
    <motion.div
      className="group relative rounded-2xl overflow-hidden bg-white border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-2xl transition-all duration-500"
      whileHover={{ y: -8 }}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <LazyImage
          src={img}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{desc}</p>
        
        {/* CTA */}
        <Link
          to={link}
          className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 group/link"
        >
          Learn More
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
        </Link>
      </div>

      {/* Decorative Element */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
    </motion.div>
  </AnimatedSection>
);

// Portfolio Card - Modern Project Card
const PortfolioCard: React.FC<PortfolioCardProps> = ({ 
  img, 
  title, 
  category, 
  link, 
  shortDescription, 
  isExternal = false, 
  isInternship = false 
}) => {
  const CardContent = (
    <>
      {/* Image with Overlay */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <LazyImage 
          src={img} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        
        {/* Category Badge */}
        {category && (
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold rounded-full shadow-lg">
            {category}
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
          {title}
        </h3>
        {shortDescription && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
            {shortDescription}
          </p>
        )}
        {isInternship && (
          <p className="text-gray-600 text-sm leading-relaxed">
            Gain real-world experience on live projects.
          </p>
        )}

        {/* Arrow Icon */}
        <div className="mt-4 inline-flex items-center text-red-600 font-semibold text-sm">
          <span className="mr-2">Explore</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
        </div>
      </div>
    </>
  );

  const cardClasses = "group relative rounded-2xl overflow-hidden bg-white border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2";

  if (isExternal) {
    return (
      <AnimatedSection>
        <motion.div className={cardClasses} whileHover={{ y: -8 }}>
          <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
            {CardContent}
          </a>
        </motion.div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection>
      <motion.div className={cardClasses} whileHover={{ y: -8 }}>
        <Link to={link} className="block h-full">
          {CardContent}
        </Link>
      </motion.div>
    </AnimatedSection>
  );
};

// CTA Button - Enhanced Design
const CTAButton: React.FC<CTAButtonProps> = ({ 
  to, 
  children, 
  variant = "primary", 
  icon: Icon,
  className = "" 
}) => {
  const baseClasses = "group inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2";

  const variants = {
    primary: `${baseClasses} bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 shadow-lg hover:shadow-xl focus:ring-red-500 transform hover:scale-105`,
    secondary: `${baseClasses} bg-white text-gray-900 border-2 border-gray-200 hover:border-red-600 hover:text-red-600 shadow-sm hover:shadow-lg focus:ring-gray-400`,
    outline: `${baseClasses} bg-transparent text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white shadow-sm hover:shadow-lg focus:ring-red-500`,
    event: `${baseClasses} bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl focus:ring-purple-500 transform hover:scale-105`,
  };

  const content = (
    <>
      {children}
      {Icon && <Icon size={20}  />}
    </>
  );

  if (to.startsWith('http')) {
    return (
      <a
        href={to}
        target="_blank"
        rel="noopener noreferrer"
        className={`${variants[variant]} ${className}`}
      >
        {content}
      </a>
    );
  }

  return (
    <Link to={to} className={`${variants[variant]} ${className}`}>
      {content}
    </Link>
  );
};

// Hero Section - Modern Professional Design
const Hero: React.FC = () => {
  const y = useParallax(0.2);

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-red-50" aria-labelledby="hero-title">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-200/40 to-orange-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-200/40 to-pink-200/40 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Floating Shapes */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-20"
            style={{
              width: `${100 + i * 50}px`,
              height: `${100 + i * 50}px`,
              background: `linear-gradient(135deg, ${i % 2 === 0 ? '#ff6b6b, #ffa500' : '#8b5cf6, #ec4899'})`,
              left: `${10 + (i * 15) % 80}%`,
              top: `${5 + (i * 20) % 70}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="container mx-auto px-6 lg:px-12 relative z-10"
        style={{ y }}
      >
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <AnimatedSection delay={0.1}>
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-red-200 rounded-full shadow-sm">
                <Sparkles className="w-4 h-4 text-red-600" />
                <span className="text-sm font-semibold text-gray-700">Your Digital Transformation Partner</span>
              </div>
            </div>
          </AnimatedSection>

          {/* Main Heading */}
          <AnimatedSection delay={0.2}>
            <h1 id="hero-title" className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-center mb-6 leading-tight">
              <span className="text-gray-900">Welcome to </span>
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">EDIZO</span>
            </h1>
          </AnimatedSection>

          {/* Subheading */}
          <AnimatedSection delay={0.3}>
            <p className="text-xl md:text-2xl text-center text-gray-600 font-medium mb-4 max-w-3xl mx-auto">
              Creative Services & Real-World Learning — All in One Place
            </p>
          </AnimatedSection>

          {/* Description */}
          <AnimatedSection delay={0.4}>
            <p className="text-lg md:text-xl text-center text-gray-600 leading-relaxed mb-10 max-w-3xl mx-auto">
              Get premium{' '}
              <span className="font-bold text-red-600">video editing</span>,{' '}
              <span className="font-bold text-red-600">graphic design</span>, and{' '}
              <span className="font-bold text-red-600">web development services</span>.
              <br className="hidden md:block" />
              Launch your career with our exclusive{' '}
              <span className="font-bold text-red-600">internship programs</span>.
            </p>
          </AnimatedSection>

          {/* CTAs */}
          <AnimatedSection delay={0.5}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <CTAButton to="/services" variant="primary" icon={ArrowRight}>
                Explore Services
              </CTAButton>
              <CTAButton to="/contact" variant="outline">
                Get in Touch
              </CTAButton>
            </div>
          </AnimatedSection>

          {/* Trust Indicators */}
          <AnimatedSection delay={0.6}>
            <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>10+ Happy Clients</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>25+ Projects Delivered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>5.0 Client Rating</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </motion.div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 105C120 90 240 60 360 52.5C480 45 600 60 720 67.5C840 75 960 75 1080 67.5C1200 60 1320 45 1380 37.5L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.5"/>
        </svg>
      </div>
    </section>
  );
};

// Main Home Component
const Home: React.FC = () => {
  const featuredProjects = [
    {
      id: 'cybersecurity',
      img: ransomware,
      title: 'AI-Based Ransomware Detection System',
      category: 'Cybersecurity',
      link: 'https://bytecode.edizo.in',
      shortDescription: 'An AI system for detecting and preventing ransomware attacks in real-time'
    },
    {
      id: 'ai-computer-vision',
      img: faceguard,
      title: 'FaceGuard-GAN Deepfake Detection',
      category: 'Computer Vision & AI',
      link: 'https://bytecode.edizo.in',
      shortDescription: 'GAN-powered solution for detecting manipulated facial images and videos'
    },
    {
      id: 'web-development',
      img: Epicnexus,
      title: 'Epic Nexus Gaming Community Platform',
      category: 'Web Development',
      link: 'https://bytecode.edizo.in',
      shortDescription: 'Comprehensive gaming community platform with social features and reviews'
    }
  ];

  const featuredInternships = [
    {
      id: 'web-dev',
      img: webdevelop,
      title: 'Web Development',
      link: '/internships/web-development',
      isExternal: false,
      isInternship: true,
    },
    {
      id: 'ui-ux',
      img: uiux,
      title: 'UI/UX Design Intern',
      link: '/internships/ui-ux-design',
      isExternal: false,
      isInternship: true,
    },
    {
      id: 'ai-ml',
      img: aiml,
      title: 'AI & Machine Learning',
      link: '/internships/ai-ml',
      isExternal: false,
      isInternship: true,
    }
  ];

  const featuredServices = [
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
      link: "/services/video-editing"
    },
    { 
      img: graphicDesignImg, 
      title: "Graphic Design", 
      desc: "Brand-aligned visuals that elevate identity.", 
      link: "/services/graphic-design"
    },
    { 
      img: apiDevelopmentImg, 
      title: "API Development", 
      desc: "Robust, scalable APIs for seamless integration.", 
      link: "/services/api-development"
    },
    { 
      img: seoImg, 
      title: "SEO Optimization", 
      desc: "Dominate search engine rankings organically.", 
      link: "/services/seo"
    },
    { 
      img: digitalMarketingImg, 
      title: "Digital Marketing", 
      desc: "Reach & engage your audience across channels.", 
      link: "/services/digital-marketing"
    },
  ];

  return (
    <div className="bg-white" id="home" role="main">
      <Hero />

      {/* UPCOMING EVENTS - Modern Card Design */}
      <section className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #8b5cf6 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              {/* Badge */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full shadow-sm">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-700">Upcoming Events</span>
                </div>
              </div>

              {/* Heading */}
              <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-6">
                Join Our <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Free Webinars</span>
              </h2>

              {/* Description */}
              <p className="text-xl text-center text-gray-600 mb-8">
                Learn from industry experts — no cost, no risk.
              </p>

              {/* CTA */}
              <div className="flex justify-center mb-6">
                <CTAButton to="/events" variant="event" icon={Sparkles}>
                  View Events & Register
                </CTAButton>
              </div>

              {/* Social Proof */}
              <p className="text-center text-gray-500 text-sm flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                1,000+ professionals attended
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>



      {/* SERVICES - Professional Grid */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          {/* Section Header */}
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

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredServices.map((service, index) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS - Portfolio Showcase */}
      <section className="py-24 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
              
                <span className="text-sm font-semibold text-blue-700">Portfolio</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                Our Work
              </h2>
              <p className="text-xl text-gray-600">
                Award-worthy digital solutions. Explore our complete portfolio on our dedicated platform.
              </p>
            </AnimatedSection>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
            {featuredProjects.map((project) => (
              <PortfolioCard key={project.id} {...project} isExternal />
            ))}
          </div>

          {/* View All CTA */}
          <div className="text-center">
            <CTAButton to="https://bytecode.edizo.in" variant="primary" icon={ArrowRight}>
              View All Projects
            </CTAButton>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US - Feature Cards */}
      <section className="py-24 bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <AnimatedSection>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                Why Choose Edizo?
              </h2>
              <p className="text-xl text-gray-600">
                We deliver unmatched results
              </p>
            </AnimatedSection>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { 
                icon: ZapIcon, 
                title: "Fast Delivery", 
                desc: "On schedule — every time.",
                gradient: "from-yellow-500 to-orange-500"
              },
              { 
                icon: ShieldIcon2, 
                title: "100% Satisfaction", 
                desc: "We revise until you're thrilled.",
                gradient: "from-green-500 to-teal-500"
              },
              { 
                icon: TargetIcon, 
                title: "Results-Driven", 
                desc: "Optimized for growth & impact.",
                gradient: "from-blue-500 to-purple-500"
              },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={0.1 * i}>
                <motion.div
                  className="relative p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden"
                  whileHover={{ y: -8 }}
                >
                  {/* Background Gradient on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <div className={`relative w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon size={32} className="text-white" />
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </div>

                  {/* Decorative Element */}
                  <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl ${item.gradient} opacity-5 rounded-tl-full`} />
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* INTERNSHIPS - Career Opportunities */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 border border-purple-200 rounded-full mb-6">
          
                <span className="text-sm font-semibold text-purple-700">Career Growth</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                Internships
              </h2>
              <p className="text-xl text-gray-600">
                Launch your career with hands-on experience
              </p>
            </AnimatedSection>
          </div>

          {/* Internships Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {featuredInternships.map((item) => (
              <PortfolioCard key={item.id} {...item} />
            ))}
          </div>

          {/* View All CTA */}
          <div className="text-center">
            <CTAButton to="/internships" variant="primary" icon={ArrowRight}>
              Explore All Internships
            </CTAButton>
          </div>
        </div>
      </section>

      {/* FINAL CTA - Conversion Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-red-900 to-orange-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          />
        </div>

        {/* Floating Shapes */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: `${60 + i * 40}px`,
              height: `${60 + i * 40}px`,
              left: `${10 + (i * 20) % 80}%`,
              top: `${10 + (i * 15) % 70}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, 15, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-8 shadow-2xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>

              {/* Heading */}
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                Ready to Be Our Next Success Story?
              </h2>

              {/* Description */}
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join 10+ clients who trust us with their digital transformation.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <CTAButton to="/contact" variant="primary" icon={ArrowRight}>
                  Contact Us Today
                </CTAButton>
                <CTAButton to="/services" variant="secondary">
                  View Our Services
                </CTAButton>
              </div>

              {/* Trust Badge */}
              <div className="mt-12 flex items-center justify-center gap-2 text-gray-400">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm">100% Client Satisfaction Guaranteed</span>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
