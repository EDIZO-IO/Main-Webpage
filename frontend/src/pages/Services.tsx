
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CheckCircle, Star, Zap, Palette, Code, Smartphone, Layout } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';

// Import local service images
import webDevImg from '../assets/services/website design.webp';
import uiuxImg from '../assets/services/uiux.webp';
import videoEditingImg from '../assets/services/video editing.webp';
import graphicDesignImg from '../assets/services/graphic design.webp';
import appDesignImg from '../assets/services/app design.webp';

// --- Define TypeScript Interfaces ---
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  servicesInclude: string[];
  image: string;
  primaryColor: string;
  secondaryColor: string;
  gradient: string;
  accent: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface AnimatedTypingSubtitleProps {
  phrases: string[];
}

// LazyImage Component
const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className = "" }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    className={className}
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      target.src = `https://placehold.co/600x400/DEE2E6/495057?text=${encodeURIComponent(alt)}`;
    }}
  />
);

// Why Choose Edizo - Common for all services
const whyChooseEdizoServiceContent = [
  { title: "Creative, Custom-First Approach", icon: Palette },
  { title: "On-Time Project Delivery", icon: Zap },
  { title: "Affordable & Transparent Pricing", icon: Star },
  { title: "Friendly Support & Professional Team", icon: Code },
];

// Service data
const services: Service[] = [
  {
    id: 'video-editing',
    title: 'Video Editing',
    description: 'We turn raw footage into polished, engaging content. Whether it’s for social media, corporate events, or promotions, our editing enhances visual appeal and storytelling.',
    servicesInclude: [
      'Promotional Videos & Intros',
      'Reels, Shorts & YouTube Edits',
      'Event Highlights & Corporate Videos',
      'Motion Graphics & Animations',
    ],
    image: videoEditingImg,
    primaryColor: 'bg-indigo-600',
    secondaryColor: 'text-indigo-600',
    gradient: 'from-indigo-50 to-blue-50',
    accent: 'bg-gradient-to-br from-indigo-500 to-blue-600',
    icon: Smartphone,
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    description: 'Great design builds strong brands. Our creative team brings ideas to life with visuals that are both impactful and purpose-driven across digital and print media.',
    servicesInclude: [
      'Logo Design & Brand Identity',
      'Posters, Brochures & Business Cards',
      'Certificates, Banners & Flyers',
      'Social Media Post & Ad Designs',
    ],
    image: graphicDesignImg,
    primaryColor: 'bg-pink-600',
    secondaryColor: 'text-pink-600',
    gradient: 'from-pink-50 to-purple-50',
    accent: 'bg-gradient-to-br from-pink-500 to-purple-600',
    icon: Palette,
  },
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'We build responsive and high-performance websites tailored to your business needs — from personal portfolios to full-scale e-commerce platforms.',
    servicesInclude: [
      'Business & Portfolio Websites',
      'E-Commerce & Dynamic Sites',
      'Frontend & Backend Development',
      'SEO-Friendly, Mobile-Optimized Design',
    ],
    image: webDevImg,
    primaryColor: 'bg-blue-600',
    secondaryColor: 'text-blue-600',
    gradient: 'from-blue-50 to-cyan-50',
    accent: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    icon: Code,
  },
  {
    id: 'app-development',
    title: 'App Development',
    description: 'We create sleek, user-friendly mobile apps that combine function with form. Our development process ensures smooth performance across Android and iOS platforms.',
    servicesInclude: [
      'Android & iOS App Development',
      'UI/UX Design for Apps',
      'Service & Business-Based Applications',
      'Development using React Native, Flutter & Native Tools',
    ],
    image: appDesignImg,
    primaryColor: 'bg-green-600',
    secondaryColor: 'text-green-600',
    gradient: 'from-green-50 to-lime-50',
    accent: 'bg-gradient-to-br from-green-500 to-lime-600',
    icon: Smartphone,
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    description: 'User-centered design solutions that create intuitive, engaging interfaces for digital products.',
    servicesInclude: [
      'User Research',
      'Information Architecture',
      'Wireframing',
      'Visual Design',
      'Usability Testing',
      'Interaction Design',
      'Responsive Design',
      'Design Systems',
    ],
    image: uiuxImg,
    primaryColor: 'bg-red-600',
    secondaryColor: 'text-red-600',
    gradient: 'from-red-50 to-orange-50',
    accent: 'bg-gradient-to-br from-red-500 to-orange-600',
    icon: Layout,
  },
];

// Typing Animation for Subtitle
const AnimatedTypingSubtitle: React.FC<AnimatedTypingSubtitleProps> = ({ phrases }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayedText.length < currentPhrase.length) {
          setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
          setTypingSpeed(100 + Math.random() * 50);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(currentPhrase.substring(0, displayedText.length - 1));
          setTypingSpeed(50);
        } else {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
          setTypingSpeed(150);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, phraseIndex, phrases, typingSpeed]);

  return (
    <span className="relative font-semibold text-xl md:text-2xl text-white">
      {displayedText}
      <span className="inline-block w-1 h-7 ml-1 bg-gradient-to-b from-red-500 to-orange-500 align-middle animate-pulse" />
    </span>
  );
};

// Animated Section Wrapper
interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay, type: 'spring', stiffness: 100, damping: 15 }}
  >
    {children}
  </motion.div>
);

// Service Card
const ServiceCard: React.FC<Service> = ({ image, title, description, servicesInclude, id, icon: Icon }) => (
  <AnimatedSection>
    <motion.div
      className="relative rounded-2xl shadow-md border border-gray-100/50 overflow-hidden bg-white/90 backdrop-blur-sm transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl group h-full flex flex-col"
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative h-40 overflow-hidden">
        <LazyImage
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
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
            <Icon className="text-red-600" size={28} />
          </motion.div>
        </motion.div>
        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
          SERVICE
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-red-600 transition-colors mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
          {description}
        </p>
        
        {/* Services Include */}
        <div className="mb-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Includes:</h4>
          <ul className="space-y-1">
            {servicesInclude.slice(0, 3).map((item, i) => (
              <li key={i} className="flex items-center text-xs text-gray-500">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                {item}
              </li>
            ))}
            {servicesInclude.length > 3 && (
              <li className="text-xs text-gray-400">+{servicesInclude.length - 3} more</li>
            )}
          </ul>
        </div>
        
        <div className="mt-auto">
          <Link
            to={`/services/${id}`}
            className="inline-flex items-center text-sm font-semibold text-red-600 hover:underline group/link"
          >
            Explore Details
            <ArrowRight className="ml-1.5 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  </AnimatedSection>
);

const Services: React.FC = () => {
  return (
    <>
      <PageHeader
        title="Our Services"
        subtitle="Comprehensive digital solutions tailored to your business needs"
        variant="services"
      />

      {/* What We Offer */}
      <section className="py-16 bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-orange-100 text-red-700 rounded-full font-medium text-sm mb-6 border border-red-200/50">
                <Zap size={16} />
                Premium Services
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                What We Offer
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                High-quality services designed to elevate your digital presence and drive business growth.
              </p>
            </div>
          </AnimatedSection>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.map((service, index) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-16">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 text-white font-semibold text-base rounded-full shadow-lg hover:shadow-xl hover:from-red-600 hover:via-orange-600 hover:to-pink-600 transition-all duration-300 group min-h-12"
              >
                <span className="relative">
                  Need a Custom Solution? 
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-white/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                </span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </motion.div>
            <p className="text-gray-500 text-sm mt-4">Free consultation • No obligation • Expert advice</p>
          </div>
        </div>
      </section>

      {/* Why Choose Edizo */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Choose Edizo?</span>
              </h2>
              <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                We don't just deliver services — we build partnerships that grow your business.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseEdizoServiceContent.map((item, i) => (
              <AnimatedSection key={i} delay={0.1 + i * 0.1}>
                <motion.div
                  className="flex items-start space-x-4 p-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100/50 hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
                  whileHover={{ y: -4 }}
                >
                  <motion.div
                    className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-xl flex items-center justify-center mt-0.5 shadow-lg"
                    whileHover={{ rotate: 180, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <item.icon className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
                      {item.title}
                    </h3>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-full"></div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
          
          {/* Testimonial or Stat */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100/50">
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl font-medium text-gray-800 mb-4">
                "Edizo transformed our digital presence with their exceptional services and attention to detail."
              </blockquote>
              <cite className="text-gray-600 not-italic">— Happy Client</cite>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-900 via-purple-900 to-red-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Transform Your Business?</span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Let's create something amazing together. Our team is ready to bring your vision to life with our premium digital services.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-gray-900 font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:from-yellow-400 hover:to-orange-400 transition-all duration-300 min-h-12"
              >
                Start Your Project Today
                <ArrowRight size={24} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default Services;
