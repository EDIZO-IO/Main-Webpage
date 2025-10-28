// src/pages/Services.tsx
import { useState, useMemo, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Filter,
  X,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import AnimatedSection from '../components/common/AnimatedSection';
import Button from '../components/common/Button';
import { useGoogleEvents } from '../components/hooks/useGoogleEvents';

import webDevelopmentImg from '../assets/services/website design.webp';
import uiuxImg from '../assets/services/uiux.webp';
import appDesignImg from '../assets/services/app design.webp';
import videoEditingImg from '../assets/services/video editing.webp';
import graphicDesignImg from '../assets/services/graphic design.webp';
import apiDevelopmentImg from '../assets/services/api-development.webp';
import seoImg from '../assets/services/seo.webp';
import digitalMarketingImg from '../assets/services/digital-marketing.webp';

// === TypeScript Interfaces ===
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

interface ServiceCardProps {
  service: Service;
  index: number;
}

// === Memoized Lazy Image ===
const LazyImage = memo<LazyImageProps>(({ src, alt, className = '' }) => (
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
));
LazyImage.displayName = 'LazyImage';

// === Services Data ===
export const services: Service[] = [
  {
    id: 'web-development',
    title: 'Web Development',
    subtitle: 'Scalable & High-Performance Websites',
    description: 'Build blazing-fast, responsive websites with React, Next.js, and modern frameworks.',
    longDescription: 'Our web development services are designed to create fast, scalable, and secure websites that deliver exceptional user experiences. Whether you need a simple landing page or a complex web application, we use the latest technologies like React, Next.js, Node.js, and more to bring your vision to life. Our process ensures your site is optimized for performance, SEO, and accessibility from day one.',
    image: webDevelopmentImg,
    icon: <Globe className="text-blue-500" size={24} />,
    features: ['Responsive Design', 'SEO Optimization', 'Performance Tuning', 'E-commerce Integration', 'API Development', 'CMS Integration'],
    technologies: ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Tailwind CSS'],
    benefits: ['Faster load times improve SEO and user engagement', 'Scalable architecture for future growth', 'Cross-browser compatibility for wider reach', 'Enhanced security to protect your data'],
    process: ['Project Discovery & Planning', 'UI/UX Design & Prototyping', 'Frontend & Backend Development', 'Testing & Quality Assurance', 'Deployment & Launch', 'Ongoing Support & Maintenance'],
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
    features: ['User Research & Personas', 'Wireframing & Prototyping', 'Visual Design (UI)', 'Interaction Design', 'Usability Testing', 'Design Systems'],
    technologies: ['Figma', 'Sketch', 'Adobe XD', 'InVision', 'Principle', 'Maze'],
    benefits: ['Increased user satisfaction and engagement', 'Higher conversion rates and ROI', 'Reduced development time and costs', 'Stronger brand identity and consistency'],
    process: ['Research & Discovery', 'User Personas & Journey Maps', 'Information Architecture', 'Wireframing', 'Visual Design', 'Prototyping & Testing'],
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
    features: ['Cross-Platform Development', 'Native Performance', 'Push Notifications', 'Offline Functionality', 'Third-Party Integrations', 'App Store Optimization'],
    technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'Redux'],
    benefits: ['Wider audience reach with one codebase', 'Faster time-to-market', 'Cost-effective development', 'Consistent user experience across devices'],
    process: ['Idea Validation & Strategy', 'UI/UX Design for Mobile', 'App Architecture & Planning', 'Development (iOS & Android)', 'Testing & QA', 'Deployment & Marketing'],
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
    features: ['Color Grading & Correction', 'Motion Graphics & Animation', 'Sound Design & Mixing', 'Visual Effects', 'Multi-Cam Editing', 'Social Media Optimization'],
    technologies: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Final Cut Pro', 'Blender'],
    benefits: ['Boost brand awareness and engagement', 'Increase website traffic and conversions', 'Enhance social media presence', 'Create lasting impressions on clients'],
    process: ['Project Brief & Creative Brief', 'Footage Review & Organization', 'Rough Cut & Feedback', 'Fine Cut & Revisions', 'Color Correction & Sound Mix', 'Final Delivery & Formats'],
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
    features: ['Logo & Brand Identity', 'Marketing Collateral', 'Social Media Graphics', 'Packaging Design', 'Illustrations & Icons', 'Print & Digital Design'],
    technologies: ['Adobe Photoshop', 'Illustrator', 'InDesign', 'Figma', 'Canva'],
    benefits: ['Stronger brand recognition', 'Professional marketing materials', 'Consistent visual identity', 'Stand out from competitors'],
    process: ['Design Brief & Research', 'Concept Development & Mood Boards', 'Initial Designs & Feedback', 'Revisions & Refinements', 'Final Design & Delivery', 'Brand Guidelines (Optional)'],
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
    features: ['RESTful & GraphQL APIs', 'Authentication & Authorization', 'Rate Limiting & Throttling', 'Comprehensive Documentation', 'Testing & Monitoring', 'Versioning & Maintenance'],
    technologies: ['Node.js', 'Express', 'Python', 'Django REST Framework', 'PostgreSQL', 'MongoDB', 'Swagger/OpenAPI'],
    benefits: ['Enable faster application development', 'Improve data sharing and integration', 'Enhance system scalability and flexibility', 'Provide a foundation for microservices'],
    process: ['Requirements Gathering & Planning', 'API Design & Specification', 'Backend Development', 'Security Implementation', 'Testing & Documentation', 'Deployment & Support'],
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
    features: ['Technical SEO Audit', 'Keyword Research & Strategy', 'On-Page Optimization', 'Content Creation & Optimization', 'Link Building', 'Local SEO', 'Performance Monitoring & Reporting'],
    technologies: ['Google Analytics', 'Google Search Console', 'SEMrush', 'Ahrefs', 'Moz', 'Yoast SEO'],
    benefits: ['Increased organic website traffic', 'Higher search engine rankings', 'Improved brand credibility', 'Long-term, sustainable growth', 'Better ROI compared to paid ads'],
    process: ['Initial SEO Audit & Competitor Analysis', 'Keyword Research & Strategy Development', 'Technical & On-Page Optimization', 'Content Creation & Link Building', 'Performance Monitoring & Reporting', 'Strategy Refinement & Ongoing Optimization'],
    whyChoose: [
      { title: 'Proven Results', icon: <TrendingUp className="text-blue-500" size={20} /> },
      { title: 'White-Hat Techniques', icon: <Shield className="text-green-500" size={20} /> },
      { title: 'Keyword Focused', icon: <Target className="text-purple-500" size={20} /> },
      { title: 'Transparent Reporting', icon: <BarChart2 className="text-yellow-500" size={20} /> }
    ],
    relatedServices: ['web-development', 'digital-marketing'],
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
    features: ['Search Engine Marketing (SEM/PPC)', 'Social Media Marketing (SMM)', 'Email Marketing Campaigns', 'Content Marketing Strategy', 'Influencer Marketing', 'Marketing Automation', 'Analytics & ROI Tracking'],
    technologies: ['Google Ads', 'Meta Ads Manager', 'Mailchimp', 'HubSpot', 'Hootsuite', 'Google Analytics', 'Facebook Pixel'],
    benefits: ['Targeted reach to potential customers', 'Increased brand awareness and engagement', 'Measurable results and ROI', 'Cost-effective marketing compared to traditional methods', 'Flexibility to adjust campaigns in real-time'],
    process: ['Marketing Strategy & Goal Definition', 'Target Audience Research', 'Channel Selection & Campaign Setup', 'Content Creation & Ad Design', 'Campaign Launch & Management', 'Monitoring, Analysis & Optimization'],
    whyChoose: [
      { title: 'Multi-Channel Approach', icon: <Share2 className="text-purple-500" size={20} /> },
      { title: 'Data-Driven Decisions', icon: <BarChart2 className="text-green-500" size={20} /> },
      { title: 'Audience Focused', icon: <Users className="text-blue-500" size={20} /> },
      { title: 'Measurable ROI', icon: <Target className="text-yellow-500" size={20} /> }
    ],
    relatedServices: ['seo', 'graphic-design', 'video-editing'],
    ctaText: 'Boost Your Online Presence'
  }
];

// === Memoized Service Card ===
const ServiceCard = memo<ServiceCardProps>(({ service, index }) => (
  <AnimatedSection delay={index * 0.05}>
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col hover:shadow-2xl hover:border-red-200"
    >
      <div className="relative h-56 overflow-hidden">
        <LazyImage
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        {/* Icon Badge */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="absolute top-4 left-4 p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg"
        >
          {service.icon}
        </motion.div>

        {/* Title Overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{service.title}</h3>
          <p className="text-white/90 text-sm font-medium">{service.subtitle}</p>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <p className="text-gray-700 mb-6 flex-grow leading-relaxed">{service.description}</p>
        
        {/* Features Preview */}
        <div className="mb-6 flex flex-wrap gap-2">
          {service.features.slice(0, 3).map((feature, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
              {feature}
            </span>
          ))}
          {service.features.length > 3 && (
            <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold">
              +{service.features.length - 3} more
            </span>
          )}
        </div>

<Button
  to={`/services/${service.id}`}
  variant="outline"
  size="sm"
  enableFestivalAnimation={false}
  showFestivalEmoji={true}
  iconRight={<ArrowRight className="w-4 h-4" />}
  className="w-full mt-auto"
>
  Explore Details
</Button>

      </div>
    </motion.div>
  </AnimatedSection>
));
ServiceCard.displayName = 'ServiceCard';

// === Memoized Why Choose Item ===
const WhyChooseItem = memo<{ title: string; description: string; icon: React.ReactNode; delay: number }>(
  ({ title, description, icon, delay }) => (
    <AnimatedSection delay={delay}>
      <motion.div
        whileHover={{ y: -5, scale: 1.03 }}
        transition={{ duration: 0.2 }}
        className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl text-center border-2 border-gray-100 hover:border-red-300 hover:shadow-xl transition-all group"
      >
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="flex justify-center mb-4"
        >
          <div className="p-4 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl group-hover:from-red-200 group-hover:to-orange-200 transition-colors">
            {icon}
          </div>
        </motion.div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </motion.div>
    </AnimatedSection>
  )
);
WhyChooseItem.displayName = 'WhyChooseItem';

// === Memoized Why Choose Us Section ===
const WhyChooseUsSummary = memo(() => {
  const items = useMemo(() => [
    { title: "Expert Team", description: "Skilled professionals with deep industry knowledge.", icon: <Users className="w-10 h-10 text-red-600" /> },
    { title: "Innovation", description: "Cutting-edge solutions tailored to your unique needs.", icon: <Zap className="w-10 h-10 text-red-600" /> },
    { title: "Quality Focus", description: "Rigorous testing and quality assurance at every step.", icon: <Shield className="w-10 h-10 text-red-600" /> },
    { title: "Client Partnership", description: "We work closely with you as a trusted partner.", icon: <TrendingUp className="w-10 h-10 text-red-600" /> }
  ], []);

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full mb-4">
              <Sparkles className="w-5 h-5 text-red-600" />
              <span className="text-sm font-semibold text-red-700">Our Advantage</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Edizo?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine technical expertise with creative vision to deliver solutions that exceed expectations.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <WhyChooseItem key={item.title} {...item} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
});
WhyChooseUsSummary.displayName = 'WhyChooseUsSummary';

// === Memoized Category Button ===
const CategoryButton = memo<{ category: string; isSelected: boolean; onClick: () => void }>(
  ({ category, isSelected, onClick }) => (
    <motion.button
      onClick={onClick}
      className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-sm ${
        isSelected
          ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg scale-105'
          : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-300 hover:bg-gray-50'
      }`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {category}
    </motion.button>
  )
);
CategoryButton.displayName = 'CategoryButton';

// === Main Component ===
const Services: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { getActiveEvent } = useGoogleEvents();
  const activeEvent = getActiveEvent();

  // ✅ Memoized categories
  const categories = useMemo(() => ['All', 'Development', 'Design', 'API', 'Marketing'], []);

  // ✅ Memoized filtered services
  const filteredServices = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    
    return services.filter(service => {
      const matchesSearch =
        searchTerm === '' ||
        service.title.toLowerCase().includes(lowerSearch) ||
        service.subtitle.toLowerCase().includes(lowerSearch) ||
        service.description.toLowerCase().includes(lowerSearch) ||
        service.features.some(f => f.toLowerCase().includes(lowerSearch)) ||
        service.technologies.some(t => t.toLowerCase().includes(lowerSearch));

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
        }
      }

      return matchesSearch && matchesCategory;
    });
  }, [services, searchTerm, selectedCategory]);

  // ✅ Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (searchTerm !== '') count++;
    return count;
  }, [selectedCategory, searchTerm]);

  // ✅ Memoized callbacks
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('All');
  }, []);

  return (
    <>
      <PageHeader
        title="Our Services"
        subtitle="Comprehensive digital solutions tailored to your business needs"
        variant="services"
      />

      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-100 to-orange-100 rounded-full mb-4">
                <Sparkles className="w-5 h-5 text-red-600" />
                <span className="text-sm font-semibold text-red-700">What We Offer</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Services</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We offer a comprehensive suite of digital solutions to help your business grow, connect, and succeed.
              </p>
            </div>
          </AnimatedSection>
          
          {/* Search and Filter Section */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              {/* Search Bar */}
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                <input
                  type="text"
                  placeholder="Search services, features, or technologies..."
                  className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm text-gray-900 placeholder-gray-400 font-medium"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Category Filters */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Filter size={18} />
                  <span>Filter:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <CategoryButton
                      key={category}
                      category={category}
                      isSelected={selectedCategory === category}
                      onClick={() => handleCategoryChange(category)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {activeFilterCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl p-4"
              >
                <span className="text-sm text-blue-800 font-medium">
                  {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found
                  {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                </span>
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 hover:underline"
                >
                  <X size={14} />
                  Clear all filters
                </button>
              </motion.div>
            )}
          </div>

          {/* Services Grid */}
          <AnimatePresence mode="wait">
            {filteredServices.length > 0 ? (
              <motion.div
                key="services-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredServices.map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-20 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl border-2 border-gray-200"
              >
                <Search className="text-gray-300 mx-auto mb-6" size={64} />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Services Found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  We couldn't find any services matching your criteria. Try adjusting your filters.
                </p>
                <Button
                  onClick={handleClearFilters}
                  variant="primary"
                  size="lg"
                  iconLeft={<X size={20} />}
                >
                  Clear All Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <WhyChooseUsSummary />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 via-orange-500 to-pink-500 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-semibold">Ready to Get Started?</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Transform Your Business Today
            </h2>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white/90">
              Let's discuss how our services can help you achieve your goals and grow your business.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  to="/contact"
                  variant="secondary"
                  size="xl"
                  enableFestivalAnimation={true}
                  showFestivalEmoji={true}
                  iconRight={<ArrowRight className="w-6 h-6" />}
                  className="shadow-2xl hover:shadow-3xl"
                >
                  Start Your Project
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  to="/internships"
                  variant="outline"
                  size="xl"
                  className="border-2 border-white/50 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  View Internships
                </Button>
              </motion.div>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-white/80">
              <span className="flex items-center gap-2">
                <CheckCircle size={16} />
                Free Consultation
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle size={16} />
                No Obligation
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle size={16} />
                Expert Advice
              </span>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default Services;
