// frontend/src/pages/home/WhyChooseSection.tsx
import React, { memo, useMemo } from 'react';
import { Zap as ZapIcon, Shield as ShieldIcon2, Target as TargetIcon } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

const WhyChooseSection = memo(() => {
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

  const WhyChooseItem = ({ icon: Icon, title, desc, gradient, delay }: any) => (
    <AnimatedSection delay={delay}>
      <div
        className="relative p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden"
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
      </div>
    </AnimatedSection>
  );

  return (
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
  );
});

WhyChooseSection.displayName = 'WhyChooseSection';
export default WhyChooseSection;