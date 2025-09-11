// src/pages/ServiceDetails.tsx
import React, { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Code,
  Palette,
 
  Zap,
  Star,
  MessageSquare,
  Award,


  Settings,
 
  CheckCircle,
} from 'lucide-react'; // Ensure all icons used are imported
import { motion } from 'framer-motion';

import AnimatedSection from '../components/common/AnimatedSection';
import Button from '../components/common/Button';
import { services, type Service } from './Services'; // Import services data and type

// --- Lazy Image Component (Duplicated for self-containment, or import from Services) ---
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

// --- Why Choose Edizo - Common content ---
const whyChooseEdizoServiceContent = [
  { title: "Creative, Custom-First Approach", icon: <Palette size={20} /> },
  { title: "On-Time Project Delivery", icon: <Zap size={20} /> },
  { title: "Affordable & Transparent Pricing", icon: <Star size={20} /> },
  { title: "Friendly Support & Professional Team", icon: <Code size={20} /> },
];

// --- Animated Typing Subtitle ---
interface AnimatedTypingSubtitleProps {
  phrases: string[];
}

const AnimatedTypingSubtitle: React.FC<AnimatedTypingSubtitleProps> = ({ phrases }) => {
  // Basic implementation, you can keep your existing one if preferred
  const [displayedText, setDisplayedText] = React.useState('');
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [phraseIndex, setPhraseIndex] = React.useState(0);
  const [typingSpeed, setTypingSpeed] = React.useState(150);

  React.useEffect(() => {
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
    <span className="relative font-semibold text-xl md:text-2xl text-white">
      {displayedText}
      <span className="inline-block w-1 h-7 ml-1 bg-gradient-to-b from-red-500 to-orange-500 align-middle animate-pulse" />
    </span>
  );
};

// --- Main Component ---
const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find the service by ID
  const service = useMemo(() => services.find(s => s.id === id), [id]);

  // If service not found
  if (!id || !service) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
        <div className="text-center p-8 bg-white rounded-xl shadow-md max-w-md mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Service Not Found</h2>
          <p className="text-lg text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate(-1)} // Go back
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ArrowLeft className="inline mr-2" size={18} />
            Go Back
          </button>
        </div>
      </section>
    );
  }

  // Set page title
  useEffect(() => {
    document.title = `${service.title} | Edizo Services`;
  }, [service.title]);

  // Add JSON-LD structured data for SEO - ✅ FIXED URLs
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org', // ✅ Removed trailing spaces
      '@type': 'Service',
      serviceType: service.title,
      description: service.description,
      provider: {
        '@type': 'Organization',
        name: 'Edizo',
        url: 'https://www.edizo.in', // ✅ Removed trailing spaces
      },
      areaServed: 'IN', // India
      category: 'Business Services', // Adjust category as needed
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: `${service.title} Features`,
        itemListElement: service.features.map((feature, index) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: feature,
          },
          position: index + 1,
        })),
      },
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'service-schema';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('service-schema');
      if (existing) document.head.removeChild(existing);
    };
  }, [service]); // Dependency array is correct

  // Get related services data
  const relatedServices = useMemo(() => {
    return service.relatedServices
      .map(relatedId => services.find(s => s.id === relatedId))
      .filter(Boolean) as Service[]; // Filter out undefined
  }, [service.relatedServices]);

  return (
    <>
      {/* Hero Section with Service Image */}
      <div className="relative h-96 overflow-hidden">
        <LazyImage
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
              {service.title}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
              {service.subtitle}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            {/* Back Button */}
            <Link
              to="/services"
              className="inline-flex items-center text-red-600 hover:text-red-800 mb-8 group"
            >
              <ArrowLeft className="mr-1 transition-transform group-hover:-translate-x-1" size={18} />
              <span className="font-medium">Back to Services</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Column - Description & CTA */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">About This Service</h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {service.longDescription}
                </p>

                {/* CTA Banner */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100 mb-12">
                  <h3 className="flex items-center text-xl font-semibold text-gray-900 mb-3">
                    <MessageSquare className="mr-2 text-red-600" size={24} />
                    Let’s Talk
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Ready to bring your {service.title.toLowerCase()} vision to life?
                  </p>
                  <Button to="/contact" variant="primary" size="lg" className="w-full sm:w-auto">
                    Get Free Consultation
                  </Button>
                </div>

                {/* Process Steps */}
                <div className="mb-12">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Settings className="text-blue-600 mr-2" size={24} />
                    Our Process
                  </h3>
                  <div className="space-y-6">
                    {service.process.map((step, index) => (
                      <div key={index} className="flex">
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-gray-900">{step}</h4>
                          <p className="text-gray-600 mt-1">Step {index + 1} of your journey with us.</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Code className="text-blue-600 mr-2" size={24} />
                    Technologies We Use
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {service.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-blue-50 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-1 space-y-8">
                {/* Service Image */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                  <div className="relative h-48">
                    <LazyImage
                      src={service.image}
                      alt={`${service.title} illustration`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      SERVICE
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm">{service.subtitle}</p>
                  </div>
                </div>

                {/* Key Features */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <CheckCircle className="text-green-500 mr-2" size={20} />
                    Key Features
                  </h3>
                  <ul className="space-y-3">
                    {service.features.slice(0, 5).map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Award className="text-yellow-500 mr-2" size={20} />
                    Benefits
                  </h3>
                  <ul className="space-y-3">
                    {service.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Why Choose Edizo (Specific to Service) */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Star className="text-yellow-500 mr-2" size={20} />
                    Why Choose This Service
                  </h3>
                  <ul className="space-y-3">
                    {service.whyChoose.map((item, i) => (
                      <li key={i} className="flex items-center">
                        <div className="mr-2 text-red-600">{item.icon}</div>
                        <span className="text-gray-700">{item.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Related Services */}
            {relatedServices.length > 0 && (
              <div className="mt-20">
                <AnimatedSection>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Related Services</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {relatedServices.map((related) => (
                      <Link
                        key={related.id}
                        to={`/services/${related.id}`}
                        className="block group"
                      >
                        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                          <div className="relative h-40 overflow-hidden">
                            <LazyImage
                              src={related.image}
                              alt={related.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-3 left-3">
                              <span className="text-white text-sm font-semibold px-2 py-1 bg-red-600/80 backdrop-blur-sm rounded">
                                {related.title}
                              </span>
                            </div>
                          </div>
                          <div className="p-5 flex-grow">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                              {related.title}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {related.description}
                            </p>
                          </div>
                          <div className="px-5 pb-5">
                            <span className="text-red-600 text-sm font-semibold flex items-center group-hover:gap-1 transition-all">
                              Learn More
                              <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-all" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </AnimatedSection>
              </div>
            )}
          </AnimatedSection>
        </div>
      </section>
    </>
  );
};

export default ServiceDetails;