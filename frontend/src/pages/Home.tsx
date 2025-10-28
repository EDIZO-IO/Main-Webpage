// src/pages/Home.tsx
import React, { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  Target as TargetIcon,
  Zap as ZapIcon,
  Shield as ShieldIcon2,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Tag,
  Percent,
  Star,
  Loader2,
} from 'lucide-react';
import Button from '../components/common/Button';
import { useGoogleEvents } from '../components/hooks/useGoogleEvents';
import { useTrendingInternships } from '../components/hooks/useInternships';
import { getHighestDiscount, hasDiscount } from '../utils/internship.utils';

// Import Assets
import faceguard from '../assets/project/face-Guard.png';
import ransomware from '../assets/project/Ransomware.png';
import Epicnexus from '../assets/project/Epic-nexus.png';

// Service Images
import webDevelopment from '../assets/services/website design.webp';
import uiuxImg from '../assets/services/uiux.webp';
import appDesignImg from '../assets/services/app design.webp';
import videoEditingImg from '../assets/services/video editing.webp';
import graphicDesignImg from '../assets/services/graphic design.webp';
import apiDevelopmentImg from '../assets/services/api-development.webp';
import seoImg from '../assets/services/seo.webp';
import digitalMarketingImg from '../assets/services/digital-marketing.webp';

// Type definitions
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
}

interface ServiceCardProps {
  img: string;
  title: string;
  desc: string;
  link: string;
}

interface PortfolioCardProps {
  img: string;
  title: string;
  category?: string;
  link: string;
  shortDescription?: string;
  isExternal?: boolean;
  isInternship?: boolean;
  maxDiscount?: number;
  hasDiscount?: boolean;
  rating?: number;
}

// ✅ Memoized Lazy Load Images
const LazyImage = memo<LazyImageProps>(({ src, alt, className = "" }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    className={className}
    onError={(e) => {
      const target = e.target as HTMLImageElement;
      target.src = `https://placehold.co/400x250/D1D5DB/4B5563?text=${encodeURIComponent(alt)}`;
    }}
  />
));
LazyImage.displayName = 'LazyImage';

// ✅ Optimized Animated Section - Reduced animation complexity
const AnimatedSection = memo<AnimatedSectionProps>(({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.4, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
));
AnimatedSection.displayName = 'AnimatedSection';

// ✅ Memoized Service Card
const ServiceCard = memo<ServiceCardProps>(({ img, title, desc, link }) => {
  return (
    <AnimatedSection>
      <motion.div
        className="group relative rounded-2xl overflow-hidden bg-white border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-2xl transition-all duration-300"
        whileHover={{ y: -6 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <LazyImage
            src={img}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{desc}</p>

          <Button
            to={link}
            variant="outline"
            size="sm"
            enableFestivalAnimation={false}
            showFestivalEmoji={true}
            iconRight={<ArrowRight className="w-4 h-4" />}
            className="w-full"
          >
            Learn More
          </Button>
        </div>
      </motion.div>
    </AnimatedSection>
  );
});
ServiceCard.displayName = 'ServiceCard';

// ✅ Memoized Portfolio Card
const PortfolioCard = memo<PortfolioCardProps>(({ 
  img, 
  title, 
  category, 
  link, 
  shortDescription, 
  isExternal = false, 
  isInternship = false,
  maxDiscount,
  hasDiscount: hasDiscountProp,
  rating
}) => {
  const CardContent = (
    <>
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <LazyImage 
          src={img} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
        />
        
        {category && (
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-red-600 to-orange-600 text-white text-xs font-bold rounded-full shadow-lg">
            {category}
          </div>
        )}

        {hasDiscountProp && maxDiscount && maxDiscount > 0 && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-lg">
            <Tag size={12} />
            {maxDiscount}% OFF
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
          {title}
        </h3>
        {shortDescription && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
            {shortDescription}
          </p>
        )}
        {isInternship && !shortDescription && (
          <p className="text-gray-600 text-sm leading-relaxed mb-3">
            Gain real-world experience on live projects.
          </p>
        )}

        {rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-bold text-gray-800 ml-1">{rating}</span>
            </div>
            {hasDiscountProp && maxDiscount && maxDiscount > 0 && (
              <div className="flex items-center text-green-600 text-xs font-bold">
                <Percent size={12} className="mr-0.5" />
                Up to {maxDiscount}% OFF
              </div>
            )}
          </div>
        )}

        <div className="mt-4 inline-flex items-center text-red-600 font-semibold text-sm">
          <span className="mr-2">Explore</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
        </div>
      </div>
    </>
  );

  const cardClasses = "group relative rounded-2xl overflow-hidden bg-white border border-gray-100 hover:border-red-200 shadow-sm hover:shadow-2xl transition-all duration-300";

  if (isExternal) {
    return (
      <AnimatedSection>
        <motion.div 
          className={cardClasses} 
          whileHover={{ y: -6 }}
          transition={{ duration: 0.2 }}
        >
          <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
            {CardContent}
          </a>
        </motion.div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection>
      <motion.div 
        className={cardClasses} 
        whileHover={{ y: -6 }}
        transition={{ duration: 0.2 }}
      >
        <Link to={link} className="block h-full">
          {CardContent}
        </Link>
      </motion.div>
    </AnimatedSection>
  );
});
PortfolioCard.displayName = 'PortfolioCard';

// ✅ Optimized Hero Section - Reduced animated elements from 6 to 3
const Hero = memo(() => {
  const { getActiveEvent } = useGoogleEvents();
  const activeEvent = getActiveEvent();
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-red-50" aria-labelledby="hero-title">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-200/30 to-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full blur-3xl" />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* ✅ Reduced from 6 to 3 animated elements for better performance */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full mix-blend-multiply filter blur-xl opacity-10"
            style={{
              width: `${150 + i * 50}px`,
              height: `${150 + i * 50}px`,
              background: `linear-gradient(135deg, ${i % 2 === 0 ? '#ff6b6b, #ffa500' : '#8b5cf6, #ec4899'})`,
              left: `${20 + (i * 30) % 60}%`,
              top: `${15 + (i * 25) % 60}%`,
            }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <motion.div
        className="container mx-auto px-6 lg:px-12 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-5xl mx-auto">
          <AnimatedSection delay={0.1}>
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-red-200 rounded-full shadow-sm">
                <Sparkles className="w-4 h-4 text-red-600" />
                <span className="text-sm font-semibold text-gray-700">Design.Develop.Deliver</span>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <h1 id="hero-title" className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-center mb-6 leading-tight">
              <span className="text-gray-900">Welcome to </span>
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">EDIZO</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-xl md:text-2xl text-center text-gray-600 font-medium mb-4 max-w-3xl mx-auto">
              Creative Services & Real-World Learning — All in One Place
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.25}>
            <p className="text-lg md:text-xl text-center text-gray-600 leading-relaxed mb-10 max-w-3xl mx-auto">
              Empowering brands with{' '}
              <span className="font-bold text-red-600">creative design</span>,{' '}
              <span className="font-bold text-red-600">reliable development</span>, and{' '}
              <span className="font-bold text-red-600">impactful digital solutions</span>{' '}
              — built with precision, passion, and trust.
              <br className="hidden md:block" />
              Launch your career with our exclusive{' '}
              <span className="font-bold text-red-600">internship programs</span>.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                to="/services" 
                variant="primary" 
                size="lg"
                iconRight={<ArrowRight className="w-5 h-5" />}
                enableFestivalAnimation={true}
                showFestivalEmoji={true}
                style={
                  !activeEvent
                    ? {
                        background: "linear-gradient(90deg, #fbbf24 0%, #f43f5e 100%)",
                        color: "#fff",
                        boxShadow: "0 4px 20px 0 rgba(251,191,36,0.3),0 8px 24px 0 rgba(244,63,94,0.2)"
                      }
                    : undefined
                }
              >
                Explore Services
              </Button>

              <Button 
                to="/contact" 
                variant="outline" 
                size="lg"
                enableFestivalAnimation={true}
                showFestivalEmoji={false}
              >
                Get in Touch
              </Button>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.35}>
            <div className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>10+ Happy Clients</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>25+ Projects Delivered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>5.0 Client Rating</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 105C120 90 240 60 360 52.5C480 45 600 60 720 67.5C840 75 960 75 1080 67.5C1200 60 1320 45 1380 37.5L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.5"/>
        </svg>
      </div>
    </section>
  );
});
Hero.displayName = 'Hero';

// ✅ Memoized Why Choose Item
const WhyChooseItem = memo<{ icon: React.ElementType; title: string; desc: string; gradient: string; delay: number }>(
  ({ icon: Icon, title, desc, gradient, delay }) => (
    <AnimatedSection delay={delay}>
      <motion.div
        className="relative p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden"
        whileHover={{ y: -6 }}
        transition={{ duration: 0.2 }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
        
        <div className={`relative w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
          <Icon size={32} className="text-white" />
        </div>

        <div className="relative">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{desc}</p>
        </div>

        <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl ${gradient} opacity-5 rounded-tl-full`} />
      </motion.div>
    </AnimatedSection>
  )
);
WhyChooseItem.displayName = 'WhyChooseItem';

// Main Home Component
const Home: React.FC = () => {
  const { getActiveEvent } = useGoogleEvents();
  const activeEvent = getActiveEvent();
  
  const { internships: trendingInternships, loading: internshipsLoading } = useTrendingInternships(4.5, 3);

  // ✅ Memoize static data
  const featuredProjects = useMemo(() => [
    {
      id: 'cybersecurity',
      img: ransomware,
      title: 'AI-Based Ransomware Detection System',
      category: 'Cybersecurity',
      link: 'https://bytecode.edizo.in',
      shortDescription: 'An AI system for detecting and preventing ransomware attacks in real-time'
    },
    {
      id: 'ai-computer-vision',
      img: faceguard,
      title: 'FaceGuard-GAN Deepfake Detection',
      category: 'Computer Vision & AI',
      link: 'https://bytecode.edizo.in',
      shortDescription: 'GAN-powered solution for detecting manipulated facial images and videos'
    },
    {
      id: 'web-development',
      img: Epicnexus,
      title: 'Epic Nexus Gaming Community Platform',
      category: 'Web Development',
      link: 'https://bytecode.edizo.in',
      shortDescription: 'Comprehensive gaming community platform with social features and reviews'
    }
  ], []);

  const featuredServices = useMemo(() => [
    { img: webDevelopment, title: "Web Development", desc: "Fast, scalable websites with React & Next.js.", link: "/services/web-development" },
    { img: uiuxImg, title: "UI/UX Design", desc: "Human-centered design that users love.", link: "/services/ui-ux" },
    { img: appDesignImg, title: "App Development", desc: "Cross-platform apps with React Native & Flutter.", link: "/services/app-development" },
    { img: videoEditingImg, title: "Video Editing", desc: "Engaging visuals for brand storytelling.", link: "/services/video-editing"},
    { img: graphicDesignImg, title: "Graphic Design", desc: "Brand-aligned visuals that elevate identity.", link: "/services/graphic-design"},
    { img: apiDevelopmentImg, title: "API Development", desc: "Robust, scalable APIs for seamless integration.", link: "/services/api-development"},
    { img: seoImg, title: "SEO Optimization", desc: "Dominate search engine rankings organically.", link: "/services/seo"},
    { img: digitalMarketingImg, title: "Digital Marketing", desc: "Reach & engage your audience across channels.", link: "/services/digital-marketing"},
  ], []);

  const whyChooseItems = useMemo(() => [
    { 
      icon: ZapIcon, 
      title: "Fast Delivery", 
      desc: "On schedule — every time.",
      gradient: "from-yellow-500 to-orange-500"
    },
    { 
      icon: ShieldIcon2, 
      title: "100% Satisfaction", 
      desc: "We revise until you're thrilled.",
      gradient: "from-green-500 to-teal-500"
    },
    { 
      icon: TargetIcon, 
      title: "Results-Driven", 
      desc: "Optimized for growth & impact.",
      gradient: "from-blue-500 to-purple-500"
    },
  ], []);

  return (
    <div className="bg-white" id="home" role="main">
      <Hero />

      {/* UPCOMING EVENTS */}
      <section className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #8b5cf6 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <div className="flex justify-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-full shadow-sm">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-700">Upcoming Events</span>
                </div>
              </div>

              <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-6">
                Join Our <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Free Webinars</span>
              </h2>

              <p className="text-xl text-center text-gray-600 mb-8">
                Learn from industry experts — no cost, no risk.
              </p>

              <div className="flex justify-center mb-6">
                <Button 
                  to="/events" 
                  variant="primary"
                  size="xl"
                  showFestivalEmoji={true}
                  enableFestivalAnimation={true}
                  style={
                    !activeEvent
                      ? {
                          background: "linear-gradient(90deg, #fbbf24 0%, #f43f5e 100%)",
                          color: "#fff",
                          boxShadow: "0 4px 20px 0 rgba(251,191,36,0.3),0 8px 24px 0 rgba(244,63,94,0.2)"
                        }
                      : undefined
                  }
                  className="shadow-2xl hover:shadow-3xl"
                >
                  View Events & Register
                </Button>
              </div>

              <p className="text-center text-gray-500 text-sm flex items-center justify-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                1,000+ professionals attended
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full mb-6">
                <span className="text-sm font-semibold text-red-700">What We Offer</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                Our Services
              </h2>
              <p className="text-xl text-gray-600">
                Expert solutions loved by clients worldwide
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredServices.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="py-24 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
                <span className="text-sm font-semibold text-blue-700">Portfolio</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                Our Work
              </h2>
              <p className="text-xl text-gray-600">
                Award-worthy digital solutions. Explore our complete portfolio on our dedicated platform.
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
            {featuredProjects.map((project) => (
              <PortfolioCard key={project.id} {...project} isExternal />
            ))}
          </div>

          <div className="text-center">
            <Button 
              href="https://bytecode.edizo.in" 
              variant="primary"
              size="lg"
              enableFestivalAnimation={true}
              showFestivalEmoji={true}
              iconRight={<ArrowRight className="w-5 h-5" />}
              style={
                !activeEvent
                  ? {
                      background: "linear-gradient(90deg, #fbbf24 0%, #f43f5e 100%)",
                      color: "#fff"
                    }
                  : undefined
              }
            >
              View All Projects
            </Button>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <AnimatedSection>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                Why Choose Edizo?
              </h2>
              <p className="text-xl text-gray-600">
                We deliver unmatched results
              </p>
            </AnimatedSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {whyChooseItems.map((item, i) => (
              <WhyChooseItem key={item.title} {...item} delay={0.1 * i} />
            ))}
          </div>
        </div>
      </section>

      {/* INTERNSHIPS */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 border border-purple-200 rounded-full mb-6">
                <span className="text-sm font-semibold text-purple-700">Career Growth</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                Trending Internships
              </h2>
              <p className="text-xl text-gray-600">
                Launch your career with hands-on experience
              </p>
            </AnimatedSection>
          </div>

          {internshipsLoading ? (
            <div className="text-center py-12">
              <Loader2 className="animate-spin text-purple-600 mx-auto mb-4" size={48} />
              <p className="text-gray-600">Loading trending internships...</p>
            </div>
          ) : trendingInternships.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
                {trendingInternships.map((item) => (
                  <PortfolioCard 
                    key={item.id} 
                    img={item.image}
                    title={item.title}
                    category={item.category}
                    link={`/internships/${item.id}`}
                    shortDescription={item.description}
                    isExternal={false}
                    isInternship={true}
                    maxDiscount={getHighestDiscount(item.discount)}
                    hasDiscount={hasDiscount(item.discount)}
                    rating={item.rating}
                  />
                ))}
              </div>

              <div className="text-center">
                <Button 
                  to="/internships" 
                  variant="primary"
                  size="lg"
                  enableFestivalAnimation={true}
                  showFestivalEmoji={true}
                  iconRight={<ArrowRight className="w-5 h-5" />}
                  style={
                    !activeEvent
                      ? {
                          background: "linear-gradient(90deg, #fbbf24 0%, #f43f5e 100%)",
                          color: "#fff"
                        }
                      : undefined
                  }
                >
                  Explore All Internships
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-6">No trending internships available at the moment.</p>
              <Button 
                to="/internships" 
                variant="outline"
                size="lg"
              >
                View All Internships
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-red-900 to-orange-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          />
        </div>

        {/* ✅ Reduced from 5 to 3 animated elements */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10 pointer-events-none"
            style={{
              width: `${80 + i * 50}px`,
              height: `${80 + i * 50}px`,
              left: `${15 + (i * 30) % 70}%`,
              top: `${15 + (i * 20) % 60}%`,
            }}
            animate={{
              y: [0, -15, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse",
            }}
          />
        ))}

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-8 shadow-2xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                Ready to Be Our Next Success Story?
              </h2>

              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join 10+ clients who trust us with their digital transformation.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  to="/contact"
                  variant="primary"
                  size="xl"
                  enableFestivalAnimation={true}
                  showFestivalEmoji={true}
                  iconRight={<ArrowRight className="w-6 h-6" />}
                  className="shadow-2xl hover:shadow-3xl"
                  style={
                    !activeEvent
                      ? {
                          background: "linear-gradient(90deg, #fbbf24 0%, #f43f5e 100%)",
                          color: "#fff"
                        }
                      : undefined
                  }
                >
                  Contact Us Today
                </Button>
                <Button
                  to="/services"
                  variant="secondary"
                  size="xl"
                  enableFestivalAnimation={false}
                  showFestivalEmoji={false}
                  className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl"
                >
                  View Our Services
                </Button>
              </div>

              <div className="mt-12 flex items-center justify-center gap-2 text-gray-400">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-sm">100% Client Satisfaction Guaranteed</span>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
