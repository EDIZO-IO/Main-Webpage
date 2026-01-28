// frontend/src/pages/home/ServicesSection.tsx
import { memo, useMemo } from 'react';
import { AnimatedSection } from './AnimatedSection';
import { ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';

// Service Images
import webDevelopment from '../../assets/services/website design.webp';
import uiuxImg from '../../assets/services/uiux.webp';
import appDesignImg from '../../assets/services/app design.webp';

const ServicesSection = memo(() => {
  const featuredServices = useMemo(() => [
    {
      img: webDevelopment,
      title: "Web Development",
      desc: "Fast, scalable websites with React & Next.js.",
      link: "/services/web-development",
      features: ["Blazing Fast Speeds", "Extensive Coverage", "Reliable Connectivity", "Uptime Guarantee"],
      startingPrice: "$999"
    },
    {
      img: uiuxImg,
      title: "UI/UX Design",
      desc: "Human-centered design that users love.",
      link: "/services/ui-ux",
      features: ["Intuitive Interfaces", "User Testing", "Responsive Design", "Accessibility Compliance"],
      startingPrice: "$799"
    },
    {
      img: appDesignImg,
      title: "App Development",
      desc: "Cross-platform apps with React Native & Flutter.",
      link: "/services/app-development",
      features: ["Native Performance", "Seamless Integration", "Scalable Architecture", "Push Notifications"],
      startingPrice: "$1499"
    }
  ], []);

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full mb-6 shadow-sm">
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">What We Offer</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Services</span>
            </h2>
            <p className="text-lg text-gray-600">
              Expert solutions loved by clients worldwide
            </p>
          </AnimatedSection>
        </div>

        {/* Services List - Professional Layout */}
        <div className="space-y-10 max-w-4xl mx-auto">
          {featuredServices.map((service, index) => (
            <div
              key={service.title}
              className="scroll-reveal opacity-0 translate-y-10 transition-all duration-700 ease-out bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="md:col-span-1">
                  <img
                    src={service.img}
                    alt={service.title}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div className="md:col-span-2 p-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-4">{service.desc}</p>

                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Features:</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button
                    to={service.link}
                    variant="primary"
                    size="md"
                    iconRight={<ArrowRight className="w-4 h-4" />}
                    className="rounded-xl"
                    style={{
                      background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
                    }}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            to="/services"
            variant="primary"
            size="lg"
            className="rounded-xl"
            style={{
              background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
            }}
          >
            View All Services
          </Button>
        </div>
      </div>
    </section>
  );
});

ServicesSection.displayName = 'ServicesSection';
export default ServicesSection;