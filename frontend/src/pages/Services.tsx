import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import headerBackground from '../assets/background image/service.png';

// Import local service images
import webDevImg from '../assets/services/website design.webp';
import uiuxImg from '../assets/services/uiux.webp';
import videoEditingImg from '../assets/services/video editing.webp';
import graphicDesignImg from '../assets/services/graphic design.webp';
import appDesignImg from '../assets/services/app design.webp';

// LazyImage Component
const LazyImage = ({ src, alt, className = "" }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    className={className}
    onError={(e) => {
      e.target.src = `https://placehold.co/600x400/DEE2E6/495057?text=${encodeURIComponent(alt)}`;
    }}
  />
);

// Why Choose Edizo - Common for all services
const whyChooseEdizoServiceContent = [
  "Creative, Custom-First Approach",
  "On-Time Project Delivery",
  "Affordable & Transparent Pricing",
  "Friendly Support & Professional Team",
];

// Service data
const services = [
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
  },
];

// Typing Animation for Subtitle
const AnimatedTypingSubtitle = ({ phrases }) => {
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
const AnimatedSection = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay, type: 'spring', stiffness: 100, damping: 15 }}
  >
    {children}
  </motion.div>
);

const Services = () => {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 100]);

  return (
    <>
      {/* Hero Section */}
      <PageHeader
        title={
          <motion.span
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500"
          >
            Our Services
          </motion.span>
        }
        subtitle={
          <AnimatedTypingSubtitle
            phrases={[
              'Comprehensive digital solutions tailored to your business needs',
              'Creative and custom-first approach',
              'Friendly support and professional team',
            ]}
          />
        }
        backgroundImage={headerBackground}
        backgroundStyle={{ y: backgroundY }}
      />

      {/* What We Offer */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What We Offer
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                High-quality services designed to elevate your digital presence and drive business growth.
              </p>
            </div>
          </AnimatedSection>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <AnimatedSection key={service.id} delay={0.1 * index}>
                <motion.div
                  className="group rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  {/* Image */}
                  <div className="relative h-36 md:h-40 overflow-hidden">
                    <LazyImage
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${service.accent} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                      {service.description}
                    </p>
                    <Link
                      to={`/services/${service.id}`}
                      className={`inline-flex items-center mt-4 text-sm font-medium ${service.secondaryColor} hover:underline`}
                    >
                      Learn more
                      <ArrowRight className="ml-1.5 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-14">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold text-base rounded-full shadow-md hover:from-red-600 hover:to-orange-600 hover:shadow-lg transition-all duration-300"
              >
                Need a Custom Solution? Get Free Consultation
                <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Edizo */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
              Why Choose Edizo?
            </h2>
            <p className="text-lg text-center text-gray-600 mb-10 max-w-2xl mx-auto">
              We don't just deliver services — we build partnerships that grow your business.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseEdizoServiceContent.map((item, i) => (
              <AnimatedSection key={i} delay={0.1 + i * 0.1}>
                <motion.div
                  className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group"
                  whileHover={{ y: -2 }}
                >
                  <motion.div
                    className="flex-shrink-0 w-7 h-7 bg-red-100 text-red-600 rounded-full flex items-center justify-center mt-0.5"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </motion.div>
                  <p className="text-gray-700 text-sm font-medium leading-relaxed group-hover:text-gray-900 transition-colors">
                    {item}
                  </p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;