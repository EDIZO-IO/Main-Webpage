// frontend/src/pages/home/Hero.tsx
import { memo } from 'react';
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import { AnimatedSection } from './AnimatedSection';

const Hero = memo(() => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-red-50" aria-labelledby="hero-title">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-red-200/30 to-orange-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-200/30 to-pink-200/30 rounded-full blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-red-200 rounded-full shadow-sm">
                <Sparkles className="w-4 h-4 text-red-600" />
                <span className="text-sm font-semibold text-gray-700">Design.Develop.Deliver</span>
              </div>
            </div>
            <h1 id="hero-title" className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-center mb-6 leading-tight">
              <span className="text-gray-900">Welcome to </span>
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">EDIZO</span>
            </h1>
            <p className="text-xl md:text-2xl text-center text-gray-600 font-medium mb-4 max-w-3xl mx-auto">
              Creative Services & Real-World Learning — All in One Place
            </p>
            <p className="text-lg md:text-xl text-center text-gray-600 leading-relaxed mb-10 max-w-3xl mx-auto">
              Empowering brands with{' '}
              <span className="font-bold text-red-600">creative design</span>,{' '}
              <span className="font-bold text-red-600">reliable development</span>, and{' '}
              <span className="font-bold text-red-600">impactful digital solutions</span>
              {' '}— built with precision, passion, and trust.
              <br className="hidden md:block" />
              Launch your career with our exclusive{' '}
              <span className="font-bold text-red-600">internship programs</span>.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Button
                to="/services"
                variant="primary"
                size="lg"
                iconRight={<ArrowRight className="w-5 h-5" />}
                style={{
                  background: "linear-gradient(90deg, #fbbf24 0%, #f43f5e 100%)",
                  color: "#fff",
                  boxShadow: "0 4px 20px 0 rgba(251,191,36,0.3),0 8px 24px 0 rgba(244,63,94,0.2)"
                }}
              >
                Explore Services
              </Button>
              <Button
                to="/contact"
                variant="outline"
                size="lg"
              >
                Get in Touch
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 mt-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>10+ Happy Clients</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>25+ Projects Delivered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>5.0 Client Rating</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 105C120 90 240 60 360 52.5C480 45 600 60 720 67.5C840 75 960 75 1080 67.5C1200 60 1320 45 1380 37.5L1440 30V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" fillOpacity="0.5" />
        </svg>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
export default Hero;