// frontend/src/pages/home/ServicesSection.tsx
import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Code, Palette, Smartphone, Video, Server, Bot } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import ServiceCard from './ServiceCard';

// Service Images
import webDevelopment from '../../assets/services/website design.webp';
import uiuxImg from '../../assets/services/uiux.webp';
import appDesignImg from '../../assets/services/app design.webp';

// Service theme icons for decoration (static, not floating)
const themeIcons = [
  { Icon: Code, color: '#22c55e', position: 'top-20 left-10' },
  { Icon: Palette, color: '#f43f5e', position: 'top-32 right-16' },
  { Icon: Smartphone, color: '#8b5cf6', position: 'bottom-24 left-20' },
  { Icon: Video, color: '#f97316', position: 'bottom-16 right-24' },
  { Icon: Server, color: '#06b6d4', position: 'top-1/2 left-8' },
  { Icon: Bot, color: '#ec4899', position: 'top-1/3 right-8' },
];

const ServicesSection = memo(() => {
  const featuredServices = useMemo(() => [
    {
      img: webDevelopment,
      title: "Web Development",
      desc: "Fast, scalable websites with React & Next.js.",
      link: "/services/web-development",
      features: ["Blazing Fast Speeds", "Extensive Coverage", "Reliable Connectivity", "Uptime Guarantee"],
      startingPrice: 15000
    },
    {
      img: uiuxImg,
      title: "UI/UX Design",
      desc: "Human-centered design that users love.",
      link: "/services/ui-ux",
      features: ["Intuitive Interfaces", "User Testing", "Responsive Design", "Accessibility Compliance"],
      startingPrice: 7000
    },
    {
      img: appDesignImg,
      title: "App Development",
      desc: "Cross-platform apps with React Native & Flutter.",
      link: "/services/app-development",
      features: ["Native Performance", "Seamless Integration", "Scalable Architecture", "Push Notifications"],
      startingPrice: 25000
    }
  ], []);

  return (
    <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background gradient orbs - static */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-100/40 to-orange-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-gray-200/50 to-slate-200/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-red-50/30 to-orange-50/30 rounded-full blur-3xl" />
      </div>

      {/* Static service theme icons as decoration */}
      <div className="absolute inset-0 pointer-events-none">
        {themeIcons.map((item, i) => (
          <motion.div
            key={i}
            className={`absolute ${item.position} opacity-[0.06]`}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 0.06, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
          >
            <item.Icon size={60} style={{ color: item.color }} strokeWidth={1} />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <AnimatedSection>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-sm bg-white/70 border border-gray-200 rounded-full mb-6 shadow-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">What We Offer</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Services</span>
            </h2>
            <p className="text-xl text-gray-600">
              Expert solutions loved by clients worldwide
            </p>
          </AnimatedSection>
        </div>

        {/* Services Grid with staggered entrance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
                type: "spring",
                stiffness: 100
              }}
            >
              <ServiceCard {...service} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

ServicesSection.displayName = 'ServicesSection';
export default ServicesSection;