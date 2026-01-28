// frontend/src/pages/ServiceDetails.jsx

import { useEffect, useMemo, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Star, Award, CheckCircle, Mail, MessageCircle, ExternalLink, Heart, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

import AnimatedSection from '../components/common/AnimatedSection.jsx';
import Button from '../components/common/Button.jsx';
import { services } from './Services.jsx';

import StatsSection from './servicedetails/StatsSection.jsx';
import AboutSection from './servicedetails/AboutSection.jsx';
import ProcessSection from './servicedetails/ProcessSection.jsx';
import TechSection from './servicedetails/TechSection.jsx';
import FeatureListSection from './servicedetails/FeatureListSection.jsx';
import RelatedServiceCard from './servicedetails/RelatedServiceCard.jsx';

// --- Memoized Lazy Image Component ---
import React, { memo } from 'react';
const LazyImage = memo(({ src, alt, className = '' }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    className={className}
    onError={e => {
      const target = e.target;
      target.src = `https://placehold.co/600x400/DEE2E6/495057?text=${encodeURIComponent(alt)}`;
    }}
  />
));
LazyImage.displayName = 'LazyImage';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Find service
  const service = useMemo(() => services.find(s => s.id === id), [id]);

  // Related services
  const relatedServices = useMemo(() => {
    if (!service) return [];
    return service.relatedServices
      .map(relatedId => services.find(s => s.id === relatedId))
      .filter(Boolean);
  }, [service]);

  const handleGoBack = useCallback(() => navigate(-1), [navigate]);

  // Set page title
  useEffect(() => {
    if (service) document.title = `${service.title} | Edizo Services`;
  }, [service]);

  // SEO structured data
  useEffect(() => {
    if (!service) return;

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: service.title,
      description: service.description,
      provider: {
        '@type': 'Organization',
        name: 'Edizo',
        url: 'https://www.edizo.in',
      },
      areaServed: 'IN',
      category: 'Business Services',
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
  }, [service]);

  // Handle image load
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Toggle favorite
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Share service
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: service?.title,
          text: service?.subtitle,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing failed', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Not found fallback
  if (!id || !service) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-50 py-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center p-8 bg-white max-w-md mx-auto border border-gray-200"
        >
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Service Not Found</h2>
          <p className="text-base text-gray-600 mb-8">
            The service you're looking for doesn't exist or has been moved.
          </p>
          <Button
            onClick={handleGoBack}
            variant="primary"
            size="md"
            iconLeft={<ArrowLeft size={16} />}
          >
            Go Back
          </Button>
        </motion.div>
      </section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden bg-white">
        <LazyImage
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
          onLoad={handleImageLoad}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/50" />

        {/* Favorite and Share Buttons */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={toggleFavorite}
            className="p-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart
              className={isFavorite ? "fill-current text-red-500" : ""}
              size={18}
            />
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors"
            aria-label="Share service"
          >
            <Share2 size={18} />
          </button>
        </div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 leading-tight"
          >
            {service.title}
          </motion.h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-6">
            {service.subtitle}
          </p>
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <a
              href={`https://wa.me/917092435729?text=${encodeURIComponent(`Hi! I'm interested in your ${service.title} service. Please share more details.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <MessageCircle size={18} />
              <span>WhatsApp Us</span>
            </a>
            <a
              href={`mailto:edizoofficial@gmail.com?subject=Inquiry: ${encodeURIComponent(service.title)}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <Mail size={18} />
              <span>Email Us</span>
            </a>
          </motion.div>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <AnimatedSection><StatsSection /></AnimatedSection>

          <div className="space-y-10">
            {/* Main Content */}
            <div className="space-y-10">
              <AnimatedSection>
                <AboutSection longDescription={service.longDescription} />
              </AnimatedSection>
              <AnimatedSection>
                <ProcessSection process={service.process} />
              </AnimatedSection>
              <AnimatedSection>
                <TechSection technologies={service.technologies} />
              </AnimatedSection>
              <AnimatedSection>
                <FeatureListSection
                  title="Key Features"
                  features={service.features}
                  icon={<CheckCircle className="text-green-600 mr-2" size={20} />}
                />
              </AnimatedSection>
              <AnimatedSection>
                <FeatureListSection
                  title="Key Benefits"
                  features={service.benefits}
                  icon={<Award className="text-amber-600 mr-2" size={20} />}
                />
              </AnimatedSection>
              <AnimatedSection>
                <FeatureListSection
                  title="Why Choose Us"
                  features={service.whyChoose.map(item => item.title)}
                  icon={<Star className="text-amber-600 mr-2" size={20} />}
                />
              </AnimatedSection>

            </div>

            {/* Contact Section */}
            <div className="bg-gray-50 p-6 border border-gray-200">
              <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Ready to get started?</h3>
                <p className="text-gray-700 mb-5">Contact us today for a free consultation and quote</p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`mailto:edizoofficial@gmail.com?subject=Service Inquiry: ${encodeURIComponent(service.title)}&body=${encodeURIComponent(`Hi Edizo Team,\n\nI am interested in your ${service.title} service.\n\nMy Details:\n- Name: \n- Company/Project: \n- Contact Number: \n- Requirements: \n\nPlease provide more details about this service.\n\nThank you!`)}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <Mail size={18} />
                    <span>Email Us</span>
                  </a>

                  <a
                    href={`https://wa.me/917092435729?text=${encodeURIComponent(`Hi Edizo Team!\n\nI am interested in your *${service.title}* service.\n\n*My Details:*\n• Name: \n• Project/Company: \n• Requirements: \n\nPlease share more details.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <MessageCircle size={18} />
                    <span>WhatsApp Us</span>
                  </a>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    📧 edizoofficial@gmail.com | 📱 +91 7092435729
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing Info */}
            <div className="bg-gray-50 p-5 border border-gray-200">
              <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Award className="text-amber-600" size={18} />
                Starting From
              </h3>
              <p className="text-2xl font-bold text-amber-600">
                {service.startingPrice ? `₹${service.startingPrice.toLocaleString()}` : 'Custom Quote'}
              </p>
              <p className="text-sm text-gray-600 mt-1">Prices vary based on project requirements</p>
            </div>
          </div>

          {/* Related Services */}
          {relatedServices.length > 0 && (
            <div className="mt-16">
              <AnimatedSection>
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">Related Services</h2>
                  <p className="text-lg text-gray-600 max-w-xl mx-auto">
                    Explore other services that complement {service.title.toLowerCase()}
                  </p>
                </div>
              </AnimatedSection>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedServices.map((related, index) => (
                  <RelatedServiceCard key={related.id} service={related} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ServiceDetails;
