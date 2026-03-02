import { memo, useEffect, useState } from 'react';
import { AnimatedSection } from './AnimatedSection';
import { ArrowRight, Loader2 } from 'lucide-react';
import Button from '../../components/common/Button';
import { useServices } from '../../hooks/useServices';

const ServicesSection = memo(() => {
  const { services, loading, error } = useServices();
  const [displayServices, setDisplayServices] = useState([]);

  useEffect(() => {
    if (services && services.length > 0) {
      // Take first 3 featured services, or first 3 active services
      const featured = services.filter(s => s.is_featured).slice(0, 3);
      setDisplayServices(featured.length > 0 ? featured : services.slice(0, 3));
    }
  }, [services]);

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading services...</p>
        </div>
      </section>
    );
  }

  if (error || displayServices.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6 text-center">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowRight className="w-10 h-10 text-orange-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Services Coming Soon</h3>
          <p className="text-gray-600 mb-6">We're working on something amazing</p>
          <Button
            onClick={() => window.location.href = '/contact'}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-semibold"
          >
            Get in Touch
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full mb-4 shadow-sm">
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">Our Services</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">Offer</span>
            </h2>
            <p className="text-gray-600">
              Comprehensive digital solutions for your business
            </p>
          </AnimatedSection>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {displayServices.map((service, index) => (
            <AnimatedSection key={service.id} animation="fadeInUp" delay={index * 0.1}>
              <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                {/* Color-coded header instead of image */}
                <div className={`h-3 bg-gradient-to-r ${
                  service.category === 'Development' ? 'from-blue-500 to-blue-600' :
                  service.category === 'Design' ? 'from-purple-500 to-purple-600' :
                  service.category === 'Marketing' ? 'from-orange-500 to-orange-600' :
                  service.category === 'SEO' ? 'from-green-500 to-green-600' :
                  'from-gray-500 to-gray-600'
                }`}></div>

                {/* Content */}
                <div className="p-6">
                  {/* Category Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      service.category === 'Development' ? 'bg-blue-100 text-blue-700' :
                      service.category === 'Design' ? 'bg-purple-100 text-purple-700' :
                      service.category === 'Marketing' ? 'bg-orange-100 text-orange-700' :
                      service.category === 'SEO' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {service.category}
                    </span>
                    {service.is_featured && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-500 to-red-500 text-white">
                        Featured
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {service.title}
                  </h3>
                  {service.subtitle && (
                    <p className="text-sm text-orange-600 font-medium mb-2">
                      {service.subtitle}
                    </p>
                  )}
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {service.short_description}
                  </p>

                  {/* Features */}
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {service.features.slice(0, 3).map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* CTA Button */}
                  <Button
                    onClick={() => window.location.href = `/services/${service.slug}`}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    {service.cta_text || 'Learn More'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* View All Services */}
        <div className="text-center mt-12">
          <AnimatedSection>
            <Button
              onClick={() => window.location.href = '/services'}
              className="bg-white border-2 border-orange-500 text-orange-500 px-8 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-all inline-flex items-center gap-2"
            >
              View All Services
              <ArrowRight className="w-4 h-4" />
            </Button>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
});

ServicesSection.displayName = 'ServicesSection';

export default ServicesSection;
