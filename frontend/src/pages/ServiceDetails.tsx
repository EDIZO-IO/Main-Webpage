// frontend/src/pages/ServiceDetails.tsx

import { useEffect, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Star, Award, CheckCircle, IndianRupee, Mail, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

import AnimatedSection from '../components/common/AnimatedSection';
import Button from '../components/common/Button';
import { services, type Service } from './Services';

import StatsSection from './servicedetails/StatsSection';
import AboutSection from './servicedetails/AboutSection';
import ProcessSection from './servicedetails/ProcessSection';
import TechSection from './servicedetails/TechSection';
import FeatureListSection from './servicedetails/FeatureListSection';
import RelatedServiceCard from './servicedetails/RelatedServiceCard';

// --- Memoized Lazy Image Component ---
import React, { memo } from 'react';
const LazyImage = memo<{ src: string; alt: string; className?: string }>(({ src, alt, className = '' }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    className={className}
    onError={e => {
      const target = e.target as HTMLImageElement;
      target.src = `https://placehold.co/600x400/DEE2E6/495057?text=${encodeURIComponent(alt)}`;
    }}
  />
));
LazyImage.displayName = 'LazyImage';

const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Find service
  const service = useMemo(() => services.find(s => s.id === id), [id]);
  // Related services
  const relatedServices = useMemo(() => {
    if (!service) return [];
    return service.relatedServices
      .map(relatedId => services.find(s => s.id === relatedId))
      .filter(Boolean) as Service[];
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

  // Not found fallback
  if (!id || !service) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-blue-50 py-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center p-10 bg-white rounded-3xl shadow-2xl max-w-md mx-auto border border-gray-100"
        >
          <div className="mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Service Not Found</h2>
          <p className="text-lg text-gray-600 mb-8">
            The service you're looking for doesn't exist or has been moved.
          </p>
          <Button
            onClick={handleGoBack}
            variant="primary"
            size="lg"
            iconLeft={<ArrowLeft size={18} />}
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
      <div className="relative h-[420px] overflow-hidden">
        <LazyImage src={service.image} alt={service.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/30" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3 leading-tight"
          >
            {service.title}
          </motion.h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-6">
            {service.subtitle}
          </p>
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href={`https://wa.me/917092435729?text=${encodeURIComponent(`Hi! I'm interested in your ${service.title} service. Please share more details.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <MessageCircle size={20} />
              <span>WhatsApp Us</span>
            </a>
            <a
              href={`mailto:edizo5491@gmail.com?subject=Inquiry: ${encodeURIComponent(service.title)}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              <Mail size={20} />
              <span>Email Us</span>
            </a>
          </motion.div>
        </div>
      </div>

      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <AnimatedSection><StatsSection /></AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
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
                  icon={<CheckCircle className="text-green-500 mr-2" size={24} />}
                />
              </AnimatedSection>
              <AnimatedSection>
                <FeatureListSection
                  title="Key Benefits"
                  features={service.benefits}
                  icon={<Award className="text-yellow-500 mr-2" size={24} />}
                />
              </AnimatedSection>
              <AnimatedSection>
                <FeatureListSection
                  title="Why Choose Us"
                  features={service.whyChoose.map(item => item.title)}
                  icon={<Star className="text-yellow-500 mr-2" size={24} />}
                />
              </AnimatedSection>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Service Highlight Card */}
              <AnimatedSection>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-lg border border-red-100 overflow-hidden sticky top-24"
                >
                  <div className="relative h-48">
                    <LazyImage
                      src={service.image}
                      alt={`${service.title} illustration`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                      <Star size={14} className="fill-current" />
                      <span>TOP SERVICE</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.subtitle}</p>

                    {/* Starting Price Display */}
                    <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Starting from</p>
                      <div className="flex items-center gap-1 text-2xl font-bold text-green-700">
                        <IndianRupee className="w-6 h-6" />
                        <span>{service.startingPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">* Final pricing varies based on project scope and features</p>
                    </div>

                    {/* Direct Contact Options */}
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Get a Quote - Contact Us Directly</p>

                      {/* Email Button */}
                      <a
                        href={`mailto:edizo5491@gmail.com?subject=Service Inquiry: ${encodeURIComponent(service.title)}&body=${encodeURIComponent(`Hi Edizo Team,\n\nI am interested in your ${service.title} service.\n\nService Details:\n- Service: ${service.title}\n- Starting Price: ₹${service.startingPrice.toLocaleString('en-IN')}\n\nMy Details:\n- Name: \n- Company/Project: \n- Contact Number: \n- Requirements: \n\nPlease provide a detailed quote for my requirements.\n\nThank you!`)}`}
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                      >
                        <Mail className="w-5 h-5" />
                        <span>Email Us</span>
                      </a>

                      {/* WhatsApp Button */}
                      <a
                        href={`https://wa.me/917092435729?text=${encodeURIComponent(`Hi Edizo Team!\n\nI am interested in your *${service.title}* service.\n\n*Service Details:*\n• Service: ${service.title}\n• Starting Price: ₹${service.startingPrice.toLocaleString('en-IN')}\n\n*My Details:*\n• Name: \n• Project/Company: \n• Requirements: \n\nPlease share more details and a quote.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all duration-300"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>WhatsApp Us</span>
                      </a>

                      <p className="text-xs text-center text-gray-500 mt-3">
                        📧 edizo5491@gmail.com | 📱 +91 7092435729
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            </div>
          </div>

          {/* Related Services */}
          {relatedServices.length > 0 && (
            <div className="mt-24">
              <AnimatedSection>
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">Related Services</h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Explore other services that complement {service.title.toLowerCase()}
                  </p>
                </div>
              </AnimatedSection>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
