// frontend/src/pages/home/Hero.tsx
import { memo, useState, useEffect, useMemo } from 'react';
import { Sparkles, ArrowRight, CheckCircle, Code, Palette, Smartphone, Zap, Play, Star, Bot, Video, Globe, Award, Users, TrendingUp } from 'lucide-react';
import Button from '../../components/common/Button';
import { AnimatedSection } from './AnimatedSection';
import { useStats } from '../../hooks/useStats';
import useReveal from '../../hooks/useReveal';

// Typewriter phrases
const phrases = [
  "Creative Services & Real-World Learning",
  "Design Excellence & Innovation",
  "Web Development & App Solutions",
  "UI/UX Design & Digital Marketing",
  "Professional Internships & Training"
];

// Typewriter Component - Optimized
const TypewriterText = memo(() => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    const typeSpeed = isDeleting ? 20 : 150;
    const pauseDuration = 1000;

    if (isPaused) {
      const pauseTimeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(pauseTimeout);
    }

    const typeTimeout = setTimeout(() => {
      if (!isDeleting) {
        if (text.length < currentPhrase.length) {
          setText(currentPhrase.slice(0, text.length + 2));
        } else {
          setIsPaused(true);
        }
      } else {
        if (text.length > 0) {
          setText(text.slice(0, -1));
        } else {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(typeTimeout);
  }, [text, isDeleting, phraseIndex, isPaused]);

  return (
    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">
      {text}
      <span className="animate-pulse">|</span>
    </span>
  );
});

TypewriterText.displayName = 'TypewriterText';

// Stats Data
const statIcons = {
  projects_delivered: TrendingUp,
  client_rating: Star,
  on_time_delivery: CheckCircle,
  satisfaction_rate: Award,
  happy_clients: Users,
  years_experience: Award,
  students_trained: Users,
  programs_count: Code,
  certification_rate: Award
};

const Hero = memo(() => {
  const { stats, loading } = useStats('general');
  const { textRef, revealOnScroll } = useReveal();

  // Default stats if API doesn't return data
  const defaultStats = [
    { key: 'projects_delivered', value: '100+', label: 'Projects Done' },
    { key: 'client_rating', value: '4.9/5', label: 'Client Rating' },
    { key: 'on_time_delivery', value: 'On Time', label: 'Delivery' },
    { key: 'satisfaction_rate', value: '100%', label: 'Satisfaction' },
    { key: 'happy_clients', value: '10+', label: 'Happy Clients' },
    { key: 'years_experience', value: '2+', label: 'Years Experience' }
  ];

  const displayStats = loading || !stats || stats.length === 0 ? defaultStats : stats;

  const featureItems = useMemo(() => [
    { icon: Code, text: "Custom Web Solutions" },
    { icon: Palette, text: "Modern UI/UX Design" },
    { icon: Smartphone, text: "Mobile App Development" },
    { icon: Zap, text: "Fast & Scalable" },
  ], []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <AnimatedSection animation="fadeInLeft">
            <div className="text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-full mb-6 shadow-sm">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-semibold text-gray-700">Welcome to Edizo</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                We Deliver{' '}
                <TypewriterText />
              </h1>

              {/* Subtitle */}
              <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
                Transform your ideas into reality with our expert team. We specialize in creating stunning digital experiences that drive results.
              </p>

              {/* Features List */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {featureItems.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-gray-700 font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-12">
                <Button
                  onClick={() => window.location.href = '/services'}
                  className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-orange-500/30 transition-all flex items-center gap-2"
                >
                  Explore Services
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button
                  onClick={() => window.location.href = '/contact'}
                  className="bg-white border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-xl font-semibold hover:bg-orange-50 transition-all flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Get in Touch
                </Button>
              </div>

              {/* Statistics from API */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {displayStats.slice(0, 6).map((stat, index) => {
                  const IconComponent = statIcons[stat.key] || TrendingUp;
                  return (
                    <div
                      key={stat.key}
                      ref={index === 0 ? textRef : null}
                      className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-orange-100 hover:border-orange-300 hover:shadow-lg transition-all"
                    >
                      <IconComponent className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </AnimatedSection>

          {/* Right Content - Hero Image/Illustration */}
          <AnimatedSection animation="fadeInRight">
            <div className="relative lg:h-[600px] flex items-center justify-center">
              {/* Main Hero Circle */}
              <div className="relative w-full max-w-lg aspect-square">
                {/* Concentric Circles */}
                <div className="absolute inset-0 border-2 border-orange-200 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-8 border-2 border-red-200 rounded-full animate-spin-slow-reverse"></div>
                <div className="absolute inset-16 border-2 border-orange-100 rounded-full animate-spin-slow"></div>
                
                {/* Center Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/30">
                    <Globe className="w-24 h-24 text-white" />
                  </div>
                </div>

                {/* Floating Icons */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 bg-white p-4 rounded-2xl shadow-xl border border-orange-100">
                  <Code className="w-8 h-8 text-orange-500" />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 bg-white p-4 rounded-2xl shadow-xl border border-orange-100">
                  <Palette className="w-8 h-8 text-red-500" />
                </div>
                <div className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 bg-white p-4 rounded-2xl shadow-xl border border-orange-100">
                  <Smartphone className="w-8 h-8 text-orange-500" />
                </div>
                <div className="absolute right-0 top-1/2 translate-x-4 -translate-y-1/2 bg-white p-4 rounded-2xl shadow-xl border border-orange-100">
                  <Zap className="w-8 h-8 text-red-500" />
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-orange-500 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-orange-500 rounded-full animate-scroll"></div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes scroll {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 25s linear infinite;
        }
        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
