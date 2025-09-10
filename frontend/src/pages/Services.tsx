// src/pages/Services.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  // Icons used in service cards or main content
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
  // Icons used in the 'whyChoose' sections of specific services
  // For UI/UX
  Users, // Added
  Eye, // Added
  RefreshCw, // Added
  // For App Development
  Trello, // Added
  Headphones, // Added
  Server, // Already imported
  // For Video Editing
  Film, // Added
  Layers, // Added
  // For Graphic Design
  Brush, // Added
  Monitor, // Added
  // For API Development
  FileText, // Added
  // Add any other icons used in 'whyChoose' sections here
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';
// Removed unused Button import

// --- Image Imports ---
import webDevelopmentImg from '../assets/services/website design.webp';
import uiuxImg from '../assets/services/uiux.webp';
import appDesignImg from '../assets/services/app design.webp';
import videoEditingImg from '../assets/services/video editing.webp';
import graphicDesignImg from '../assets/services/graphic design.webp';
// Assuming you have an API development image, if not, use a placeholder or one of the others
import apiDevelopmentImg from '../assets/services/api-development.webp'; // Ensure this path is correct or use an existing image

// --- Types ---
export interface Service { // Export the interface
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
  relatedServices: string[]; // IDs of related services
  ctaText: string;
}

// --- Lazy Image Component ---
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

// --- Service Data (Only specified services) ---
export const services: Service[] = [ // Export the data array
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
    relatedServices: ['ui-ux', 'app-development'], // Removed non-existent services
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
      { title: 'Human-Centered', icon: <Users className="text-teal-500" size={20} /> }, // Fixed: Imported and used
      { title: 'Data-Driven Insights', icon: <BarChart2 className="text-blue-500" size={20} /> },
      { title: 'Pixel-Perfect Execution', icon: <Eye className="text-purple-500" size={20} /> }, // Fixed: Imported and used
      { title: 'Iterative Process', icon: <RefreshCw className="text-green-500" size={20} /> } // Fixed: Imported and used
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
      { title: 'Agile Development', icon: <Trello className="text-blue-500" size={20} /> }, // Fixed: Imported and used
      { title: 'Scalable Architecture', icon: <Server className="text-gray-500" size={20} /> },
      { title: 'Post-Launch Support', icon: <Headphones className="text-green-500" size={20} /> } // Fixed: Imported and used
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
      { title: 'Creative Storytelling', icon: <Film className="text-red-500" size={20} /> }, // Fixed: Imported and used
      { title: 'Attention to Detail', icon: <Eye className="text-blue-500" size={20} /> }, // Reused existing import
      { title: 'Fast Turnaround', icon: <Zap className="text-yellow-500" size={20} /> }, // Reused existing import
      { title: 'Multiple Formats', icon: <Layers className="text-purple-500" size={20} /> } // Fixed: Imported and used
    ],
    relatedServices: ['graphic-design'],
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
      { title: 'Brand-Aligned Designs', icon: <Shield className="text-yellow-500" size={20} /> }, // Reused existing import
      { title: 'Creative Versatility', icon: <Brush className="text-pink-500" size={20} /> }, // Fixed: Imported and used
      { title: 'Quick Revisions', icon: <RefreshCw className="text-blue-500" size={20} /> }, // Reused existing import
      { title: 'Print & Digital Ready', icon: <Monitor className="text-gray-500" size={20} /> } // Fixed: Imported and used
    ],
    relatedServices: ['video-editing', 'web-development'],
    ctaText: 'Elevate Your Brand Visually'
  },
  {
    id: 'api-development',
    title: 'API Development',
    subtitle: 'Seamless Integration & Data Flow',
    description: 'Build robust, scalable APIs to connect your applications and services.',
    longDescription: 'In a connected world, APIs are the backbone of modern software. Our API development services focus on creating secure, efficient, and well-documented APIs that enable seamless communication between your applications, services, and third-party systems. Whether you need a RESTful API, GraphQL endpoint, or a custom integration, we ensure reliability, scalability, and ease of use for developers.',
    image: apiDevelopmentImg, // Use the imported image or a placeholder
    icon: <Server className="text-gray-600" size={24} />, // Reused existing import
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
      { title: 'Well-Documented', icon: <FileText className="text-blue-500" size={20} /> }, // Fixed: Imported and used
      { title: 'Secure by Design', icon: <Shield className="text-gray-700" size={20} /> }, // Reused existing import
      { title: 'Highly Scalable', icon: <BarChart2 className="text-teal-500" size={20} /> }, // Reused existing import
      { title: 'Developer-Friendly', icon: <Code className="text-green-500" size={20} /> } // Reused existing import
    ],
    relatedServices: ['web-development', 'app-development'],
    ctaText: 'Connect Your Systems'
  }
];

// --- Service Card Component ---
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

// --- Main Component ---
const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Simple category filtering based on service ID or title keywords
  const categories = ['All', 'Development', 'Design', 'API'];

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

      {/* What We Offer */}
      <section className="py-16 bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Offer</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                A full spectrum of services to help your business thrive in the digital age.
              </p>
            </div>
          </AnimatedSection>

          {/* Search and Filter */}
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

          {/* Services Grid */}
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

      {/* CTA Banner */}
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

export default Services; // Default export