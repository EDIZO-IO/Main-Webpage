// frontend/src/pages/home/WhyChooseSection.tsx
import { memo, useMemo } from 'react';
import { Zap as ZapIcon, Shield as ShieldIcon2, Target as TargetIcon, Sparkles } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full mb-4 shadow-sm">
              <Sparkles className="w-3 h-3 text-red-500" />
              <span className="text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Our Promise</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Edizo?</span>
            </h2>
            <p className="text-gray-600">
              We deliver unmatched results
            </p>
          </AnimatedSection>
        </div>

        {/* Professional Layout - Alternating Rows */}
        <div className="space-y-10 max-w-4xl mx-auto">
          {whyChooseItems.map((item, i) => (
            <div
              key={item.title}
              className={`opacity-0 animate-fade-in-up ${i % 2 === 0 ? 'flex flex-col md:flex-row' : 'flex flex-col md:flex-row-reverse'} items-center gap-8`}
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className="flex-1">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <item.icon size={32} className="text-white" />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 text-lg">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

WhyChooseSection.displayName = 'WhyChooseSection';
export default WhyChooseSection;