// frontend/src/pages/home/Hero.tsx
import { memo, useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle, Code, Palette, Smartphone, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import { AnimatedSection } from './AnimatedSection';

// Original Typewriter phrases - UNCHANGED
const phrases = [
  "Creative Services & Real-World Learning",
  "Design Excellence & Innovation",
  "Web Development & App Solutions",
  "UI/UX Design & Digital Marketing",
  "Professional Internships & Training"
];

// Typewriter Component - UNCHANGED LOGIC
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

// NEW Glass Floating Card Component
const GlassFloatingCard = memo(({
  icon: Icon,
  title,
  subtitle,
  delay = 0,
  className = "",
  iconBg = "from-red-500 to-orange-500"
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  delay?: number;
  className?: string;
  iconBg?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.6, delay }}
    className={`backdrop-blur-xl bg-white/70 border border-white/50 rounded-2xl px-5 py-4 shadow-xl ${className}`}
    whileHover={{ scale: 1.05, y: -5 }}
  >
    <div className="flex items-center gap-3">
      <div className={`w-12 h-12 bg-gradient-to-br ${iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <span className="font-bold text-gray-800 text-sm block">{title}</span>
        {subtitle && <span className="text-xs text-gray-500">{subtitle}</span>}
      </div>
    </div>
  </motion.div>
));
GlassFloatingCard.displayName = 'GlassFloatingCard';

// Floating Stat Bubble
const FloatingStatBubble = memo(({
  value,
  label,
  delay = 0,
  className = ""
}: {
  value: string;
  label: string;
  delay?: number;
  className?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    className={`backdrop-blur-xl bg-white/80 border border-white/60 rounded-full px-5 py-3 shadow-lg ${className}`}
    whileHover={{ scale: 1.1 }}
  >
    <div className="text-center">
      <div className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">{value}</div>
      <div className="text-xs text-gray-600 font-medium">{label}</div>
    </div>
  </motion.div>
));
FloatingStatBubble.displayName = 'FloatingStatBubble';

const Hero = memo(() => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-orange-50/30" aria-labelledby="hero-title">
      {/* Background Elements with Grey tones */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[700px] h-[700px] bg-gradient-to-br from-red-200/40 to-orange-200/40 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 25, 0], x: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-gray-200/50 to-slate-200/50 rounded-full blur-3xl"
        />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content - ORIGINAL CONTENT */}
          <div className="text-left">
            <AnimatedSection>
              {/* Brand Badge with glass effect */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 backdrop-blur-xl bg-white/70 border border-white/50 rounded-full mb-8 shadow-lg">
                <Sparkles className="w-5 h-5 text-red-500" />
                <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">Design.Develop.Deliver</span>
              </div>

              {/* Original Title with brand colors */}
              <h1 id="hero-title" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
                <span className="text-gray-800">Welcome to </span>
                <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">EDIZO</span>
              </h1>

              {/* Original Typewriter Animation */}
              <div className="text-xl md:text-2xl text-gray-600 font-medium mb-4 max-w-3xl">
                <TypewriterText />
                <span className="text-gray-500"> — All in One Place</span>
              </div>

              {/* Original Description */}
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-10 max-w-xl">
                Empowering brands with{' '}
                <span className="font-bold text-red-600">creative design</span>,{' '}
                <span className="font-bold text-orange-600">reliable development</span>, and{' '}
                <span className="font-bold text-red-500">impactful digital solutions</span>
                {' '}— built with precision, passion, and trust.
                <br className="hidden md:block" />
                Launch your career with our exclusive{' '}
                <span className="font-bold text-orange-500">internship programs</span>.
              </p>

              {/* Original Buttons with brand colors */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10">
                <Button
                  to="/services"
                  variant="primary"
                  size="lg"
                  iconRight={<ArrowRight className="w-5 h-5" />}
                  style={{
                    background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
                    color: "#fff",
                    boxShadow: "0 10px 40px -10px rgba(220,38,38,0.5)"
                  }}
                >
                  Explore Services
                </Button>
                <Button
                  to="/contact"
                  variant="outline"
                  size="lg"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 backdrop-blur-sm bg-white/50"
                >
                  Get in Touch
                </Button>
              </div>

              {/* Original Stats with grey styling */}
              <div className="flex flex-wrap items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>10+ Happy Clients</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>25+ Projects Delivered</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>5.0 Client Rating</span>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right Visual - NEW FLOATING ICONS DESIGN */}
          <div className="relative hidden lg:block h-[550px]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative w-full h-full"
            >
              {/* Central gradient shape */}
              <motion.div
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-red-500/20 via-orange-400/20 to-yellow-300/20 rounded-[3rem] blur-2xl"
              />

              {/* Glass morphism main card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-0 w-64 backdrop-blur-xl bg-white/60 border border-white/50 rounded-3xl shadow-2xl p-6"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Fast Delivery</h3>
                <p className="text-sm text-gray-600">Quick turnaround without compromising quality</p>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-2 flex-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full" />
                </div>
              </motion.div>

              {/* Floating service cards */}
              <GlassFloatingCard
                icon={Code}
                title="Web Development"
                subtitle="React & Next.js"
                delay={0.5}
                className="absolute top-0 left-8"
                iconBg="from-red-500 to-rose-500"
              />

              <GlassFloatingCard
                icon={Palette}
                title="UI/UX Design"
                subtitle="Figma & Adobe"
                delay={0.7}
                className="absolute bottom-32 left-0"
                iconBg="from-orange-500 to-amber-500"
              />

              <GlassFloatingCard
                icon={Smartphone}
                title="App Development"
                subtitle="Flutter & React Native"
                delay={0.9}
                className="absolute bottom-8 right-12"
                iconBg="from-red-600 to-orange-600"
              />

              {/* Floating stat bubbles */}
              <FloatingStatBubble
                value="25+"
                label="Projects"
                delay={0.6}
                className="absolute top-40 left-4"
              />

              <FloatingStatBubble
                value="5.0"
                label="Rating"
                delay={0.8}
                className="absolute bottom-40 right-4"
              />

              {/* Small decorative elements */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-32 right-32 w-4 h-4 bg-gradient-to-br from-red-400 to-orange-400 rounded-full blur-sm"
              />
              <motion.div
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute bottom-48 left-24 w-3 h-3 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full blur-sm"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Wave with grey */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 105C120 90 240 60 360 52.5C480 45 600 60 720 67.5C840 75 960 75 1080 67.5C1200 60 1320 45 1380 37.5L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.8" />
        </svg>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
export default Hero;