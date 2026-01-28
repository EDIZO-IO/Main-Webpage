// frontend/src/pages/home/Hero.tsx
import { memo, useState, useEffect, useMemo } from 'react';
import { Sparkles, ArrowRight, CheckCircle, Code, Palette, Smartphone, Zap, Play, Star, Bot, Video, Globe, Award, Users } from 'lucide-react';
import Button from '../../components/common/Button';
import { AnimatedSection } from './AnimatedSection';
import { useStats } from '../../components/hooks/useStats';
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

const Hero = memo(() => {
  const { stats } = useStats();
  const { ref, isVisible } = useReveal();

  const statsData = useMemo(() => [
    { value: stats.happy_clients?.value || '10+', label: stats.happy_clients?.label || 'Happy Clients', icon: CheckCircle },
    { value: stats.projects_delivered?.value || '25+', label: stats.projects_delivered?.label || 'Projects Done', icon: CheckCircle },
    { value: stats.client_rating?.value || '5.0', label: stats.client_rating?.label || 'Client Rating', icon: Star },
    { value: stats.students_trained?.value || '500+', label: stats.students_trained?.label || 'Students Trained', icon: Users },
  ], [stats]);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-white" aria-labelledby="hero-title">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-64 h-64 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-12 relative z-10 pt-24 pb-16 md:pt-32 md:pb-24 min-h-screen flex items-center">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <AnimatedSection>
                {/* Brand Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full mb-6 shadow-sm">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-semibold text-gray-700">Design.Develop.Learn</span>
                </div>

                {/* Main Title */}
                <h1
                  id="hero-title"
                  className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
                >
                  <span className="text-gray-900">Transform Your Business with </span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                   Edizo
                  </span>
                </h1>

                {/* Typewriter */}
                <div className="text-lg md:text-xl text-gray-700 font-medium mb-6">
                  <TypewriterText />
                </div>

                {/* Description */}
                <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8 max-w-2xl">
                  Empowering brands with{' '}
                  <span className="font-bold text-orange-600">creative design</span>,{' '}
                  <span className="font-bold text-red-600">reliable development</span>, and{' '}
                  <span className="font-bold text-orange-500">impactful digital solutions</span>
                  {' '}— built with precision, passion, and trust.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-start gap-4 mb-8">
                  <Button
                    to="/services"
                    variant="primary"
                    size="lg"
                    iconRight={<ArrowRight className="w-5 h-5" />}
                    className="px-8 py-3 text-lg font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
                    style={{
                      background: "linear-gradient(135deg, rgba(249, 115, 22, 1) 0%, rgba(239, 68, 68, 1) 100%)",
                    }}
                  >
                    Explore Services
                  </Button>
                  <Button
                    to="/contact"
                    variant="outline"
                    size="lg"
                    className="px-8 py-3 text-lg font-bold rounded-xl border-2 border-gray-300 text-gray-800 hover:bg-gray-50 transition-all"
                  >
                    Contact Us
                  </Button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
                  {statsData.map((stat, i) => (
                    <div key={i} className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-200">
                      <div className="text-2xl md:text-3xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-600 font-medium flex items-center justify-center gap-1 mt-1">
                        <stat.icon className="w-3 h-3" />
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-2xl flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                    <div className="bg-white rounded-xl w-48 h-48 md:w-60 md:h-60 flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="text-4xl font-bold text-gray-800 mb-2">EDIZO</div>
                        <div className="text-gray-600">Digital Solutions</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center border border-gray-200">
                  <Code className="w-8 h-8 text-orange-500" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center border border-gray-200">
                  <Palette className="w-8 h-8 text-red-500" />
                </div>
                <div className="absolute top-1/2 -left-8 w-12 h-12 bg-white rounded-lg shadow-lg flex items-center justify-center border border-gray-200">
                  <Smartphone className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
export default Hero;