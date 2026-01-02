// frontend/src/pages/home/Hero.tsx
import { memo, useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle, Code, Palette, Smartphone, Zap, Play, Star, Bot, Video, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import { AnimatedSection } from './AnimatedSection';

// Typewriter phrases
const phrases = [
  "Creative Services & Real-World Learning",
  "Design Excellence & Innovation",
  "Web Development & App Solutions",
  "UI/UX Design & Digital Marketing",
  "Professional Internships & Training"
];

// Typewriter Component
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
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[3px] h-[1em] bg-gradient-to-b from-red-500 to-orange-500 ml-1 align-middle"
      />
    </span>
  );
});
TypewriterText.displayName = 'TypewriterText';

// Floating Service Icon Component
const FloatingServiceIcon = memo(({
  icon: Icon,
  gradient,
  delay = 0,
  position,
  floatDirection = 'up'
}: {
  icon: React.ElementType;
  gradient: string;
  delay?: number;
  position: string;
  floatDirection?: 'up' | 'down';
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1, y: floatDirection === 'up' ? [0, -12, 0] : [0, 12, 0] }}
    transition={{
      opacity: { delay, duration: 0.5 },
      scale: { delay, duration: 0.5 },
      y: { delay: delay + 0.5, duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }
    }}
    whileHover={{ scale: 1.2, rotate: 10 }}
    className={`absolute ${position} p-4 rounded-2xl backdrop-blur-xl border border-white/30 shadow-2xl cursor-pointer`}
    style={{ background: 'rgba(255, 255, 255, 0.15)' }}
  >
    <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
      <Icon className="w-6 h-6 text-white" strokeWidth={2} />
    </div>
  </motion.div>
));
FloatingServiceIcon.displayName = 'FloatingServiceIcon';

// Glass Stats Card
const GlassStatsCard = memo(({
  value,
  label,
  icon: Icon,
  delay = 0
}: {
  value: string;
  label: string;
  icon: React.ElementType;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ scale: 1.05, y: -5 }}
    className="flex items-center gap-3 px-5 py-4 rounded-2xl backdrop-blur-xl border border-white/30 shadow-xl"
    style={{ background: 'rgba(255, 255, 255, 0.12)' }}
  >
    <div className="p-2 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 shadow-lg">
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div>
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-sm text-white/70 font-medium">{label}</div>
    </div>
  </motion.div>
));
GlassStatsCard.displayName = 'GlassStatsCard';

const Hero = memo(() => {
  return (
    <section className="relative min-h-screen overflow-hidden" aria-labelledby="hero-title">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/assets/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay with Gradient */}
      <div className="absolute inset-0 z-[1]" style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.85) 50%, rgba(15, 23, 42, 0.95) 100%)'
      }} />

      {/* Animated Gradient Blobs */}
      <div className="absolute inset-0 z-[2] overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0], x: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-[700px] h-[700px] -top-64 -left-64 rounded-full opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, transparent 60%)' }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute w-[600px] h-[600px] top-1/2 -right-48 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(239, 68, 68, 0.35) 0%, transparent 60%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute w-[500px] h-[500px] -bottom-48 left-1/3 rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 60%)' }}
        />
      </div>

      {/* Floating Service Icons - Left Side */}
      <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-5 z-[5]">
        <FloatingServiceIcon icon={Code} gradient="from-green-400 to-emerald-600" delay={0.6} position="" floatDirection="up" />
        <FloatingServiceIcon icon={Palette} gradient="from-pink-400 to-rose-600" delay={0.8} position="" floatDirection="down" />
        <FloatingServiceIcon icon={Bot} gradient="from-cyan-400 to-blue-600" delay={1.0} position="" floatDirection="up" />
        <FloatingServiceIcon icon={Video} gradient="from-orange-400 to-red-600" delay={1.2} position="" floatDirection="down" />
      </div>

      {/* Floating Service Icons - Right Side */}
      <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-5 z-[5]">
        <FloatingServiceIcon icon={Globe} gradient="from-teal-400 to-emerald-600" delay={0.7} position="" floatDirection="down" />
        <FloatingServiceIcon icon={Smartphone} gradient="from-purple-400 to-violet-600" delay={0.9} position="" floatDirection="up" />
        <FloatingServiceIcon icon={Zap} gradient="from-yellow-400 to-orange-600" delay={1.1} position="" floatDirection="down" />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-12 relative z-10 pt-32 pb-20 md:pt-40 md:pb-32 min-h-screen flex items-center">
        <div className="w-full max-w-5xl mx-auto">
          <AnimatedSection>
            {/* Central Glass Card */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8 }}
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
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-8"
                  style={{
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.25) 0%, rgba(239, 68, 68, 0.25) 100%)',
                    border: '1px solid rgba(249, 115, 22, 0.4)',
                  }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                  <span className="text-sm font-bold text-white/90">Design.Develop.Learn</span>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  </motion.div>
                </motion.div>

                {/* Main Title */}
                <motion.h1
                  id="hero-title"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
                >
                  <span className="text-white">Welcome to </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-orange-500">
                    EDIZO
                  </span>
                </motion.h1>

                {/* Typewriter */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-xl md:text-2xl lg:text-3xl text-white/80 font-medium mb-6"
                >
                  <TypewriterText />
                </motion.div>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="text-base md:text-lg text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto"
                >
                  Empowering brands with{' '}
                  <span className="font-bold text-orange-400">creative design</span>,{' '}
                  <span className="font-bold text-red-400">reliable development</span>, and{' '}
                  <span className="font-bold text-orange-300">impactful digital solutions</span>
                  {' '}— built with precision, passion, and trust.
                </motion.p>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                >
                  <Button
                    to="/services"
                    variant="primary"
                    size="lg"
                    iconRight={<ArrowRight className="w-5 h-5" />}
                    className="px-8 py-4 text-lg font-bold rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
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
                </motion.div>

                {/* Stats Row */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="flex flex-wrap items-center justify-center gap-6 md:gap-10 pt-8 border-t border-white/10"
                >
                  {[
                    { value: '10+', label: 'Happy Clients', icon: CheckCircle },
                    { value: '25+', label: 'Projects Done', icon: Code },
                    { value: '5.0', label: 'Client Rating', icon: Star },
                    { value: '500+', label: 'Students Trained', icon: Bot },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.1, y: -5 }}
                      className="text-center"
                    >
                      <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                        {stat.value}
                      </div>
                      <div className="text-sm text-white/60 font-medium flex items-center justify-center gap-1">
                        <stat.icon className="w-4 h-4" />
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>
      </div>

      {/* Mobile Service Icons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="lg:hidden absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-3"
      >
        {[
          { icon: Code, gradient: 'from-green-400 to-emerald-600' },
          { icon: Palette, gradient: 'from-pink-400 to-rose-600' },
          { icon: Video, gradient: 'from-orange-400 to-red-600' },
          { icon: Bot, gradient: 'from-cyan-400 to-blue-600' },
          { icon: Globe, gradient: 'from-teal-400 to-emerald-600' },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.1 }}
            animate={{ y: [0, -4, 0] }}
            transition={{ y: { repeat: Infinity, duration: 2 + i * 0.2, delay: i * 0.1 } }}
            className="p-3 rounded-xl backdrop-blur-xl"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <item.icon className="w-5 h-5 text-white/80" strokeWidth={1.5} />
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent z-[4]" />
    </section>
  );
});

Hero.displayName = 'Hero';
export default Hero;