// frontend/src/pages/home/WhyChooseSection.tsx
import { memo, useMemo } from 'react';
import { Zap as ZapIcon, Shield as ShieldIcon2, Target as TargetIcon, Code, Palette, Video, Server, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedSection } from './AnimatedSection';

// Service theme icons for subtle background decoration
const decorIcons = [
  { Icon: Code, color: '#22c55e' },
  { Icon: Palette, color: '#f43f5e' },
  { Icon: Video, color: '#f97316' },
  { Icon: Server, color: '#8b5cf6' },
];

const WhyChooseSection = memo(() => {
  const whyChooseItems = useMemo(() => [
    {
      icon: ZapIcon,
      title: "Fast Delivery",
      desc: "On schedule — every time.",
      gradient: "from-red-500 to-orange-500"
    },
    {
      icon: ShieldIcon2,
      title: "100% Satisfaction",
      desc: "We revise until you're thrilled.",
      gradient: "from-orange-500 to-amber-500"
    },
    {
      icon: TargetIcon,
      title: "Results-Driven",
      desc: "Optimized for growth & impact.",
      gradient: "from-red-600 to-rose-500"
    },
  ], []);

  const WhyChooseItem = ({ icon: Icon, title, desc, gradient, index }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.15, type: "spring", stiffness: 100 }}
    >
      <motion.div
        whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.18)" }}
        transition={{ duration: 0.3 }}
        className="relative p-8 backdrop-blur-sm bg-white/90 rounded-3xl border border-gray-200 shadow-lg overflow-hidden group h-full"
      >
        {/* Hover gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

        {/* Icon with scale animation on hover */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`relative w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}
        >
          <Icon size={32} className="text-white" />
        </motion.div>

        <div className="relative">
          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-orange-500 transition-all duration-300">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{desc}</p>
        </div>

        {/* Corner decoration */}
        <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl ${gradient} opacity-5 rounded-tl-full group-hover:w-32 group-hover:h-32 transition-all duration-300`} />
      </motion.div>
    </motion.div>
  );

  return (
    <section className="py-24 bg-gradient-to-r from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-red-100/20 to-orange-100/20 rounded-full blur-3xl" />
      </div>

      {/* Static service icons as subtle decoration */}
      <div className="absolute inset-0 pointer-events-none">
        {decorIcons.map((item, i) => (
          <motion.div
            key={i}
            className="absolute opacity-[0.04]"
            style={{
              top: `${20 + i * 20}%`,
              left: i % 2 === 0 ? '5%' : 'auto',
              right: i % 2 === 1 ? '5%' : 'auto',
              color: item.color,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 0.04, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
          >
            <item.Icon size={50} strokeWidth={1} />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <AnimatedSection>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-full mb-6 shadow-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Sparkles className="w-4 h-4 text-red-500" />
              <span className="text-sm font-semibold text-red-700">Our Promise</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Edizo?</span>
            </h2>
            <p className="text-xl text-gray-600">
              We deliver unmatched results
            </p>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {whyChooseItems.map((item, i) => (
            <WhyChooseItem key={item.title} {...item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
});

WhyChooseSection.displayName = 'WhyChooseSection';
export default WhyChooseSection;