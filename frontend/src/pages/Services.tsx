// src/pages/Services.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Code,
  Palette,
  Smartphone,
  Video,
  Zap,
  Globe,
  Shield,
  BarChart2,
  Search,
  Users,
  Eye,
  RefreshCw,
  Trello,
  Headphones,
  Server,
  Film,
  Layers,
  Brush,
  Monitor,
  FileText,
  TrendingUp,
  Target,
  Share2,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';

import webDevelopmentImg from '../assets/services/website design.webp';
import uiuxImg from '../assets/services/uiux.webp';
import appDesignImg from '../assets/services/app design.webp';
import videoEditingImg from '../assets/services/video editing.webp';
import graphicDesignImg from '../assets/services/graphic design.webp';
import apiDevelopmentImg from '../assets/services/api-development.webp';
import seoImg from '../assets/services/seo.webp';
import digitalMarketingImg from '../assets/services/digital-marketing.webp';

interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  image: string;
  icon: React.ReactNode;
  features: string[];
  technologies: string[];
  benefits: string[];
  process: string[];
  whyChoose: { title: string; icon: React.ReactNode }[];
  relatedServices: string[];
  ctaText: string;
}

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className = '' }) => (
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

export const services: Service[] = [
  {
    id: 'web-development',
    title: 'Web Development',
    subtitle: 'Scalable & High-Performance Websites',
    description: 'Build blazing-fast, responsive websites with React, Next.js, and modern frameworks.',
    longDescription: 'Our web development services are designed to create fast, scalable, and secure websites that deliver exceptional user experiences. Whether you need a simple landing page or a complex web application, we use the latest technologies like React, Next.js, Node.js, and more to bring your vision to life. Our process ensures your site is optimized for performance, SEO, and accessibility from day one.',
    image: webDevelopmentImg,
    icon: <Globe className="text-blue-500" size={24} />,
    features: [
      'Responsive Design',
      'SEO Optimization',
      'Performance Tuning',
      'E-commerce Integration',
      'API Development',
      'CMS Integration'
    ],
    technologies: ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Tailwind CSS'],
    benefits: [
      'Faster load times improve SEO and user engagement',
      'Scalable architecture for future growth',
      'Cross-browser compatibility for wider reach',
      'Enhanced security to protect your data'
    ],
    process: [
      'Project Discovery & Planning',
      'UI/UX Design & Prototyping',
      'Frontend & Backend Development',
      'Testing & Quality Assurance',
      'Deployment & Launch',
      'Ongoing Support & Maintenance'
    ],
    whyChoose: [
      { title: 'Performance-Driven', icon: <Zap className="text-yellow-500" size={20} /> },
      { title: 'Modern Tech Stack', icon: <Code className="text-blue-500" size={20} /> },
      { title: 'SEO & Accessibility', icon: <Search className="text-green-500" size={20} /> },
      { title: 'Scalable Solutions', icon: <BarChart2 className="text-purple-500" size={20} /> }
    ],
    relatedServices: ['ui-ux', 'app-development', 'seo'],
    ctaText: 'Build Your Dream Website'
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    subtitle: 'User-Centered Digital Experiences',
    description: 'Design interfaces that are beautiful, intuitive, and drive conversions.',
    longDescription: 'Great design is the cornerstone of successful digital products. Our UI/UX design team focuses on creating user-centered experiences that are not only visually stunning but also highly functional and easy to use. We conduct thorough user research, create detailed personas, and design intuitive interfaces that guide users effortlessly towards their goals, ultimately boosting engagement and conversions.',
    image: uiuxImg,
    icon: <Palette className="text-purple-500" size={24} />,
    features: [
      'User Research & Personas',
      'Wireframing & Prototyping',
      'Visual Design (UI)',
      'Interaction Design',
      'Usability Testing',
      'Design Systems'
    ],
    technologies: ['Figma', 'Sketch', 'Adobe XD', 'InVision', 'Principle', 'Maze'],
    benefits: [
      'Increased user satisfaction and engagement',
      'Higher conversion rates and ROI',
      'Reduced development time and costs',
      'Stronger brand identity and consistency'
    ],
    process: [
      'Research & Discovery',
      'User Personas & Journey Maps',
      'Information Architecture',
      'Wireframing',
      'Visual Design',
      'Prototyping & Testing'
    ],
    whyChoose: [
      { title: 'Human-Centered', icon: <Users className="text-teal-500" size={20} /> },
      { title: 'Data-Driven Insights', icon: <BarChart2 className="text-blue-500" size={20} /> },
      { title: 'Pixel-Perfect Execution', icon: <Eye className="text-purple-500" size={20} /> },
      { title: 'Iterative Process', icon: <RefreshCw className="text-green-500" size={20} /> }
    ],
    relatedServices: ['web-development', 'app-development'],
    ctaText: 'Design Better Experiences'
  },
  {
    id: 'app-development',
    title: 'App Development',
    subtitle: 'Cross-Platform Mobile Solutions',
    description: 'Build powerful iOS & Android apps with React Native & Flutter.',
    longDescription: 'Reach your audience wherever they are with our custom mobile app development services. We specialize in building high-performance, feature-rich applications for both iOS and Android platforms using cutting-edge technologies like React Native and Flutter. Our apps are designed to be intuitive, engaging, and perfectly aligned with your business objectives, ensuring a seamless experience for your users.',
    image: appDesignImg,
    icon: <Smartphone className="text-green-500" size={24} />,
    features: [
      'Cross-Platform Development',
      'Native Performance',
      'Push Notifications',
      'Offline Functionality',
      'Third-Party Integrations',
      'App Store Optimization'
    ],
    technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'Redux'],
    benefits: [
      'Wider audience reach with one codebase',
      'Faster time-to-market',
      'Cost-effective development',
      'Consistent user experience across devices'
    ],
    process: [
      'Idea Validation & Strategy',
      'UI/UX Design for Mobile',
      'App Architecture & Planning',
      'Development (iOS & Android)',
      'Testing & QA',
      'Deployment & Marketing'
    ],
    whyChoose: [
      { title: 'Native-Like Performance', icon: <Zap className="text-yellow-500" size={20} /> },
      { title: 'Agile Development', icon: <Trello className="text-blue-500" size={20} /> },
      { title: 'Scalable Architecture', icon: <Server className="text-gray-500" size={20} /> },
      { title: 'Post-Launch Support', icon: <Headphones className="text-green-500" size={20} /> }
    ],
    relatedServices: ['web-development', 'ui-ux'],
    ctaText: 'Launch Your App Idea'
  },
  {
    id: 'video-editing',
    title: 'Video Editing',
    subtitle: 'Engaging Visual Storytelling',
    description: 'Transform raw footage into compelling videos for marketing & branding.',
    longDescription: 'In today\'s digital world, video content is king. Our video editing services help you create captivating stories that resonate with your audience. From promotional videos and social media content to corporate presentations and event highlights, we use professional editing techniques and the latest software to produce high-quality videos that effectively communicate your message and enhance your brand.',
    image: videoEditingImg,
    icon: <Video className="text-red-500" size={24} />,
    features: [
      'Color Grading & Correction',
      'Motion Graphics & Animation',
      'Sound Design & Mixing',
      'Visual Effects',
      'Multi-Cam Editing',
      'Social Media Optimization'
    ],
    technologies: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Final Cut Pro', 'Blender'],
    benefits: [
      'Boost brand awareness and engagement',
      'Increase website traffic and conversions',
      'Enhance social media presence',
      'Create lasting impressions on clients'
    ],
    process: [
      'Project Brief & Creative Brief',
      'Footage Review & Organization',
      'Rough Cut & Feedback',
      'Fine Cut & Revisions',
      'Color Correction & Sound Mix',
      'Final Delivery & Formats'
    ],
    whyChoose: [
      { title: 'Creative Storytelling', icon: <Film className="text-red-500" size={20} /> },
      { title: 'Attention to Detail', icon: <Eye className="text-blue-500" size={20} /> },
      { title: 'Fast Turnaround', icon: <Zap className="text-yellow-500" size={20} /> },
      { title: 'Multiple Formats', icon: <Layers className="text-purple-500" size={20} /> }
    ],
    relatedServices: ['graphic-design', 'digital-marketing'],
    ctaText: 'Tell Your Story Visually'
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    subtitle: 'Visual Identity & Branding',
    description: 'Craft stunning visuals that elevate your brand and communicate effectively.',
    longDescription: 'First impressions matter, and great graphic design is crucial for making a lasting impact. Our graphic design services cover everything from logo creation and brand identity to marketing materials, social media graphics, and illustrations. We work closely with you to understand your brand\'s personality and values, translating them into powerful visual elements that capture attention and convey your message clearly.',
    image: graphicDesignImg,
    icon: <Palette className="text-pink-500" size={24} />,
    features: [
      'Logo & Brand Identity',
      'Marketing Collateral',
      'Social Media Graphics',
      'Packaging Design',
      'Illustrations & Icons',
      'Print & Digital Design'
    ],
    technologies: ['Adobe Photoshop', 'Illustrator', 'InDesign', 'Figma', 'Canva'],
    benefits: [
      'Stronger brand recognition',
      'Professional marketing materials',
      'Consistent visual identity',
      'Stand out from competitors'
    ],
    process: [
      'Design Brief & Research',
      'Concept Development & Mood Boards',
      'Initial Designs & Feedback',
      'Revisions & Refinements',
      'Final Design & Delivery',
      'Brand Guidelines (Optional)'
    ],
    whyChoose: [
      { title: 'Brand-Aligned Designs', icon: <Shield className="text-yellow-500" size={20} /> },
      { title: 'Creative Versatility', icon: <Brush className="text-pink-500" size={20} /> },
      { title: 'Quick Revisions', icon: <RefreshCw className="text-blue-500" size={20} /> },
      { title: 'Print & Digital Ready', icon: <Monitor className="text-gray-500" size={20} /> }
    ],
    relatedServices: ['video-editing', 'web-development', 'digital-marketing'],
    ctaText: 'Elevate Your Brand Visually'
  },
  {
    id: 'api-development',
    title: 'API Development',
    subtitle: 'Seamless Integration & Data Flow',
    description: 'Build robust, scalable APIs to connect your applications and services.',
    longDescription: 'In a connected world, APIs are the backbone of modern software. Our API development services focus on creating secure, efficient, and well-documented APIs that enable seamless communication between your applications, services, and third-party systems. Whether you need a RESTful API, GraphQL endpoint, or a custom integration, we ensure reliability, scalability, and ease of use for developers.',
    image: apiDevelopmentImg,
    icon: <Server className="text-gray-600" size={24} />,
    features: [
      'RESTful & GraphQL APIs',
      'Authentication & Authorization',
      'Rate Limiting & Throttling',
      'Comprehensive Documentation',
      'Testing & Monitoring',
      'Versioning & Maintenance'
    ],
    technologies: ['Node.js', 'Express', 'Python', 'Django REST Framework', 'PostgreSQL', 'MongoDB', 'Swagger/OpenAPI'],
    benefits: [
      'Enable faster application development',
      'Improve data sharing and integration',
      'Enhance system scalability and flexibility',
      'Provide a foundation for microservices'
    ],
    process: [
      'Requirements Gathering & Planning',
      'API Design & Specification',
      'Backend Development',
      'Security Implementation',
      'Testing & Documentation',
      'Deployment & Support'
    ],
    whyChoose: [
      { title: 'Well-Documented', icon: <FileText className="text-blue-500" size={20} /> },
      { title: 'Secure by Design', icon: <Shield className="text-gray-700" size={20} /> },
      { title: 'Highly Scalable', icon: <BarChart2 className="text-teal-500" size={20} /> },
      { title: 'Developer-Friendly', icon: <Code className="text-green-500" size={20} /> }
    ],
    relatedServices: ['web-development', 'app-development'],
    ctaText: 'Connect Your Systems'
  },
  {
    id: 'seo',
    title: 'SEO Optimization',
    subtitle: 'Dominate Search Engine Rankings',
    description: 'Drive organic traffic and grow your online presence with proven SEO strategies.',
    longDescription: 'Search Engine Optimization (SEO) is crucial for increasing your website\'s visibility on search engines like Google. Our comprehensive SEO services include technical optimization, content strategy, link building, and performance monitoring. We help you rank higher for relevant keywords, attract qualified visitors, and ultimately increase conversions and revenue.',
    image: seoImg,
    icon: <TrendingUp className="text-green-600" size={24} />,
    features: [
      'Technical SEO Audit',
      'Keyword Research & Strategy',
      'On-Page Optimization',
      'Content Creation & Optimization',
      'Link Building',
      'Local SEO',
      'Performance Monitoring & Reporting'
    ],
    technologies: ['Google Analytics', 'Google Search Console', 'SEMrush', 'Ahrefs', 'Moz', 'Yoast SEO'],
    benefits: [
      'Increased organic website traffic',
      'Higher search engine rankings',
      'Improved brand credibility',
      'Long-term, sustainable growth',
      'Better ROI compared to paid ads'
    ],
    process: [
      'Initial SEO Audit & Competitor Analysis',
      'Keyword Research & Strategy Development',
      'Technical & On-Page Optimization',
      'Content Creation & Link Building',
      'Performance Monitoring & Reporting',
      'Strategy Refinement & Ongoing Optimization'
    ],
    whyChoose: [
      { title: 'Proven Results', icon: <TrendingUp className="text-blue-500" size={20} /> },
      { title: 'White-Hat Techniques', icon: <Shield className="text-green-500" size={20} /> },
      { title: 'Keyword Focused', icon: <Target className="text-purple-500" size={20} /> },
      { title: 'Transparent Reporting', icon: <BarChart2 className="text-yellow-500" size={20} /> }
    ],
    relatedServices: ['web-development', 'content-writing', 'digital-marketing'],
    ctaText: 'Rank Higher on Google'
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    subtitle: 'Reach & Engage Your Audience',
    description: 'Comprehensive online marketing strategies to grow your brand and business.',
    longDescription: 'Our digital marketing services encompass a wide range of online channels to promote your business effectively. From Pay-Per-Click (PPC) advertising and Social Media Marketing to Email Campaigns and Content Marketing, we develop integrated strategies tailored to your goals. We help you reach your target audience, build brand awareness, drive traffic, and generate leads or sales.',
    image: digitalMarketingImg,
    icon: <Share2 className="text-blue-600" size={24} />,
    features: [
      'Search Engine Marketing (SEM/PPC)',
      'Social Media Marketing (SMM)',
      'Email Marketing Campaigns',
      'Content Marketing Strategy',
      'Influencer Marketing',
      'Marketing Automation',
      'Analytics & ROI Tracking'
    ],
    technologies: ['Google Ads', 'Meta Ads Manager', 'Mailchimp', 'HubSpot', 'Hootsuite', 'Google Analytics', 'Facebook Pixel'],
    benefits: [
      'Targeted reach to potential customers',
      'Increased brand awareness and engagement',
      'Measurable results and ROI',
      'Cost-effective marketing compared to traditional methods',
      'Flexibility to adjust campaigns in real-time'
    ],
    process: [
      'Marketing Strategy & Goal Definition',
      'Target Audience Research',
      'Channel Selection & Campaign Setup',
      'Content Creation & Ad Design',
      'Campaign Launch & Management',
      'Monitoring, Analysis & Optimization'
    ],
    whyChoose: [
      { title: 'Multi-Channel Approach', icon: <Share2 className="text-purple-500" size={20} /> },
      { title: 'Data-Driven Decisions', icon: <BarChart2 className="text-green-500" size={20} /> },
      { title: 'Audience Focused', icon: <Users className="text-blue-500" size={20} /> },
      { title: 'Measurable ROI', icon: <Target className="text-yellow-500" size={20} /> }
    ],
    relatedServices: ['seo', 'content-writing', 'graphic-design', 'video-editing'],
    ctaText: 'Boost Your Online Presence'
  }
];

interface ServiceCardProps {
  service: Service;
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, index }) => (
  <AnimatedSection delay={index * 0.1}>
    <motion.div
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl"
    >
      <div className="relative h-48 overflow-hidden">
        <LazyImage
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />
        <div className="absolute top-4 left-4">
          <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
            {service.icon}
          </div>
        </div>
        <div className="absolute bottom-4 left-4">
          <h3 className="text-xl font-bold text-white">{service.title}</h3>
          <p className="text-white/90 text-sm mt-1">{service.subtitle}</p>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>
        <Link
          to={`/services/${service.id}`}
          className="inline-flex items-center text-sm font-semibold text-red-600 hover:underline group/link mt-auto"
        >
          Explore Details
          <ArrowRight className="ml-1.5 w-4 h-4 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  </AnimatedSection>
);

const ServicesOverview = () => (
  <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatedSection>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Services</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We offer a comprehensive suite of digital solutions to help your business grow, connect, and succeed in the modern marketplace.
          </p>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <AnimatedSection key={service.id} delay={index * 0.1}>
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 flex items-start"
            >
              <div className="p-3 bg-red-100 rounded-lg mr-4">
                {service.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{service.subtitle}</p>
                <p className="text-gray-500 text-sm mt-2">{service.description}</p>
                <Link
                  to={`/services/${service.id}`}
                  className="mt-3 inline-flex items-center text-sm font-medium text-red-600 hover:underline"
                >
                  Learn More
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

const WhyChooseUsSummary = () => (
  <section className="py-16 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <AnimatedSection>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Edizo?</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We combine technical expertise with creative vision to deliver solutions that exceed expectations.
          </p>
        </div>
      </AnimatedSection>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { title: "Expert Team", description: "Skilled professionals with deep industry knowledge.", icon: <Users className="w-8 h-8 text-red-500" /> },
          { title: "Innovation", description: "Cutting-edge solutions tailored to your unique needs.", icon: <Zap className="w-8 h-8 text-red-500" /> },
          { title: "Quality Focus", description: "Rigorous testing and quality assurance at every step.", icon: <Shield className="w-8 h-8 text-red-500" /> },
          { title: "Client Partnership", description: "We work closely with you as a trusted partner.", icon: <TrendingUp className="w-8 h-8 text-red-500" /> }
        ].map((item, index) => (
          <AnimatedSection key={item.title} delay={index * 0.1}>
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gray-50 p-6 rounded-xl text-center border border-gray-100 hover:border-red-200 transition-colors duration-300"
            >
              <div className="flex justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </motion.div>
          </AnimatedSection>
        ))}
      </div>
    </div>
  </section>
);

const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Development', 'Design', 'API', 'Marketing'];

  const filteredServices = services.filter(service => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.features.some(f => f.toLowerCase().includes(searchTerm.toLowerCase())) ||
      service.technologies.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));

    let matchesCategory = selectedCategory === 'All';
    if (!matchesCategory) {
      const titleLower = service.title.toLowerCase();
      switch (selectedCategory) {
        case 'Development':
          matchesCategory = titleLower.includes('web') || titleLower.includes('app') || titleLower.includes('api');
          break;
        case 'Design':
          matchesCategory = titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux') || titleLower.includes('video');
          break;
        case 'API':
          matchesCategory = titleLower.includes('api');
          break;
        case 'Marketing':
          matchesCategory = titleLower.includes('seo') || titleLower.includes('marketing');
          break;
        default:
          matchesCategory = true;
      }
    }

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <PageHeader
        title="Our Services"
        subtitle="Comprehensive digital solutions tailored to your business needs"
        variant="services"
      />

      <ServicesOverview />

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Service</h2>
            <p className="text-gray-600">Explore our offerings and see how we can help you achieve your goals.</p>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                    selectedCategory === category
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No services match your search criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="mt-4 text-red-600 hover:underline font-semibold"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      <WhyChooseUsSummary />

      <section className="py-16 bg-gradient-to-r from-red-600 via-orange-500 to-pink-500 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white/90">
              Let's discuss how our services can help you achieve your goals.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-bold text-lg rounded-full shadow-lg hover:shadow-xl hover:bg-gray-100 transition-all duration-300 min-h-12"
              >
                Start Your Project Today
                <ArrowRight size={24} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <p className="text-gray-500 text-sm mt-4">Free consultation • No obligation • Expert advice</p>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default Services;