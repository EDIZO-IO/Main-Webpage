import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Code,
  TrendingUp,
  PenTool,
  Check,
  MessageSquare,
  Award,
  ArrowRight,
  ChevronLeft,
  Smartphone // Import Smartphone icon for App Design
} from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';
import Button from '../components/common/Button';

// Import local service images
import webDevImg from '../assets/services/banner/website design ban.webp';
import uiuxImg from '../assets/services/banner/graphic design ban.webp';
import videoEditingImg from '../assets/services/banner/video editing ban.webp';
import graphicDesignImg from '../assets/services/banner/graphic design ban.webp';
import appDesignImg from '../assets/services/banner/app design ban.webp'; // Assuming this image exists for App Design

// Define the common "Why Choose Edizo?" content for services
const whyChooseEdizoServiceContent = [
  "Creative, Custom-First Approach",
  "On-Time Project Delivery",
  "Affordable & Transparent Pricing",
  "Friendly Support & Professional Team",
];

// Service Data
const servicesData = {
  'video-editing': {
    title: 'Video Editing',
    subtitle: 'Professional video production and editing services',
    description:
      'We turn raw footage into polished, engaging content. Whether it’s for social media, corporate events, or promotions, our editing enhances visual appeal and storytelling.',
    image: videoEditingImg,
    icon: TrendingUp, // Changed icon to TrendingUp as Video was already used in Services.tsx for the icon
    features: [ // Renamed from 'servicesInclude' to 'features' for consistency with existing structure
      'Promotional Videos & Intros',
      'Reels, Shorts & YouTube Edits',
      'Event Highlights & Corporate Videos',
      'Motion Graphics & Animations',
    ],
    whyChooseEdizo: whyChooseEdizoServiceContent, // Added whyChooseEdizo
    technologies: ['Adobe Premiere', 'After Effects', 'Final Cut Pro', 'DaVinci Resolve'],
    process: [
      'Footage Review',
      'Editing',
      'Color Grading',
      'Sound Mixing',
      'Final Review',
      'Delivery'
    ]
  },
  'graphic-design': {
    title: 'Graphic Design',
    subtitle: 'Creative visual content for branding and marketing',
    description:
      'Great design builds strong brands. Our creative team brings ideas to life with visuals that are both impactful and purpose-driven across digital and print media.',
    image: graphicDesignImg,
    icon: PenTool, // Changed icon to PenTool as ImageIcon was already used in Services.tsx for the icon
    features: [ // Renamed from 'servicesInclude' to 'features'
      'Logo Design & Brand Identity',
      'Posters, Brochures & Business Cards',
      'Certificates, Banners & Flyers',
      'Social Media Post & Ad Designs',
    ],
    whyChooseEdizo: whyChooseEdizoServiceContent, // Added whyChooseEdizo
    technologies: ['Photoshop', 'Illustrator', 'InDesign', 'Canva'],
    process: [
      'Briefing',
      'Concept Development',
      'Design Creation',
      'Revisions',
      'Finalization'
    ]
  },
  'web-development': {
    title: 'Web Development',
    subtitle: 'Custom web solutions that drive business growth',
    description:
      'We build responsive and high-performance websites tailored to your business needs — from personal portfolios to full-scale e-commerce platforms.',
    image: webDevImg,
    icon: Code,
    features: [ // Renamed from 'servicesInclude' to 'features'
      'Business & Portfolio Websites',
      'E-Commerce & Dynamic Sites',
      'Frontend & Backend Development',
      'SEO-Friendly, Mobile-Optimized Design',
    ],
    whyChooseEdizo: whyChooseEdizoServiceContent, // Added whyChooseEdizo
    technologies: ['React', 'Vue.js', 'Node.js', 'PHP', 'WordPress', 'MongoDB', 'MySQL'],
    process: [
      'Requirement Analysis',
      'UI/UX Design',
      'Development',
      'Quality Assurance',
      'Deployment',
      'Maintenance'
    ]
  },
  'app-development': {
    title: 'App Development',
    subtitle: 'Crafting intuitive and engaging mobile experiences',
    description:
      'We create sleek, user-friendly mobile apps that combine function with form. Our development process ensures smooth performance across Android and iOS platforms.',
    image: appDesignImg,
    icon: Smartphone,
    features: [ // Renamed from 'servicesInclude' to 'features'
      'Android & iOS App Development',
      'UI/UX Design for Apps',
      'Service & Business-Based Applications',
      'Development using React Native, Flutter & Native Tools',
    ],
    whyChooseEdizo: whyChooseEdizoServiceContent, // Added whyChooseEdizo
    technologies: ['Figma', 'Adobe XD', 'Sketch', 'ProtoPie', 'Principle'],
    process: [
      'Discovery & Strategy',
      'UX Research & Wireframing',
      'UI Design & Prototyping',
      'User Testing & Iteration',
      'Handoff to Development',
      'Post-Launch Support'
    ]
  },
  'ui-ux': { // Added UI/UX Design service
    title: 'UI/UX Design',
    subtitle: 'User-centered design solutions for exceptional experiences',
    description:
      'User-centered design solutions that create intuitive, engaging interfaces for digital products.',
    image: uiuxImg,
    icon: PenTool,
    features: [
      'User Research',
      'Information Architecture',
      'Wireframing',
      'Visual Design',
      'Usability Testing',
      'Interaction Design',
      'Responsive Design',
      'Design Systems',
    ],
    whyChooseEdizo: whyChooseEdizoServiceContent,
    technologies: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Zeplin'],
    process: [
      'User Research',
      'Wireframing',
      'Prototyping',
      'UI Design',
      'User Testing',
      'Implementation'
    ]
  },
};

const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    // Check if the ID exists in servicesData
    if (!(id && id in servicesData)) {
      setIsValid(false);
      // Redirect to services page if ID is invalid
      navigate('/services');
    }
  }, [id, navigate]);

  // Type assertion to ensure 'serviceId' is a valid key
  const serviceId = id as keyof typeof servicesData;
  const service = servicesData[serviceId];

  // If service is null (due to invalid ID), return early with a loading state or error message
  if (!service && isValid) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Loading Service Details...</h2>
          <p className="text-lg text-gray-600 mb-6">Please wait while we fetch the service information.</p>
        </div>
      </section>
    );
  }

  // If isValid is false (meaning ID was invalid and navigate was called), show not found message
  if (!isValid) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Service Not Found</h2>
          <p className="text-lg text-gray-600 mb-6">
            The service you're looking for doesn't exist or may have been moved.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <ChevronLeft className="mr-2" size={18} />
            Back to Services
          </Link>
        </div>
      </section>
    );
  }

  // Ensure Icon is defined before using it
  const Icon = service.icon;

  useEffect(() => {
    document.title = `${service.title} | Our Services`;
  }, [service.title]);

  return (
    <>
      <PageHeader
        title={service.title}
        subtitle={service.subtitle}
        backgroundImage={service.image}
        className="bg-gradient-to-r from-blue-800 to-purple-900"
      // Add onError to PageHeader's background image if it uses an <img> tag internally
      // or ensure PageHeader component handles image loading gracefully.
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3">
              <AnimatedSection>
                <div className="mb-8">
                  <Link
                    to="/services"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
                  >
                    <ChevronLeft className="mr-1" size={18} />
                    Back to Services
                  </Link>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Overview</h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mb-12">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">Services Include</h3> {/* Changed from Key Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-start bg-gray-50 p-4 rounded-lg">
                        <Check className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Why Choose Edizo? Section - NEW */}
                <div className="mb-12">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">💡 Why Choose Edizo?</h3>
                  <ul className="space-y-3">
                    {service.whyChooseEdizo.map((item, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <Check className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-12">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">Our Process</h3>
                  <div className="relative">
                    <div className="absolute left-4 top-0 h-full w-0.5 bg-gray-200" />
                    <div className="space-y-8">
                      {service.process.map((step, index) => (
                        <div key={index} className="relative pl-12">
                          <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                            {index + 1}
                          </div>
                          <h4 className="text-xl font-medium text-gray-900 mb-2">{step}</h4>
                          <p className="text-gray-600">
                            We follow industry best practices to ensure quality at every stage of the {step.toLowerCase()} process.
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 border-b pb-2">Technologies We Use</h3>
                  <div className="flex flex-wrap gap-3">
                    {service.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>

            <div className="lg:w-1/3">
              <AnimatedSection delay={0.2}>
                <div className="bg-gray-50 rounded-xl p-6 sticky top-6 shadow-sm border border-gray-200">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 rounded-lg bg-blue-600 flex items-center justify-center mr-4">
                      <Icon className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                      <p className="text-blue-600">{service.subtitle}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                      <MessageSquare className="mr-2 text-blue-600" size={20} />
                      Get Started
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Ready to discuss your {service.title.toLowerCase()} project?
                    </p>
                    <Button
                      to="/contact"
                      variant="primary"
                      className="w-full justify-center"
                    >
                      Request a Consultation
                    </Button>
                  </div>

                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                      <Award className="mr-2 text-blue-600" size={20} />
                      Related Services
                    </h4>
                    <ul className="space-y-3">
                      {Object.entries(servicesData)
                        .filter(([key]) => key !== serviceId)
                        .slice(0, 4) // Ensure only up to 4 related services are shown
                        .map(([key, related]) => (
                          <li key={key}>
                            <Link
                              to={`/services/${key}`}
                              className="flex items-center text-gray-700 hover:text-blue-600 transition"
                            >
                              <ArrowRight className="mr-2 text-blue-600" size={16} />
                              {related.title}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="py-16 bg-gradient-to-r from-blue-700 to-blue-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Start Your Project Today</h2>
              <p className="text-xl opacity-90 mb-8">
                Let's discuss how our {service.title.toLowerCase()} services can help you achieve your business goals.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  to="/contact"
                  variant="secondary"
                  className="bg-white text-blue-700 hover:bg-gray-100"
                >
                  Get a Free Quote
                </Button>
                <Button
                  to="/portfolio"
                  variant="outline-white"
                >
                  View Our Work
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section> */}
    </>
  );
};

export default ServiceDetails;
