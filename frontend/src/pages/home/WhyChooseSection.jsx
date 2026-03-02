import { memo, useMemo } from 'react';
import { Zap as ZapIcon, Shield as ShieldIcon2, Target as TargetIcon, Sparkles, Award, Users, CheckCircle, TrendingUp } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { useStats } from '../../hooks/useStats';

const WhyChooseSection = memo(() => {
  const { stats, loading } = useStats('general');

  const defaultStats = [
    { key: 'projects_delivered', value: '100+', label: 'Projects Done' },
    { key: 'client_rating', value: '4.9/5', label: 'Client Rating' },
    { key: 'on_time_delivery', value: 'On Time', label: 'Delivery' },
    { key: 'satisfaction_rate', value: '100%', label: 'Satisfaction' },
    { key: 'happy_clients', value: '10+', label: 'Happy Clients' },
    { key: 'years_experience', value: '2+', label: 'Years Experience' }
  ];

  const displayStats = loading || stats.length === 0 ? defaultStats : stats;

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

  const statIcons = {
    projects_delivered: TrendingUp,
    client_rating: Award,
    on_time_delivery: CheckCircle,
    satisfaction_rate: Users,
    happy_clients: Users,
    years_experience: Award
  };

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

        {/* Why Choose Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {whyChooseItems.map((item, index) => (
            <AnimatedSection key={index} animation="fadeInUp">
              <div className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${item.gradient}`}></div>
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${item.gradient} text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Statistics from API */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {displayStats.slice(0, 6).map((stat, index) => {
            const IconComponent = statIcons[stat.key] || Award;
            return (
              <AnimatedSection key={stat.key} animation="fadeInUp" delay={index * 0.1}>
                <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:border-orange-200 hover:shadow-lg transition-all">
                  <IconComponent className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                  <div className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
});

WhyChooseSection.displayName = 'WhyChooseSection';

export default WhyChooseSection;
