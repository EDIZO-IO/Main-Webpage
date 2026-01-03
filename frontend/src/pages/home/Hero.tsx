// frontend/src/pages/home/Hero.tsx
import { memo, useState, useEffect, useMemo } from 'react';
import { Sparkles, ArrowRight, CheckCircle, Code, Palette, Smartphone, Zap, Play, Star, Bot, Video, Globe } from 'lucide-react';
import Button from '../../components/common/Button';
import { AnimatedSection } from './AnimatedSection';
import { useStats } from '../../components/hooks/useStats';

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
    const typeSpeed = isDeleting ? 30 : 80;
    const pauseDuration = 2000;

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
          setText(currentPhrase.slice(0, text.length + 1));
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
  }, [text, isDeleting, isPaused, phraseIndex]);

  return (
    <span className="inline-block min-h-[1.5em]">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
        {text}
      </span>
      <span className="inline-block w-[3px] h-[1em] bg-gradient-to-b from-red-500 to-orange-500 ml-1 align-middle animate-pulse" />
    </span>
  );
});
TypewriterText.displayName = 'TypewriterText';

// Simplified Floating Service Icon - CSS animations instead of framer-motion
const FloatingServiceIcon = memo(({
  icon: Icon,
  gradient,
  animationDelay = '0s'
}: {
  icon: React.ElementType;
  gradient: string;
  animationDelay?: string;
}) => (
  <div
    className="p-4 rounded-2xl backdrop-blur-xl border border-white/30 shadow-xl animate-float"
    style={{
      background: 'rgba(255, 255, 255, 0.15)',
      animationDelay
    }}
  >
    <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
      <Icon className="w-6 h-6 text-white" strokeWidth={2} />
    </div>
  </div>
));
FloatingServiceIcon.displayName = 'FloatingServiceIcon';

const Hero = memo(() => {
  const { stats } = useStats();

  const statsData = useMemo(() => [
    { value: stats.happy_clients?.value || '10+', label: stats.happy_clients?.label || 'Happy Clients', icon: CheckCircle },
    { value: stats.projects_delivered?.value || '25+', label: stats.projects_delivered?.label || 'Projects Done', icon: Code },
    { value: stats.client_rating?.value || '5.0', label: stats.client_rating?.label || 'Client Rating', icon: Star },
    { value: stats.students_trained?.value || '500+', label: stats.students_trained?.label || 'Students Trained', icon: Bot },
  ], [stats]);

  const leftIcons = useMemo(() => [
    { icon: Code, gradient: 'from-green-400 to-emerald-600', delay: '0s' },
    { icon: Palette, gradient: 'from-pink-400 to-rose-600', delay: '0.5s' },
    { icon: Bot, gradient: 'from-cyan-400 to-blue-600', delay: '1s' },
    { icon: Video, gradient: 'from-orange-400 to-red-600', delay: '1.5s' },
  ], []);

  const rightIcons = useMemo(() => [
    { icon: Globe, gradient: 'from-teal-400 to-emerald-600', delay: '0.25s' },
    { icon: Smartphone, gradient: 'from-purple-400 to-violet-600', delay: '0.75s' },
    { icon: Zap, gradient: 'from-yellow-400 to-orange-600', delay: '1.25s' },
  ], []);

  return (
    <section className="relative min-h-screen overflow-hidden" aria-labelledby="hero-title">
      {/* Video Background - optimized with preload */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/assets/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay with Gradient - Static */}
      <div className="absolute inset-0 z-[1]" style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.85) 50%, rgba(15, 23, 42, 0.95) 100%)'
      }} />

      {/* Static Gradient Decorations - No animation */}
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] -top-48 -left-48 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, transparent 60%)' }}
        />
        <div
          className="absolute w-[500px] h-[500px] top-1/2 -right-32 rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(239, 68, 68, 0.35) 0%, transparent 60%)' }}
        />
        <div
          className="absolute w-[400px] h-[400px] -bottom-32 left-1/3 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 60%)' }}
        />
      </div>

      {/* Floating Service Icons - Left Side */}
      <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-5 z-[5]">
        {leftIcons.map((item, i) => (
          <FloatingServiceIcon key={i} icon={item.icon} gradient={item.gradient} animationDelay={item.delay} />
        ))}
      </div>

      {/* Floating Service Icons - Right Side */}
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-5 z-[5]">
        {rightIcons.map((item, i) => (
          <FloatingServiceIcon key={i} icon={item.icon} gradient={item.gradient} animationDelay={item.delay} />
        ))}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-12 relative z-10 pt-32 pb-20 md:pt-40 md:pb-32 min-h-screen flex items-center">
        <div className="w-full max-w-5xl mx-auto">
          <AnimatedSection>
            {/* Central Glass Card */}
            <div
              className="relative p-8 md:p-12 lg:p-16 rounded-[2.5rem] overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 25px 80px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Inner Decorations */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-500/20 to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-red-500/20 to-transparent rounded-tr-full" />

              {/* Content */}
              <div className="relative z-10 text-center">
                {/* Brand Badge */}
                <div
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-8"
                  style={{
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.25) 0%, rgba(239, 68, 68, 0.25) 100%)',
                    border: '1px solid rgba(249, 115, 22, 0.4)',
                  }}
                >
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-spin-slow" />
                  <span className="text-sm font-bold text-white/90">Design.Develop.Learn</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
                </div>

                {/* Main Title */}
                <h1
                  id="hero-title"
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
                >
                  <span className="text-white">Welcome to </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-orange-500">
                    EDIZO
                  </span>
                </h1>

                {/* Typewriter */}
                <div className="text-xl md:text-2xl lg:text-3xl text-white/80 font-medium mb-6">
                  <TypewriterText />
                </div>

                {/* Description */}
                <p className="text-base md:text-lg text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto">
                  Empowering brands with{' '}
                  <span className="font-bold text-orange-400">creative design</span>,{' '}
                  <span className="font-bold text-red-400">reliable development</span>, and{' '}
                  <span className="font-bold text-orange-300">impactful digital solutions</span>
                  {' '}— built with precision, passion, and trust.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                  <Button
                    to="/services"
                    variant="primary"
                    size="lg"
                    iconRight={<ArrowRight className="w-5 h-5" />}
                    className="px-8 py-4 text-lg font-bold rounded-2xl shadow-2xl hover:scale-105 transition-transform"
                    style={{
                      background: "linear-gradient(135deg, rgba(249, 115, 22, 0.95) 0%, rgba(239, 68, 68, 0.95) 100%)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    Explore Services
                  </Button>
                  <Button
                    to="/internships"
                    variant="outline"
                    size="lg"
                    iconRight={<Play className="w-5 h-5 fill-current" />}
                    className="px-8 py-4 text-lg font-bold rounded-2xl border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-105"
                  >
                    Start Learning
                  </Button>
                </div>

                {/* Stats Row */}
                <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 pt-8 border-t border-white/10">
                  {statsData.map((stat, i) => (
                    <div key={i} className="text-center hover:scale-105 transition-transform">
                      <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                        {stat.value}
                      </div>
                      <div className="text-sm text-white/60 font-medium flex items-center justify-center gap-1">
                        <stat.icon className="w-4 h-4" />
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Mobile Service Icons */}
      <div className="lg:hidden absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-3">
        {[
          { icon: Code, gradient: 'from-green-400 to-emerald-600' },
          { icon: Palette, gradient: 'from-pink-400 to-rose-600' },
          { icon: Video, gradient: 'from-orange-400 to-red-600' },
          { icon: Bot, gradient: 'from-cyan-400 to-blue-600' },
          { icon: Globe, gradient: 'from-teal-400 to-emerald-600' },
        ].map((item, i) => (
          <div
            key={i}
            className="p-3 rounded-xl backdrop-blur-xl animate-float"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              animationDelay: `${i * 0.2}s`
            }}
          >
            <item.icon className="w-5 h-5 text-white/80" strokeWidth={1.5} />
          </div>
        ))}
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-[4]" />
    </section>
  );
});

Hero.displayName = 'Hero';
export default Hero;