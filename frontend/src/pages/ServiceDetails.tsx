// src/pages/ServiceDetails.tsx
import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Code,
  TrendingUp,
  PenTool,
  Check,
  MessageSquare,
  Award,
  ArrowRight,
  ChevronLeft,
  Smartphone,
  Star,
} from 'lucide-react';

import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';
import Button from '../components/common/Button';

// Import images
import webDevImg from '../assets/services/banner/website design ban.webp';
import uiuxImg from '../assets/services/banner/graphic design ban.webp';
import videoEditingImg from '../assets/services/banner/video editing ban.webp';
import graphicDesignImg from '../assets/services/banner/graphic design ban.webp';
import appDesignImg from '../assets/services/banner/app design ban.webp';

const fallbackImage = 'https://placehold.co/1200x400/DEE2E6/495057?text=Service+Unavailable';

// Shared content
const whyChooseEdizoServiceContent = [
  'Creative, Custom-First Approach',
  'On-Time Project Delivery',
  'Affordable & Transparent Pricing',
  'Friendly Support & Professional Team',
];

// Define TypeScript interface
interface Service {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  features: string[];
  whyChooseEdizo: string[];
  technologies: string[];
  process: string[];
}

// Service Data
const servicesData: Record<string, Service> = {
  'video-editing': {
    title: 'Video Editing',
    subtitle: 'Professional video production and editing services',
    description:
      'We turn raw footage into polished, engaging content. Whether it’s for social media, corporate events, or promotions, our editing enhances visual appeal and storytelling.',
    image: videoEditingImg,
    icon: TrendingUp,
    features: [
      'Promotional Videos & Intros',
      'Reels, Shorts & YouTube Edits',
      'Event Highlights & Corporate Videos',
      'Motion Graphics & Animations',
    ],
    whyChooseEdizo: whyChooseEdizoServiceContent,
    technologies: ['Adobe Premiere', 'After Effects', 'Final Cut Pro', 'DaVinci Resolve'],
    process: ['Footage Review', 'Editing', 'Color Grading', 'Sound Mixing', 'Final Review', 'Delivery'],
  },
  'graphic-design': {
    title: 'Graphic Design',
    subtitle: 'Creative visual content for branding and marketing',
    description:
      'Great design builds strong brands. Our creative team brings ideas to life with visuals that are both impactful and purpose-driven across digital and print media.',
    image: graphicDesignImg,
    icon: PenTool,
    features: [
      'Logo Design & Brand Identity',
      'Posters, Brochures & Business Cards',
      'Certificates, Banners & Flyers',
      'Social Media Post & Ad Designs',
    ],
    whyChooseEdizo: whyChooseEdizoServiceContent,
    technologies: ['Photoshop', 'Illustrator', 'InDesign', 'Canva'],
    process: ['Briefing', 'Concept Development', 'Design Creation', 'Revisions', 'Finalization'],
  },
  'web-development': {
    title: 'Web Development',
    subtitle: 'Custom web solutions that drive business growth',
    description:
      'We build responsive and high-performance websites tailored to your business needs — from personal portfolios to full-scale e-commerce platforms.',
    image: webDevImg,
    icon: Code,
    features: [
      'Business & Portfolio Websites',
      'E-Commerce & Dynamic Sites',
      'Frontend & Backend Development',
      'SEO-Friendly, Mobile-Optimized Design',
    ],
    whyChooseEdizo: whyChooseEdizoServiceContent,
    technologies: ['React', 'Vue.js', 'Node.js', 'PHP', 'WordPress', 'MongoDB', 'MySQL'],
    process: [
      'Requirement Analysis',
      'UI/UX Design',
      'Development',
      'Quality Assurance',
      'Deployment',
      'Maintenance',
    ],
  },
  'app-development': {
    title: 'App Development',
    subtitle: 'Crafting intuitive and engaging mobile experiences',
    description:
      'We create sleek, user-friendly mobile apps that combine function with form. Our development process ensures smooth performance across Android and iOS platforms.',
    image: appDesignImg,
    icon: Smartphone,
    features: [
      'Android & iOS App Development',
      'UI/UX Design for Apps',
      'Service & Business-Based Applications',
      'Development using React Native, Flutter & Native Tools',
    ],
    whyChooseEdizo: whyChooseEdizoServiceContent,
    technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
    process: [
      'Discovery & Strategy',
      'UI/UX Design',
      'Development',
      'Testing',
      'Deployment',
      'Post-Launch Support',
    ],
  },
  'ui-ux': {
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
      'Implementation',
    ],
  },
};

const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const service = id ? servicesData[id] : null;

  // Generate related services
  const relatedServices = useMemo(() => {
    if (!id) return [];
    return Object.entries(servicesData)
      .filter(([key]) => key !== id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  }, [id]);

  // Set page title
  useEffect(() => {
    if (service) {
      document.title = `${service.title} | Edizo Digital Agency`;
    }
  }, [service]);

  if (!id || !service) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Service Not Found</h2>
          <p className="text-lg text-gray-600 mb-6">
            The service you're looking for doesn't exist.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
          >
            <ChevronLeft className="mr-2" size={18} />
            Back to Services
          </Link>
        </div>
      </section>
    );
  }

  const Icon = service.icon;

  return (
    <>
      <PageHeader
        title={service.title}
        subtitle={service.subtitle}
        backgroundImage={service.image || fallbackImage}
        className="bg-gradient-to-r from-gray-900 to-blue-900"
      />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content */}
            <div className="lg:w-2/3 space-y-12">
              <AnimatedSection>
                <Link
                  to="/services"
                  className="inline-flex items-center text-red-600 hover:text-red-700 mb-6 transition-colors"
                >
                  <ChevronLeft size={18} className="mr-1" />
                  <span className="font-medium">Back to Services</span>
                </Link>

                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Overview</h2>
                  <p className="text-lg text-gray-600 leading-relaxed">{service.description}</p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Check className="text-green-500 mr-2" size={24} />
                    What We Offer
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-100"
                      >
                        <Check className="text-green-500 mt-1 mr-3 flex-shrink-0" size={18} />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Star className="text-yellow-500 mr-2" size={24} />
                    Why Choose Edizo?
                  </h3>
                  <ul className="space-y-3">
                    {service.whyChooseEdizo.map((item, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <Check className="text-green-500 mr-2 mt-1 flex-shrink-0" size={18} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <TrendingUp className="text-blue-600 mr-2" size={24} />
                    Our Process
                  </h3>
                  <div className="relative pl-12">
                    <div className="absolute left-6 top-0 h-full w-0.5 bg-blue-300" />
                    <div className="space-y-8">
                      {service.process.map((step, index) => (
                        <div key={index} className="relative">
                          <div className="absolute left-4 w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-sm z-10">
                            {index + 1}
                          </div>
                          <div className="ml-16 bg-gray-50 p-5 rounded-xl">
                            <h4 className="text-xl font-semibold text-gray-900">{step}</h4>
                            <p className="text-gray-600 mt-1">Step {index + 1} of your journey with us.</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Code className="text-blue-600 mr-2" size={24} />
                    Technologies We Use
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {service.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-blue-50 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              <AnimatedSection delay={0.2}>
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 sticky top-6">
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mr-4">
                      <Icon className="text-white" size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                      <p className="text-gray-600 text-sm">{service.subtitle}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-3">
                      <MessageSquare className="mr-2 text-red-600" size={20} />
                      Let’s Talk
                    </h4>
                    <p className="text-gray-600 mb-4 text-sm">
                      Ready to bring your {service.title.toLowerCase()} vision to life?
                    </p>
                    <Button
                      to="/contact"
                      variant="primary"
                      size="lg"
                      className="w-full"
                    >
                      Get Free Consultation
                    </Button>
                  </div>

                  <div>
                    <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                      <Award className="mr-2 text-red-600" size={20} />
                      Related Services
                    </h4>
                    <ul className="space-y-2">
                      {relatedServices.map(([key, rel]) => (
                        <li key={key}>
                          <Link
                            to={`/services/${key}`}
                            className="flex items-center text-gray-700 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-all"
                          >
                            <ArrowRight className="mr-2 opacity-0 group-hover:opacity-100 text-red-600" size={16} />
                            <span>{rel.title}</span>
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
    </>
  );
};

export default ServiceDetails;