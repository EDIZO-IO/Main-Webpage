// src/pages/ServiceDetails.tsx
import { useEffect, useMemo, memo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Code,
  Palette,
  Zap,
  Star,
  MessageSquare,
  Award,
  Settings,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Target,
  Clock,
} from 'lucide-react';
import { motion } from 'framer-motion';

import AnimatedSection from '../components/common/AnimatedSection';
import Button from '../components/common/Button';
import { services, type Service } from './Services';

// --- Memoized Lazy Image Component ---
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

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

// --- Memoized Process Step Component ---
const ProcessStep = memo<{ step: string; index: number; total: number }>(
  ({ step, index, total }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex items-start group"
    >
      <div className="flex-shrink-0 mr-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
            {index + 1}
          </div>
          {index < total - 1 && (
            <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-gradient-to-b from-red-300 to-transparent" />
          )}
        </div>
      </div>
      <div className="flex-1 pt-2">
        <h4 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
          {step}
        </h4>
        <p className="text-gray-600 text-sm">
          Step {index + 1} of {total} in your journey
        </p>
      </div>
    </motion.div>
  )
);
ProcessStep.displayName = 'ProcessStep';

// --- Memoized Technology Badge ---
const TechnologyBadge = memo<{ tech: string; index: number }>(({ tech, index }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.2, delay: index * 0.05 }}
    whileHover={{ scale: 1.05, y: -2 }}
    className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 rounded-full text-sm font-medium border border-blue-200 shadow-sm hover:shadow-md transition-all cursor-default"
  >
    {tech}
  </motion.span>
));
TechnologyBadge.displayName = 'TechnologyBadge';

// --- Memoized Feature List Item ---
const FeatureListItem = memo<{ feature: string; index: number }>(({ feature, index }) => (
  <motion.li
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.2, delay: index * 0.05 }}
    className="flex items-start group"
  >
    <CheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" size={18} />
    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">{feature}</span>
  </motion.li>
));
FeatureListItem.displayName = 'FeatureListItem';

// --- Memoized Related Service Card ---
const RelatedServiceCard = memo<{ service: Service; index: number }>(({ service, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay: index * 0.1 }}
  >
    <Link to={`/services/${service.id}`} className="block group h-full">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:border-red-200 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <LazyImage
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="text-white text-sm font-bold px-3 py-1.5 bg-red-600/90 backdrop-blur-sm rounded-full inline-block shadow-lg">
              {service.title}
            </span>
          </div>
        </div>
        <div className="p-6 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
            {service.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
            {service.description}
          </p>
          <div className="flex items-center text-red-600 font-semibold text-sm group-hover:gap-2 transition-all">
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
));
RelatedServiceCard.displayName = 'RelatedServiceCard';

// --- Memoized Stats Counter ---
const StatsSection = memo(() => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
    {[
      { icon: <TrendingUp className="w-6 h-6" />, value: "100+", label: "Projects Done", color: "blue" },
      { icon: <Star className="w-6 h-6" />, value: "4.9/5", label: "Client Rating", color: "yellow" },
      { icon: <Clock className="w-6 h-6" />, value: "On Time", label: "Delivery", color: "green" },
      { icon: <Target className="w-6 h-6" />, value: "100%", label: "Satisfaction", color: "red" }
    ].map((stat, index) => (
      <motion.div
        key={stat.label}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 p-6 rounded-xl border border-${stat.color}-200 text-center shadow-sm hover:shadow-md transition-all`}
      >
        <div className={`flex justify-center mb-2 text-${stat.color}-600`}>
          {stat.icon}
        </div>
        <div className={`text-2xl font-bold text-${stat.color}-700 mb-1`}>{stat.value}</div>
        <div className="text-sm text-gray-600">{stat.label}</div>
      </motion.div>
    ))}
  </div>
));
StatsSection.displayName = 'StatsSection';

// --- Main Component ---
const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ✅ Memoize service lookup
  const service = useMemo(() => services.find(s => s.id === id), [id]);

  // ✅ Memoize related services
  const relatedServices = useMemo(() => {
    if (!service) return [];
    return service.relatedServices
      .map(relatedId => services.find(s => s.id === relatedId))
      .filter(Boolean) as Service[];
  }, [service]);

  // ✅ Memoized callbacks
  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Set page title
  useEffect(() => {
    if (service) {
      document.title = `${service.title} | Edizo Services`;
    }
  }, [service]);

  // Add JSON-LD structured data for SEO
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

  // If service not found
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
      <div className="relative h-[500px] overflow-hidden">
        <LazyImage
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/5"
              style={{
                width: `${100 + i * 50}px`,
                height: `${100 + i * 50}px`,
                left: `${20 + i * 25}%`,
                top: `${20 + i * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 5 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6"
            >
              <Sparkles className="w-5 h-5 text-red-400" />
              <span className="text-white/90 text-sm font-semibold">Professional Service</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              {service.title}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
              {service.subtitle}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                to="/contact"
                variant="primary"
                size="lg"
                iconRight={<ArrowRight size={20} />}
                className="shadow-2xl hover:shadow-3xl"
              >
                Get Started Now
              </Button>
              <Button
                to="/services"
                variant="secondary"
                size="lg"
                iconLeft={<ArrowLeft size={20} />}
                className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                All Services
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Section */}
          <AnimatedSection>
            <StatsSection />
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* About Section */}
              <AnimatedSection>
                <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <Sparkles className="text-red-600 mr-3" size={28} />
                    About This Service
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {service.longDescription}
                  </p>
                </div>
              </AnimatedSection>

              {/* Process Steps */}
              <AnimatedSection>
                <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                  <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                    <Settings className="text-blue-600 mr-3" size={28} />
                    Our Process
                  </h3>
                  <div className="space-y-8">
                    {service.process.map((step, index) => (
                      <ProcessStep
                        key={index}
                        step={step}
                        index={index}
                        total={service.process.length}
                      />
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              {/* Technologies */}
              <AnimatedSection>
                <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-100">
                  <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
                    <Code className="text-purple-600 mr-3" size={28} />
                    Technologies We Use
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {service.technologies.map((tech, index) => (
                      <TechnologyBadge key={index} tech={tech} index={index} />
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              {/* CTA Banner */}
              <AnimatedSection>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 rounded-2xl p-10 text-white shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                      backgroundSize: '40px 40px'
                    }} />
                  </div>
                  <div className="relative z-10">
                    <h3 className="flex items-center text-3xl font-bold mb-4">
                      <MessageSquare className="mr-3" size={32} />
                      Ready to Get Started?
                    </h3>
                    <p className="text-xl mb-8 text-white/90">
                      Let's transform your vision into reality. Get a free consultation today!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        to="/contact"
                        variant="secondary"
                        size="xl"
                        iconRight={<ArrowRight size={20} />}
                        className="bg-white text-red-600 hover:bg-gray-50 shadow-lg"
                      >
                        Get Free Consultation
                      </Button>
                      <Button
                        href="tel:+1234567890"
                        variant="outline"
                        size="xl"
                        className="border-white/50 text-white hover:bg-white/10"
                      >
                        Call Us Now
                      </Button>
                    </div>
                  </div>
                </motion.div>
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
                    <p className="text-gray-600 mb-6">{service.subtitle}</p>
                    <Button
                      to="/contact"
                      variant="primary"
                      size="lg"
                      iconRight={<ArrowRight size={18} />}
                      className="w-full shadow-lg"
                    >
                      Request Quote
                    </Button>
                  </div>
                </motion.div>
              </AnimatedSection>

              {/* Key Features */}
              <AnimatedSection>
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <CheckCircle className="text-green-500 mr-2" size={24} />
                    Key Features
                  </h3>
                  <ul className="space-y-3">
                    {service.features.slice(0, 6).map((feature, i) => (
                      <FeatureListItem key={i} feature={feature} index={i} />
                    ))}
                  </ul>
                </div>
              </AnimatedSection>

              {/* Benefits */}
              <AnimatedSection>
                <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Award className="text-yellow-500 mr-2" size={24} />
                    Key Benefits
                  </h3>
                  <ul className="space-y-3">
                    {service.benefits.map((benefit, i) => (
                      <FeatureListItem key={i} feature={benefit} index={i} />
                    ))}
                  </ul>
                </div>
              </AnimatedSection>

              {/* Why Choose */}
              <AnimatedSection>
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-md border border-purple-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Star className="text-yellow-500 mr-2" size={24} />
                    Why Choose Us
                  </h3>
                  <ul className="space-y-4">
                    {service.whyChoose.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.2, delay: i * 0.05 }}
                        className="flex items-center group"
                      >
                        <div className="mr-3 text-red-600 group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                          {item.title}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            </div>
          </div>

          {/* Related Services */}
          {relatedServices.length > 0 && (
            <div className="mt-24">
              <AnimatedSection>
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">
                    Related Services
                  </h2>
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
