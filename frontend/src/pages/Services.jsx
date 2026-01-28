// src/pages/Services.jsx
import { useState, useMemo, useCallback, memo } from 'react';

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
  CheckCircle,
  Mail,
  MessageCircle,
  Package,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader.jsx';
import Button from '../components/common/Button.jsx';

import webDevelopmentImg from '../assets/services/website design.webp';
import uiuxImg from '../assets/services/uiux.webp';
import appDesignImg from '../assets/services/app design.webp';
import videoEditingImg from '../assets/services/video editing.webp';
import graphicDesignImg from '../assets/services/graphic design.webp';
import apiDevelopmentImg from '../assets/services/api-development.webp';
import seoImg from '../assets/services/seo.webp';
import digitalMarketingImg from '../assets/services/digital-marketing.webp';

// === Memoized Lazy Image ===
const LazyImage = memo(({ src, alt, className = '' }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    className={className}
    onError={(e) => {
      const target = e.target;
      target.src = `https://placehold.co/600x400/DEE2E6/495057?text=${encodeURIComponent(alt)}`;
    }}
  />
));
LazyImage.displayName = 'LazyImage';

// === Services Data ===
export const services = [
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

// === Simple Service Card ===
const ServiceCard = memo(({ service, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className="bg-white border border-gray-200 rounded-lg overflow-hidden h-full flex flex-col"
  >
    <div className="relative h-44 overflow-hidden">
      <LazyImage
        src={service.image}
        alt={service.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-3 left-3 flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow">
        {service.icon}
      </div>
      <div className="absolute bottom-0 left-0 right-0 py-2 px-4 bg-white/90 backdrop-blur-sm border-t border-gray-100">
        <span className="text-base font-bold text-gray-900">{service.title}</span>
        <span className="text-xs text-gray-500 font-medium block">{service.subtitle}</span>
      </div>
    </div>

    <div className="p-4 flex flex-col flex-grow">
      <p className="text-gray-700 mb-3 text-sm">{service.description}</p>

      <div className="mb-3 flex flex-wrap gap-1">
        {service.features.slice(0, 3).map((feature, i) => (
          <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded border border-red-100">
            {feature}
          </span>
        ))}
        {service.features.length > 3 && (
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded border border-gray-200">
            +{service.features.length - 3} more
          </span>
        )}
      </div>

      <Button
        to={`/services/${service.id}`}
        variant="primary"
        size="sm"
        iconRight={<ArrowRight className="w-3 h-3" />}
        className="w-full mt-auto rounded-lg border-none font-bold"
      >
        Get Started
      </Button>
    </div>
  </motion.div>
));
ServiceCard.displayName = 'ServiceCard';

// === Simple Why Choose Item ===
const WhyChooseItem = ({ title, description, icon, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay }}
    className="p-5 rounded-lg border border-gray-200 bg-white text-center"
  >
    <div className="flex justify-center mb-3">
      <div className="p-3 bg-red-100 rounded-lg">
        {icon}
      </div>
    </div>
    <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </motion.div>
);

// === Simple Why Choose Us Section ===
const WhyChooseUsSummary = () => {
  const items = [
    { title: "Expert Team", description: "Skilled professionals with deep industry knowledge.", icon: <Users className="w-8 h-8 text-red-600" /> },
    { title: "Innovation", description: "Cutting-edge solutions tailored to your unique needs.", icon: <Zap className="w-8 h-8 text-red-600" /> },
    { title: "Quality Focus", description: "Rigorous testing and quality assurance at every step.", icon: <Shield className="w-8 h-8 text-red-600" /> },
    { title: "Client Partnership", description: "We work closely with you as a trusted partner.", icon: <TrendingUp className="w-8 h-8 text-red-600" /> }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Why Choose <span className="text-red-600">Edizo?</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We combine technical expertise with creative vision to deliver solutions that exceed expectations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <WhyChooseItem key={item.title} {...item} delay={index * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
};

// === Simple Category Button ===
const CategoryButton = ({ category, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${isSelected
      ? 'bg-red-600 text-white'
      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
      }`}
  >
    {category}
  </button>
);

// === Main Component ===
const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Memoized categories
  const categories = useMemo(() => ['All', 'Development', 'Design', 'API', 'Marketing'], []);

  // Memoized filtered services
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

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'All') count++;
    if (searchTerm !== '') count++;
    return count;
  }, [selectedCategory, searchTerm]);

  // Memoized callbacks
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((category) => {
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
      />

      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Our <span className="text-red-600">Services</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a comprehensive suite of digital solutions to help your business grow, connect, and succeed.
            </p>
          </motion.div>

          {/* Search and Filter Section */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              {/* Search Bar */}
              <div className="relative w-full md:w-1/2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                <input
                  type="text"
                  placeholder="Search services, features, or technologies..."
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Category Filters */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs font-medium text-gray-700">
                  <Filter size={16} />
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
                className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3"
              >
                <span className="text-xs text-red-800 font-medium">
                  {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found
                  {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                </span>
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
                >
                  <X size={12} />
                  Clear all
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
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
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
                className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200"
              >
                <Search className="text-gray-300 mx-auto mb-4" size={48} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Services Found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We couldn't find any services matching your criteria. Try adjusting your filters.
                </p>
                <Button
                  onClick={handleClearFilters}
                  variant="primary"
                  size="md"
                  iconLeft={<X size={16} />}
                >
                  Clear All Filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Multiple Service Application Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-10 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg p-6 text-white"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-lg">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Need Multiple Services?</h3>
                  <p className="text-white/90 text-sm">
                    Select multiple services and get a combined quote with special package pricing!
                  </p>
                </div>
              </div>
              <Button
                to="/services/apply-multiple"
                variant="secondary"
                size="md"
                iconRight={<ArrowRight className="w-4 h-4" />}
                className="bg-white text-red-700 hover:bg-gray-100 font-bold whitespace-nowrap"
              >
                Save with Packages
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <WhyChooseUsSummary />

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-red-600 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Grow Your Business?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
              Join 100+ satisfied clients who transformed their business with our services.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/917092435729?text=${encodeURIComponent('Hi Edizo Team! I am interested in your services. Please share more details.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-green-600 font-bold rounded-lg"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Start Free Consultation</span>
              </a>
              <a
                href="mailto:edizoofficial@gmail.com?subject=Service Inquiry&body=Hi Edizo Team,%0A%0AI am interested in your services. Please share more details.%0A%0AMy Details:%0A- Name: %0A- Company/Project: %0A- Contact Number: %0A- Requirements: %0A%0AThank you!"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/50 text-white font-bold rounded-lg hover:bg-white/10"
              >
                <Mail className="w-5 h-5" />
                <span>Get Quote</span>
              </a>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-white/90">
              <span className="flex items-center gap-1">
                <Mail size={14} />
                edizoofficial@gmail.com
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle size={14} />
                +91 7092435729
              </span>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-white/70">
              <span className="flex items-center gap-1">
                <CheckCircle size={12} />
                Free Consultation
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle size={12} />
                No Obligation
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle size={12} />
                Expert Advice
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Services;