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
    <section className="py-16 bg-gradient-to-r from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Simple background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-50 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-full mb-4">
              <Sparkles className="w-3 h-3 text-red-500" />
              <span className="text-xs font-semibold text-red-700">Our Promise</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Edizo?</span>
            </h2>
            <p className="text-lg text-gray-600">
              We deliver unmatched results
            </p>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {whyChooseItems.map((item, i) => (
            <div
              key={item.title}
              className="opacity-0 animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
            >
              <div className="relative p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 h-full">
                {/* Icon */}
                <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                  <item.icon size={24} className="text-white" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
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