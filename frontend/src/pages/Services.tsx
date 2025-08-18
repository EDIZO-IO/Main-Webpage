// src/pages/Services.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PenTool,
  Video,
  ImageIcon,
  Code,
  ArrowRight,
  Smartphone,
} from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';
import headerBackground from '../assets/background image/service.png';

// Import local service images
import webDevImg from '../assets/services/website design.webp';
import uiuxImg from '../assets/services/uiux.webp';
import videoEditingImg from '../assets/services/video editing.webp';
import graphicDesignImg from '../assets/services/graphic design.webp';
import appDesignImg from '../assets/services/app design.webp';

// Fallback placeholder generator
const getFallbackImage = (title) => {
  return `https://placehold.co/600x400/DEE2E6/495057?text=${encodeURIComponent(title)}`;
};

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
    icon: Video,
    image: videoEditingImg,
    primaryColor: 'bg-indigo-600',
    secondaryColor: 'text-indigo-600',
    gradient: 'bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100',
    whyChooseEdizo: whyChooseEdizoServiceContent,
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
    icon: ImageIcon,
    image: graphicDesignImg,
    primaryColor: 'bg-pink-600',
    secondaryColor: 'text-pink-600',
    gradient: 'bg-gradient-to-br from-pink-50 via-purple-50 to-pink-100',
    whyChooseEdizo: whyChooseEdizoServiceContent,
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
    icon: Code,
    image: webDevImg,
    primaryColor: 'bg-blue-600',
    secondaryColor: 'text-blue-600',
    gradient: 'bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100',
    whyChooseEdizo: whyChooseEdizoServiceContent,
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
    icon: Smartphone,
    image: appDesignImg,
    primaryColor: 'bg-green-600',
    secondaryColor: 'text-green-600',
    gradient: 'bg-gradient-to-br from-green-50 via-lime-50 to-green-100',
    whyChooseEdizo: whyChooseEdizoServiceContent,
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
    icon: PenTool,
    image: uiuxImg,
    primaryColor: 'bg-red-600',
    secondaryColor: 'text-red-600',
    gradient: 'bg-gradient-to-br from-red-50 via-orange-50 to-red-100',
    whyChooseEdizo: whyChooseEdizoServiceContent,
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
    <span className="relative font-medium">
      {displayedText}
      <span className="inline-block w-1 h-6 ml-1 bg-white align-middle animate-pulse" />
    </span>
  );
};

const Services = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
      {/* Hero Section */}
      <PageHeader
        title={<span className="text-red-500">Our Services</span>}
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-red-600 bg-clip-text text-transparent">
                What We Offer
              </h2>
              <p className="text-lg text-gray-600">
                High-quality services designed to elevate your digital presence and drive business growth.
              </p>
            </div>
          </AnimatedSection>

          {/* Services Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.id}
                  variants={cardVariants}
                  className={`group rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 ${service.gradient} hover:-translate-y-2`}
                >
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = getFallbackImage(service.title);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                      <div className={`${service.primaryColor} w-10 h-10 rounded-lg flex items-center justify-center`}>
                        <Icon className="text-white" size={20} />
                      </div>
                      <h3 className="text-white font-bold text-lg">{service.title}</h3>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.description}</p>
                    <Link
                      to={`/services/${service.id}`}
                      className="inline-flex items-center font-semibold text-red-600 hover:text-red-700 group/link"
                    >
                      Learn more
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-semibold rounded-full shadow-lg hover:bg-red-700 hover:scale-105 transition-all"
            >
              Need a Custom Solution? Get Free Consultation
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Edizo Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">Why Choose Edizo?</h2>
            <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              We don’t just deliver services — we build partnerships that grow your business.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseEdizoServiceContent.map((item, i) => (
              <AnimatedSection key={i} delay={0.1 + i * 0.1}>
                <div className="text-center p-6">
                  <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{item}</h3>
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

// Add Star icon import at the top if not already imported
import { Star } from 'lucide-react';