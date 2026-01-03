// frontend/src/pages/home/FinalCTA.tsx
import { memo } from 'react';
import { Sparkles, ArrowRight, CheckCircle, Code, Palette, Video, Server, Bot, Globe } from 'lucide-react';
import Button from '../../components/common/Button';
import { AnimatedSection } from './AnimatedSection';

const FinalCTA = memo(() => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Simple static background */}
      <div className="absolute top-10 right-10 w-48 h-48 bg-red-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl mb-6 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Ready to Be Our Next Success Story?
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
              Join 10+ clients who trust us with their digital transformation.
            </p>

            {/* Service category icons row */}
            <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
              {[Code, Palette, Video, Bot, Server, Globe].map((Icon, i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-white/10 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Icon className="w-5 h-5 text-white/70" strokeWidth={1.5} />
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button
                to="/contact"
                variant="primary"
                size="lg"
                iconRight={<ArrowRight className="w-5 h-5" />}
                style={{
                  background: "linear-gradient(135deg, #dc2626 0%, #ea580c 100%)",
                  boxShadow: "0 10px 30px -8px rgba(220,38,38,0.5)"
                }}
              >
                Contact Us Today
              </Button>
              <Button
                to="/services"
                variant="secondary"
                size="lg"
                className="bg-white/10 text-white border-2 border-white/20 hover:bg-white hover:text-gray-900"
              >
                View Our Services
              </Button>
            </div>

            {/* Guarantee badges */}
            <div className="flex items-center justify-center gap-6 flex-wrap text-gray-400">
              <span className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                100% Satisfaction Guaranteed
              </span>
              <span className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-400" />
                Free Consultation
              </span>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
});

FinalCTA.displayName = 'FinalCTA';
export default FinalCTA;