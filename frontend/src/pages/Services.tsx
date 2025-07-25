import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PenTool,
  Video,
  Image as ImageIcon,
  Code,
  ArrowRight,
  Smartphone // Import Smartphone icon for App Design
} from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';
import headerBackground from '../assets/background image/service.png';

// Import local service images
import webDevImg from '../assets/services/website design.webp'; // Assuming this image exists
import uiuxImg from '../assets/services/uiux.webp'; // Assuming this image exists
import videoEditingImg from '../assets/services/video editing.webp'; // Assuming this image exists
import graphicDesignImg from '../assets/services/graphic design.webp'; // Assuming this image exists
import appDesignImg from '../assets/services/app design.webp'; // Assuming this image exists for App Design

// Define the common "Why Choose Edizo?" content for services
const whyChooseEdizoServiceContent = [
  "Creative, Custom-First Approach",
  "On-Time Project Delivery",
  "Affordable & Transparent Pricing",
  "Friendly Support & Professional Team",
];

// Service data - Limited to 4 services as requested
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
    whyChooseEdizo: whyChooseEdizoServiceContent,
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    description: 'User-centered design solutions that create intuitive, engaging interfaces for digital products.',
    servicesInclude: [ // Changed from features to servicesInclude for consistency
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
    whyChooseEdizo: whyChooseEdizoServiceContent,
  },
];

const Services: React.FC = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

  return (
    <>

      <PageHeader
        title={<span className="text-red-500">Our Services</span>}
        subtitle={<span className="text-white">Comprehensive digital solutions tailored to your business needs</span>}
        backgroundImage={headerBackground}
      />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                High-quality services designed to elevate your digital presence and drive business growth.
              </p>
            </div>
          </AnimatedSection>

          {/* Adjusted grid for 4 items, ensuring responsiveness */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"> {/* Adjusted grid to handle 5 items gracefully */}
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <motion.div
                  key={service.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/600x400/CCCCCC/333333?text=${service.title.replace(/\s/g, '+')}`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-70" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className={`${service.primaryColor} w-12 h-12 rounded-lg flex items-center justify-center mb-2`}>
                        <Icon className="text-white" size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-white">{service.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <Link
                      to={`/services/${service.id}`}
                      className={`inline-flex items-center ${service.secondaryColor} font-medium hover:underline`}
                    >
                      Learn more <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Need a Custom Solution?</h2>
              <p className="text-xl mb-8 opacity-90">
                We specialize in creating tailored solutions that perfectly fit your business requirements.
              </p>
              <Link
                to="/contact"
                className="inline-block bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-lg"
              >
                Get a Free Consultation
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section> */}
    </>
  );
};

export default Services;
