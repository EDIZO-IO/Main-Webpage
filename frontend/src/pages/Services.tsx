// src/pages/Services.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

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
  <img src={src} alt={alt} loading="lazy" className={className} onError={(e) => {
    e.target.src = `https://placehold.co/600x400/DEE2E6/495057?text=${encodeURIComponent(alt)}`;
  }} />
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
    <span className="relative font-medium text-lg md:text-xl">
      {displayedText}
      <span className="inline-block w-1 h-6 ml-1 bg-white align-middle animate-pulse" />
    </span>
  );
};

// Animated Section Wrapper
const AnimatedSection = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

const Services = () => {
  return (
    <>
      {/* Hero Section */}
      <PageHeader
        title={<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Our Services</span>}
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
      />

      {/* What We Offer */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16 max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                What We Offer
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                High-quality services designed to elevate your digital presence and drive business growth.
              </p>
            </div>
          </AnimatedSection>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {services.map((service, index) => (
              <AnimatedSection key={service.id} delay={0.1 * index}>
                <motion.div
                  className="group rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-gray-200 bg-white hover:-translate-y-3"
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <LazyImage
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                      {service.description}
                    </p>
                    <Link
                      to={`/services/${service.id}`}
                      className="inline-flex items-center font-semibold text-red-600 hover:text-red-700 group/link"
                    >
                      Learn more
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-16">
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-full shadow-lg hover:from-red-600 hover:to-orange-600 hover:scale-105 transition-all duration-300"
            >
              Need a Custom Solution? Get Free Consultation
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Edizo */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
              Why Choose Edizo?
            </h2>
            <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              We don’t just deliver services — we build partnerships that grow your business.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseEdizoServiceContent.map((item, i) => (
              <AnimatedSection key={i} delay={0.1 + i * 0.1}>
                <div className="flex items-start space-x-3 p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4" />
                  </div>
                  <p className="text-gray-800 font-medium leading-tail">{item}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;